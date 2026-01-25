import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { toast } from "react-toastify";

import { useGetResumeByVacancyIdQuery, useChangeResumeStatusMutation } from "../../../api/resumesApi";
import { useGetCrmTechnologyTypesQuery } from "../../../api/crmApi";
import { useSendGenericEmailMutation } from "../../../api/emailsApi";

import type { ResumeResponse } from "../../../types/resume";
import type { CandidateDto } from "../../../types/common";
import { ResumeStatus } from "../../../types/enums";
import {
  DEGREE,
  EDUCATION_TYPE,
  LANGUAGE,
  LANGUAGE_LEVEL,
  RESUME_STATUS,
  RESUME_STATUS_COLOR,
  WORK_TYPE
} from "../../../types/enumLabels";
import { COLORS } from "../../../style/ColorTheme";

type TechRef = { id?: number | string | null; name?: string | null };
type ApiTechnology = {
  technologyTypeId?: number | string | null;
  technologyType?: TechRef | null;
  technologyTypeDto?: TechRef | null;
  name?: string | null;
  yearsOfExperience?: number | string | null;
};

const toPositiveNumber = (value: number | string | null | undefined) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const formatPolishYears = (value: number) => {
  if (value === 1) return "1 rok";
  if (value >= 2 && value <= 4) return `${value} lata`;
  return `${value} lat`;
};

const toNumberArray = (value: unknown) => {
  if (value == null) return [];
  const raw = Array.isArray(value) ? value : [value];
  const out: number[] = [];
  for (const item of raw) {
    const n = Number(item);
    if (Number.isFinite(n)) out.push(n);
  }
  return out;
};

const getWorkTypesLabel = (workType: unknown) => {
  const labels = WORK_TYPE as Record<number, string>;
  const ids = toNumberArray(workType);
  if (!ids.length) return "—";

  const parts: string[] = [];
  for (const id of ids) parts.push(labels[id] ?? String(id));
  return parts.join(", ");
};

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => (p[0] ? p[0].toUpperCase() : ""))
    .join("");

const getTechnologyLabel = (tech: ApiTechnology, namesById: Map<number, string>) => {
  const id = toPositiveNumber(tech.technologyTypeId ?? tech.technologyType?.id ?? tech.technologyTypeDto?.id);
  const nameFromDict = id != null ? namesById.get(id) : undefined;
  const nameFromApi = (tech.technologyType?.name ?? tech.technologyTypeDto?.name ?? tech.name ?? "").trim();
  const name = nameFromDict ?? (nameFromApi || "Technologia");

  const years = toPositiveNumber(tech.yearsOfExperience);
  return years ? `${name} · ${formatPolishYears(years)}` : name;
};

function InfoLine({ icon, text }: { icon: React.ReactElement; text: string }) {
  return (
    <Stack direction="row" gap={0.5} alignItems="center" sx={{ color: COLORS.textMuted }}>
      {React.cloneElement(icon, { sx: { fontSize: 16, color: COLORS.textMuted } })}
      <Typography component="span" sx={{ color: COLORS.textMuted, fontSize: 13 }}>
        {text}
      </Typography>
    </Stack>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" gap={0.75} alignItems="baseline">
      <Typography variant="body2" sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function HrVacancyCandidatePage() {
  const { vacancyId: vacancyIdParam, resumeId: resumeIdParam } = useParams();
  const vacancyId = Number(vacancyIdParam);
  const resumeId = Number(resumeIdParam);

  const isValidLink = Number.isFinite(vacancyId) && vacancyId > 0 && Number.isFinite(resumeId) && resumeId > 0;

  const { data, isLoading, isError, refetch } = useGetResumeByVacancyIdQuery(vacancyId, {
    skip: !Number.isFinite(vacancyId) || vacancyId <= 0
  });

  const { data: technologyTypes = [] } = useGetCrmTechnologyTypesQuery();

  const technologyNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of technologyTypes as Array<{ id?: number | null; name?: string | null }>) {
      if (typeof item?.id === "number") map.set(item.id, item.name ?? `Technologia #${item.id}`);
    }
    return map;
  }, [technologyTypes]);

  const resumeList = (Array.isArray(data) ? data : data ? [data] : []) as ResumeResponse[];
  const resume = isValidLink ? resumeList.find((item) => Number(item.id) === resumeId) : undefined;
  const candidate = resume?.candidate as CandidateDto | undefined;

  type ResumeWithVacancyTitle = ResumeResponse & {
    vacancyName?: string | null;
    vacancy?: { name?: string | null; title?: string | null } | null;
  };

  const vacancyTitle = (() => {
    const r = resume as ResumeWithVacancyTitle | undefined;
    return r?.vacancy?.name || r?.vacancy?.title || r?.vacancyName || "Oferta pracy";
  })();

  const [selectedStatus, setSelectedStatus] = useState<ResumeStatus | null>(null);
  const [changeResumeStatus, { isLoading: isSavingStatus }] = useChangeResumeStatusMutation();

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Oferta pracy");
  const [emailBody, setEmailBody] = useState("Cześć!\n\nDziękujemy za aplikację. Chcielibyśmy zaprosić Cię na kolejną rozmowę…");
  const [sendGenericEmail, { isLoading: isSendingEmail }] = useSendGenericEmailMutation();

  useEffect(() => {
    setSelectedStatus((resume?.status as ResumeStatus | null | undefined) ?? null);
  }, [resume?.status]);

  if (isLoading) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <CircularProgress size={20} />
          <Typography sx={{ color: COLORS.textPrimary }}>Ładowanie kandydata…</Typography>
        </Stack>
      </Paper>
    );
  }

  if (!isValidLink) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 800, color: COLORS.error }}>Nieprawidłowy link.</Typography>
      </Paper>
    );
  }

  if (isError || !resume || !candidate) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Stack gap={1}>
          <Typography sx={{ fontWeight: 800, color: COLORS.error }}>Nie udało się pobrać danych kandydata.</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              refetch();
              toast.info("Odświeżam dane…");
            }}
            sx={{ alignSelf: "flex-start" }}
          >
            Spróbuj ponownie
          </Button>
        </Stack>
      </Paper>
    );
  }

  const shownStatus = selectedStatus ?? ((resume.status as ResumeStatus | null | undefined) ?? null);
  const statusChipColor = shownStatus != null ? RESUME_STATUS_COLOR[shownStatus] : "info";

  const yearsOfExperience = Number(resume.yearsOfExperience ?? 0);
  const expectedSalary = Number(resume.expectedSalary ?? 0);

  const city = candidate.address?.city ?? "";
  const country = candidate.address?.country ?? "";
  const locationLabel = city && country ? `${city}, ${country}` : city || country || "—";
  const workTypeLabel = getWorkTypesLabel(candidate.workType);

  const languages =
    resume.languageLevels?.map((item) => ({
      label: item.language != null ? LANGUAGE[item.language] ?? "Język" : "Język",
      level: item.level != null ? LANGUAGE_LEVEL[item.level] ?? "Poziom" : "Poziom"
    })) ?? [];

  const bio = candidate.bio?.trim() || "Brak opisu kandydata.";
  const fullName = `${candidate.firstname ?? ""} ${candidate.lastname ?? ""}`.trim();

  const handleSaveStatus = async () => {
    if (selectedStatus == null) return;

    try {
      await changeResumeStatus({ resumeId, vacancyId, status: selectedStatus }).unwrap();
      toast.success("Status zapisany.");
    } catch {
      toast.error("Nie udało się zapisać statusu.");
    }
  };

  const handleSendEmail = () => {
    const to = String(candidate.email ?? "").trim();
    if (!to) return;

    setEmailTo(to);
    setEmailSubject(`Oferta pracy: ${vacancyTitle}`);
    setEmailBody("Cześć!\n\nDziękujemy za aplikację. Chcielibyśmy zaprosić Cię na kolejną rozmowę…");
    setIsEmailModalOpen(true);
  };

  const handleConfirmSendEmail = async () => {
    const to = emailTo.trim();
    const subject = emailSubject.trim();
    const body = emailBody.trim();
    if (!to || !subject || !body) return;

    try {
      await sendGenericEmail({ to, subject, body }).unwrap();
      toast.success("Email wysłany.");
      setIsEmailModalOpen(false);
    } catch {
      toast.error("Nie udało się wysłać emaila.");
    }
  };

  return (
    <Stack gap={2.5}>
      <Paper elevation={0} className="glass" sx={{ p: 2.25 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          gap={2}
        >
          <Stack direction="row" gap={1.75} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar
              variant="rounded"
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: alpha(COLORS.accent, 0.18),
                color: COLORS.textPrimary,
                fontWeight: 900
              }}
            >
              {getInitials(fullName)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 18, color: COLORS.textPrimary, mb: 0.25 }} noWrap>
                {candidate.firstname} {candidate.lastname}
              </Typography>

              <Stack direction="row" gap={1.5} flexWrap="wrap">
                {candidate.email ? <InfoLine icon={<EmailRoundedIcon />} text={candidate.email} /> : null}
                {yearsOfExperience > 0 ? (
                  <InfoLine icon={<AccessTimeRoundedIcon />} text={`${yearsOfExperience} lat doświadczenia`} />
                ) : null}
                {locationLabel !== "—" ? <InfoLine icon={<PlaceRoundedIcon />} text={locationLabel} /> : null}
                {expectedSalary > 0 ? (
                  <InfoLine icon={<MonetizationOnRoundedIcon />} text={`Oczekiwanie: ${expectedSalary} PLN`} />
                ) : null}
                {workTypeLabel !== "—" ? (
                  <InfoLine icon={<WorkOutlineRoundedIcon />} text={`Typ pracy: ${workTypeLabel}`} />
                ) : null}
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" gap={1} flexWrap="wrap">
            {shownStatus != null ? (
              <Chip
                size="small"
                color={statusChipColor}
                label={RESUME_STATUS[shownStatus] ?? "Status"}
                sx={{ fontWeight: 800 }}
              />
            ) : null}

            <Button
              variant="contained"
              color="warning"
              startIcon={<EmailRoundedIcon />}
              onClick={handleSendEmail}
              disabled={!String(candidate.email ?? "").trim()}
            >
              Wyślij email
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Stack direction={{ xs: "column", md: "row" }} alignItems="flex-start" gap={2.5}>
        <Stack gap={2} sx={{ flex: 2, minWidth: 0 }}>
          <Paper elevation={0} className="section" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, mb: 0.75 }}>O kandydacie</Typography>
            <Typography sx={{ color: COLORS.textPrimary }}>{bio}</Typography>
          </Paper>

          <Paper elevation={0} className="section" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, mb: 1 }}>Doświadczenie</Typography>

            {!resume.jobExperiences?.length ? (
              <Typography sx={{ color: COLORS.textMuted, fontStyle: "italic" }}>Brak wpisów doświadczenia.</Typography>
            ) : null}

            <Stack gap={1.5}>
              {resume.jobExperiences?.map((job, index) => (
                <Box key={`${job.nameOfCompany ?? "Firma"}-${index}`} className="glass-soft" sx={{ p: 1.25 }}>
                  <Typography sx={{ fontWeight: 800, color: COLORS.textPrimary, mb: 0.25 }}>
                    {job.nameOfCompany || "Firma"}
                  </Typography>

                  <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 0.5 }}>
                    {(job.startDate || "—") + " — " + (job.endDate || "obecnie")}
                  </Typography>

                  {job.description ? (
                    <Typography variant="body2" sx={{ color: COLORS.textPrimary, mb: 0.75 }}>
                      {job.description}
                    </Typography>
                  ) : null}

                  {job.technologies?.length ? (
                    <Stack direction="row" gap={0.75} flexWrap="wrap">
                      {job.technologies.map((tech, techIndex) => {
                        const label = getTechnologyLabel(tech as ApiTechnology, technologyNameById);
                        return (
                          <Chip
                            key={`${label}-${techIndex}`}
                            size="small"
                            variant="outlined"
                            label={label}
                            sx={{ fontSize: 12, fontWeight: 700 }}
                          />
                        );
                      })}
                    </Stack>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={0} className="section" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, mb: 1 }}>Edukacja</Typography>

            {!resume.educations?.length ? (
              <Typography sx={{ color: COLORS.textMuted, fontStyle: "italic" }}>Brak wpisów edukacji.</Typography>
            ) : null}

            <Stack gap={1.5}>
              {resume.educations?.map((edu, index) => (
                <Box key={`${edu.title ?? "Edukacja"}-${index}`} className="glass-soft" sx={{ p: 1.25 }}>
                  <Typography sx={{ fontWeight: 800, color: COLORS.textPrimary, mb: 0.25 }}>
                    {edu.title || "Edukacja"}
                  </Typography>

                  <Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
                    {(EDUCATION_TYPE[edu.educationType] ?? "—") + ", " + (DEGREE[edu.degree] ?? "—")}
                  </Typography>

                  <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 0.5 }}>
                    {(edu.startDate || "—") + " — " + (edu.endDate || "obecnie")}
                  </Typography>

                  {edu.description ? (
                    <Typography variant="body2" sx={{ color: COLORS.textPrimary }}>
                      {edu.description}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={0} className="section" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, mb: 1 }}>Języki</Typography>

            {!languages.length ? (
              <Typography sx={{ color: COLORS.textMuted, fontStyle: "italic" }}>Brak danych językowych.</Typography>
            ) : (
              <Stack component="ul" sx={{ pl: 2, m: 0 }} gap={0.5}>
                {languages.map((lang, index) => (
                  <Typography key={`${lang.label}-${index}`} component="li" sx={{ color: COLORS.textPrimary }}>
                    {lang.label} · {lang.level}
                  </Typography>
                ))}
              </Stack>
            )}
          </Paper>
        </Stack>

        <Stack gap={2} sx={{ flex: 1, minWidth: 0 }}>
          <Paper elevation={0} className="section" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, mb: 1 }}>Status aplikacji</Typography>

            <Stack gap={1.5}>
              <TextField
                select
                size="small"
                label="Status"
                value={selectedStatus ?? ""}
                onChange={(event) => {
                  const v = event.target.value;
                  setSelectedStatus(v === "" ? null : (Number(v) as ResumeStatus));
                }}
              >
                <MenuItem value="">Wybierz status</MenuItem>
                {Object.values(ResumeStatus)
                  .filter((v): v is ResumeStatus => typeof v === "number")
                  .map((status) => (
                    <MenuItem key={status} value={status}>
                      {RESUME_STATUS[status]}
                    </MenuItem>
                  ))}
              </TextField>

              <Button
                variant="contained"
                color="warning"
                onClick={handleSaveStatus}
                disabled={selectedStatus == null || isSavingStatus}
                sx={{ fontWeight: 800 }}
              >
                {isSavingStatus ? (
                  <Stack direction="row" gap={1} alignItems="center" justifyContent="center">
                    <CircularProgress size={16} />
                    <Typography component="span">Zapisywanie…</Typography>
                  </Stack>
                ) : (
                  "Zapisz status"
                )}
              </Button>
            </Stack>
          </Paper>

          <Paper elevation={0} className="section" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 900, color: COLORS.textPrimary, mb: 1 }}>Kontakt</Typography>

            <Stack gap={0.75}>
              <ContactRow label="Email:" value={String(candidate.email ?? "").trim() || "—"} />
              <ContactRow label="Lokalizacja:" value={locationLabel} />
              <ContactRow label="Typ pracy:" value={workTypeLabel} />
              <ContactRow
                label="Oczekiwane wynagrodzenie:"
                value={expectedSalary > 0 ? `${expectedSalary} PLN` : "—"}
              />
            </Stack>

            <Divider sx={{ my: 1.25 }} />

            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Użyj przycisku „Wyślij email”, aby szybko skontaktować się z kandydatem.
            </Typography>
          </Paper>
        </Stack>
      </Stack>

      <Dialog open={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900, color: COLORS.textPrimary }}>Wyślij email do kandydata</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack gap={1.5} sx={{ mt: 1 }}>
            <TextField label="Do" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} size="small" fullWidth />
            <TextField
              label="Temat"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Treść"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              multiline
              minRows={8}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsEmailModalOpen(false)} disabled={isSendingEmail}>
            Anuluj
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleConfirmSendEmail}
            disabled={isSendingEmail || !emailTo.trim() || !emailSubject.trim() || !emailBody.trim()}
          >
            {isSendingEmail ? "Wysyłanie…" : "Wyślij"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}