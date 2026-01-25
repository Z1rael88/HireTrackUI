import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { toast } from "react-toastify";

import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";

import { useGetVacanciesByHrIdQuery } from "../../../api/vacanciesApi";
import { resumesApi, useChangeResumeStatusMutation } from "../../../api/resumesApi";
import type { ResumeResponse } from "../../../types/resume";
import type { VacancyResponse } from "../../../types/vacancy";
import { ResumeStatus } from "../../../types/enums";
import { RESUME_STATUS } from "../../../types/enumLabels";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { COLORS } from "../../../style/ColorTheme";

import CandidateCard from "./CandidateCard";

type ResumeWithVacancy = ResumeResponse & {
  status: ResumeStatus;
  vacancyId: number;
  vacancyTitle: string;
};

type VacancyLike = VacancyResponse & {
  title?: string | null;
  name?: string | null;
};

const STATUSES = [ResumeStatus.Sent, ResumeStatus.Pending, ResumeStatus.Accepted, ResumeStatus.Rejected] as const;

function isVacancyActive(vacancy: VacancyResponse) {
  if (!vacancy.endDate) return true;
  const endDate = new Date(vacancy.endDate);
  return Number.isFinite(endDate.getTime()) && endDate.getTime() >= Date.now();
}

function getVacancyTitle(vacancy: VacancyLike) {
  return (vacancy.title ?? vacancy.name ?? "—").toString().trim() || "—";
}

function groupByStatus(items: ResumeWithVacancy[]) {
  const grouped: Record<ResumeStatus, ResumeWithVacancy[]> = {
    [ResumeStatus.Sent]: [],
    [ResumeStatus.Pending]: [],
    [ResumeStatus.Accepted]: [],
    [ResumeStatus.Rejected]: []
  };

  for (const item of items) {
    grouped[item.status].push(item);
  }

  return grouped;
}

type SectionProps = {
  title: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  children: ReactNode;
};

function Section({ title, icon, rightSlot, children }: SectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${COLORS.borderSoft}`,
        bgcolor: alpha(COLORS.surface, 0.94),
        borderRadius: 3,
        p: { xs: 2, md: 2.5 },
        boxShadow: "0 10px 28px rgba(17,19,24,0.06)"
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1}
        sx={{ mb: 1.5 }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.textPrimary }}>
            {title}
          </Typography>
        </Stack>

        {rightSlot}
      </Stack>

      {children}
    </Paper>
  );
}

function statusChipIcon(status: ResumeStatus): ReactElement {
  if (status === ResumeStatus.Accepted) return <DoneRoundedIcon sx={{ color: "success.main" }} />;
  if (status === ResumeStatus.Rejected) return <ThumbDownAltRoundedIcon sx={{ color: "error.main" }} />;
  return <WorkOutlineRoundedIcon sx={{ color: COLORS.accent }} />;
}

export default function HrRecruitmentPage() {
  const dispatch = useDispatch<AppDispatch>();

  const rawUserId = useSelector((state: RootState) => state.user.id);
  const hrId = rawUserId != null ? Number(rawUserId) : null;
  const canFetch = hrId != null && Number.isFinite(hrId);

  const { data: vacancies, isLoading: vacanciesLoading, isError: vacanciesError } = useGetVacanciesByHrIdQuery(
    canFetch ? hrId! : 0,
    { skip: !canFetch }
  );

  const didToastVacanciesError = useRef(false);

  useEffect(() => {
    if (vacanciesError && !didToastVacanciesError.current) {
      didToastVacanciesError.current = true;
      toast.error("Nie udało się pobrać danych.");
    }

    if (!vacanciesError) {
      didToastVacanciesError.current = false;
    }
  }, [vacanciesError]);

  const myVacancies = useMemo(() => {
    return (vacancies ?? []).filter(isVacancyActive);
  }, [vacancies]);

  const vacancyTitles = useMemo(() => {
    const map = new Map<number, string>();

    for (const vacancy of myVacancies) {
      const id = Number(vacancy.id);
      if (!Number.isFinite(id)) continue;
      map.set(id, getVacancyTitle(vacancy as VacancyLike));
    }

    return map;
  }, [myVacancies]);

  const vacancyIds = useMemo(() => Array.from(vacancyTitles.keys()).sort((a, b) => a - b), [vacancyTitles]);

  const [items, setItems] = useState<ResumeWithVacancy[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);

  const [changeResumeStatus, { isLoading: isUpdating }] = useChangeResumeStatusMutation();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (vacancyIds.length === 0) {
      setItems([]);
      setResumesLoading(false);
      return;
    }

    let cancelled = false;
    setResumesLoading(true);

    const subs = vacancyIds.map((vacancyId) => dispatch(resumesApi.endpoints.getResumeByVacancyId.initiate(vacancyId)));

    Promise.all(subs.map((sub) => sub.unwrap().catch(() => [] as ResumeResponse[])))
      .then((lists) => {
        if (cancelled) return;

        const merged: ResumeWithVacancy[] = [];

        for (let i = 0; i < lists.length; i += 1) {
          const vacancyId = vacancyIds[i];
          const vacancyTitle = vacancyTitles.get(vacancyId) ?? "—";
          const list = Array.isArray(lists[i]) ? lists[i] : [];

          for (const raw of list as Array<ResumeResponse & { status?: number | string }>) {
            const statusNum = typeof raw.status === "number" ? raw.status : Number(raw.status);
            if (!Number.isFinite(statusNum)) continue;

            const status = statusNum as ResumeStatus;
            if (!STATUSES.includes(status)) continue;

            merged.push({
              ...raw,
              status,
              vacancyId,
              vacancyTitle
            });
          }
        }

        merged.sort((a, b) => Number(b.id) - Number(a.id));
        setItems(merged);
      })
      .finally(() => {
        if (!cancelled) setResumesLoading(false);
      });

    return () => {
      cancelled = true;
      subs.forEach((sub) => sub.unsubscribe());
    };
  }, [dispatch, vacancyIds, vacancyTitles]);

  const grouped = useMemo(() => groupByStatus(items), [items]);
  const total = items.length;

  const handleChangeStatus = async (resumeId: number, vacancyId: number, next: ResumeStatus, prev: ResumeStatus) => {
    setUpdatingId(resumeId);
    setItems((current) => current.map((it) => (it.id === resumeId && it.vacancyId === vacancyId ? {
      ...it,
      status: next
    } : it)));

    try {
      await changeResumeStatus({ resumeId, vacancyId, status: next }).unwrap();
    } catch (error) {
      const e = error as { data?: { errors?: string[]; message?: string }; error?: string };
      setItems((current) => current.map((it) => (it.id === resumeId && it.vacancyId === vacancyId ? {
        ...it,
        status: prev
      } : it)));
      toast.error(e.data?.errors?.[0] ?? e.data?.message ?? e.error ?? "Server error");
    } finally {
      setUpdatingId(null);
    }
  };

  const loading = vacanciesLoading || resumesLoading;

  const renderEmpty = () => (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 2,
        border: `1px dashed ${COLORS.borderSoft}`,
        bgcolor: alpha(COLORS.surface, 0.92),
        textAlign: "center",
        color: COLORS.textSecondary
      }}
    >
      Brak danych
    </Box>
  );

  const renderColumns = (statuses: ResumeStatus[]) => (
    <Stack direction={{ xs: "column", md: "row" }} gap={2}>
      {statuses.map((status) => (
        <Box key={status} sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 3,
              border: `1px solid ${COLORS.borderSoft}`,
              bgcolor: alpha(COLORS.surface, 0.94)
            }}
          >
            <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
              {statusChipIcon(status)}

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: status === ResumeStatus.Rejected ? "error.main" : COLORS.textPrimary
                }}
              >
                {RESUME_STATUS[status]}
              </Typography>

              <Chip
                size="small"
                label={grouped[status].length}
                sx={{
                  borderRadius: 999,
                  bgcolor: alpha(COLORS.black, 0.04),
                  color: COLORS.textPrimary,
                  fontWeight: 900
                }}
              />
            </Stack>

            {grouped[status].length === 0 ? (
              renderEmpty()
            ) : (
              <Stack gap={1.25}>
                {grouped[status].map((item) => (
                  <CandidateCard
                    key={`${item.vacancyId}-${item.id}`}
                    item={item}
                    statusIcon={statusChipIcon(item.status)}
                    onChangeStatus={handleChangeStatus}
                    isUpdating={isUpdating && updatingId === item.id}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box>
      <Stack gap={2.5}>
        <Section
          title="Podsumowanie"
          icon={<TimelineRoundedIcon sx={{ color: COLORS.accent }} />}
          rightSlot={
            <Chip
              size="small"
              label={`Łącznie: ${total}`}
              sx={{
                borderRadius: 999,
                bgcolor: alpha(COLORS.black, 0.04),
                color: COLORS.textPrimary,
                fontWeight: 900
              }}
            />
          }
        >
          {loading ? (
            <LinearProgress />
          ) : total === 0 ? (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px dashed ${COLORS.borderSoft}`,
                textAlign: "center",
                bgcolor: alpha(COLORS.surface, 0.94)
              }}
            >
              <Typography sx={{ color: COLORS.textSecondary }}>Brak danych</Typography>
            </Box>
          ) : (
            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
              {STATUSES.map((status) => (
                <Box key={status} sx={{ flex: 1, minWidth: 0 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      border: `1px solid ${COLORS.borderSoft}`,
                      bgcolor: alpha(COLORS.surface, 0.92)
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={1.25}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: alpha(COLORS.accent, 0.16),
                          color: COLORS.textPrimary,
                          border: `1px solid ${alpha(COLORS.accent, 0.26)}`
                        }}
                      >
                        {statusChipIcon(status)}
                      </Avatar>

                      <Box>
                        <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1 }}>
                          {grouped[status].length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                          {RESUME_STATUS[status]}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              ))}
            </Stack>
          )}
        </Section>

        <Section
          title="Wczesne etapy"
          icon={<WorkOutlineRoundedIcon sx={{ color: COLORS.accent }} />}
          rightSlot={
            <Chip
              size="small"
              label={`${grouped[ResumeStatus.Sent].length + grouped[ResumeStatus.Pending].length} kandydatów`}
              sx={{
                borderRadius: 999,
                bgcolor: alpha(COLORS.black, 0.04),
                color: COLORS.textPrimary,
                fontWeight: 900
              }}
            />
          }
        >
          {renderColumns([ResumeStatus.Sent, ResumeStatus.Pending])}
        </Section>

        <Section
          title="Końcowe etapy"
          icon={<DoneRoundedIcon sx={{ color: "success.main" }} />}
          rightSlot={
            <Chip
              size="small"
              label={`${grouped[ResumeStatus.Accepted].length + grouped[ResumeStatus.Rejected].length} kandydatów`}
              sx={{
                borderRadius: 999,
                bgcolor: alpha(COLORS.black, 0.04),
                color: COLORS.textPrimary,
                fontWeight: 900
              }}
            />
          }
        >
          {renderColumns([ResumeStatus.Accepted, ResumeStatus.Rejected])}
        </Section>
      </Stack>
    </Box>
  );
}