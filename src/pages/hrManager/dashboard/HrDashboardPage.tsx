import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

import { useGetVacanciesByHrIdQuery } from "../../../api/vacanciesApi";
import { resumesApi } from "../../../api/resumesApi";
import type { ResumeResponse } from "../../../types/resume";
import type { VacancyResponse } from "../../../types/vacancy";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { selectUserProfile } from "../../../store/userSlice";
import { COLORS } from "../../../style/ColorTheme";

import Section from "./Section";
import VacancyLine from "./VacancyLine";
import HrDashboardCandidateMiniCard from "./HrDashboardCandidateMiniCard";
import { isActiveByEndDate } from "../../../utils/dateUtils";

type ResumeWithVacancyId = ResumeResponse & { vacancyId?: number };

function isActiveVacancy(vacancy: VacancyResponse) {
  return isActiveByEndDate(vacancy.endDate ?? null);
}


export default function HrDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector(selectUserProfile);
  const rawUserId = useSelector((state: RootState) => state.user.id);

  const hrId = rawUserId != null ? Number(rawUserId) : null;
  const hasHrId = hrId != null && Number.isFinite(hrId);

  const fullName = `${profile?.firstname ?? ""} ${profile?.lastname ?? ""}`.trim();
  const initials =
    `${profile?.firstname?.trim()?.[0] ?? ""}${profile?.lastname?.trim()?.[0] ?? ""}`.toUpperCase() || "HR";

  const { data: vacancies = [], isLoading, isError, refetch } = useGetVacanciesByHrIdQuery(hasHrId ? hrId! : 0, {
    skip: !hasHrId
  });

  useEffect(() => {
    if (isError) toast.error("Nie udało się pobrać ofert.");
  }, [isError]);

  const myActiveVacancies = useMemo(() => (vacancies ?? []).filter(isActiveVacancy), [vacancies]);

  const [resumes, setResumes] = useState<ResumeWithVacancyId[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);

  useEffect(() => {
    const ids = myActiveVacancies.map((v) => Number(v.id)).filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      setResumes([]);
      setResumesLoading(false);
      return;
    }

    let cancelled = false;
    setResumesLoading(true);

    const subs = ids.map((vacancyId) => dispatch(resumesApi.endpoints.getResumeByVacancyId.initiate(vacancyId)));

    Promise.all(
      subs.map((s, index) =>
        s
          .unwrap()
          .catch(() => [] as ResumeResponse[])
          .then((list) => {
            const vacancyId = ids[index];
            const arr = Array.isArray(list) ? list : [];
            return arr.map((r) => ({ ...r, vacancyId }));
          })
      )
    )
      .then((lists) => {
        if (cancelled) return;

        const unique = new Map<number, ResumeWithVacancyId>();
        for (const list of lists) {
          for (const item of list) unique.set(item.id, item);
        }

        const merged = Array.from(unique.values());
        merged.sort((a, b) => Number(b.id) - Number(a.id));
        setResumes(merged);
      })
      .finally(() => {
        if (!cancelled) setResumesLoading(false);
      });

    return () => {
      cancelled = true;
      subs.forEach((s) => s.unsubscribe());
    };
  }, [dispatch, myActiveVacancies]);

  const cardBorderColor = COLORS.borderSoft;
  const subtleBg = alpha(COLORS.surface, 0.92);

  const topStats = [
    { id: "offers", icon: <WorkRoundedIcon />, label: "Oferty", value: String(myActiveVacancies.length) },
    { id: "candidates", icon: <GroupRoundedIcon />, label: "Kandydaci", value: String(resumes.length) }
  ];

  const statCardSx = {
    p: 1.75,
    border: `1px solid ${cardBorderColor}`,
    bgcolor: alpha(COLORS.surface, 0.88),
    boxShadow: "0 2px 10px rgba(17,19,24,0.05)"
  } as const;

  const emptySx = {
    p: { xs: 2.5, sm: 3, md: 4 },
    border: `1px dashed ${cardBorderColor}`,
    textAlign: "center",
    bgcolor: alpha(COLORS.surface, 0.86)
  } as const;

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${cardBorderColor}`,
          bgcolor: subtleBg,
          p: { xs: 2, md: 2.5 },
          mb: 2,
          boxShadow: "0 6px 18px rgba(17,19,24,0.06)",
          backdropFilter: "blur(10px)"
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                bgcolor: alpha(COLORS.accent, 0.2),
                color: COLORS.textPrimary,
                border: `1px solid ${alpha(COLORS.accent, 0.35)}`,
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
                fontWeight: 900
              }}
            >
              {initials}
            </Avatar>

            <Box>
              <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 900, color: COLORS.textPrimary }}>
                {`Cześć${fullName ? `, ${fullName}` : ""} 👋`}
              </Typography>
            </Box>
          </Stack>

          <Button
            component={Link}
            to="/hr/vacancies/new"
            variant="contained"
            startIcon={<WorkRoundedIcon />}
            sx={{ fontWeight: 900, px: 2.25, width: { xs: "100%", md: "auto" } }}
          >
            Nowa oferta
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))"
            },
            gap: 1.5,
            mt: 1.25
          }}
        >
          {topStats.map((statItem) => (
            <Paper key={statItem.id} elevation={0} sx={statCardSx}>
              <Stack direction="row" alignItems="center" gap={1.25}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: alpha(COLORS.accent, 0.18),
                    color: COLORS.textPrimary,
                    border: `1px solid ${alpha(COLORS.accent, 0.28)}`
                  }}
                >
                  {statItem.icon}
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1 }}>
                    {statItem.value}
                  </Typography>

                  <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                    {statItem.label}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Paper>

      <Section title="Nowi kandydaci" icon={<GroupRoundedIcon sx={{ color: COLORS.accent }} />}>
        {resumesLoading && (
          <Stack gap={1}>
            <LinearProgress color="warning" />
          </Stack>
        )}

        {!resumesLoading && resumes.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))"
              },
              gap: 1.5
            }}
          >
            {resumes.slice(0, 4).map((resumeItem) => (
              <HrDashboardCandidateMiniCard key={resumeItem.id} resume={resumeItem}
                                            vacancyId={resumeItem.vacancyId || 0} />
            ))}
          </Box>
        )}

        {!resumesLoading && resumes.length === 0 && (
          <Paper elevation={0} sx={emptySx}>
            <Typography sx={{ color: COLORS.textSecondary }}>Brak danych</Typography>
          </Paper>
        )}
      </Section>

      <Box sx={{ mt: { xs: 2, md: 2.75 } }} />

      <Section title="Twoje oferty pracy" icon={<WorkRoundedIcon sx={{ color: COLORS.accent }} />}>
        {isLoading && (
          <Stack gap={1}>
            <LinearProgress color="warning" />
          </Stack>
        )}

        {isError && !isLoading && (
          <Stack gap={1} alignItems="flex-start">
            <Button
              onClick={() => refetch()}
              variant="outlined"
              sx={{
                borderColor: COLORS.border,
                color: COLORS.textPrimary,
                "&:hover": { borderColor: alpha(COLORS.black, 0.28) }
              }}
            >
              Spróbuj ponownie
            </Button>
          </Stack>
        )}

        {!isLoading && !isError && myActiveVacancies.length > 0 && (
          <Stack gap={1.25}>
            {myActiveVacancies.map((vacancyItem) => (
              <VacancyLine key={String(vacancyItem.id)} vacancy={vacancyItem} />
            ))}
          </Stack>
        )}

        {!isLoading && !isError && myActiveVacancies.length === 0 && (
          <Paper elevation={0} sx={{ ...emptySx, boxShadow: "0 12px 34px rgba(17,19,24,0.10)" }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.textPrimary, mb: 1 }}>
              Brak ogłoszeń
            </Typography>

            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
              Utwórz pierwszą ofertę, aby zacząć rekrutację.
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                component={Link}
                to="/hr/vacancies/new"
                variant="contained"
                sx={{ fontWeight: 900, px: 2.5, width: { xs: "100%", sm: "auto" } }}
              >
                Utwórz ofertę
              </Button>
            </Box>
          </Paper>
        )}
      </Section>
    </Box>
  );
}