import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { toast } from "react-toastify";

import ResumeCandidateCard from "./ResumeCandidateCard";
import ResumeDecisionPanel from "./ResumeDecisionPanel";
import ResumeInsightsCards from "./ResumeInsightsCards";
import ResumeRequirementsMatch from "./ResumeRequirementsMatch";
import { useResumeStatisticsUtils } from "../../../../utils/useResumeStatisticsUtils.ts";

const toText = (value: unknown) =>
  (typeof value === "string" ? value : String(value ?? "")).trim();

const pickText = (...values: unknown[]) => {
  for (const value of values) {
    const text = toText(value);
    if (text) return text;
  }
  return "";
};

type ResumeLike = {
  vacancy?: unknown;
  vacancyDto?: unknown;
  vacancyName?: unknown;
  vacancyTitle?: unknown;
};

type VacancyLike = {
  name?: unknown;
  title?: unknown;
  company?: unknown;
  companyName?: unknown;
  employer?: unknown;
  location?: unknown;
  address?: { city?: unknown; country?: unknown } | null;
  workType?: unknown;
  seniority?: unknown;
  level?: unknown;
};

const workTypeToLabel = (workType: unknown) => {
  if (!workType) return "";
  if (typeof workType === "string") return workType.trim();
  if (Array.isArray(workType)) return workType.map(toText).filter(Boolean).join(", ");
  return toText(workType);
};

export default function HrResumeStatisticsPage() {
  const viewModel = useResumeStatisticsUtils();

  if (viewModel.loading) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <CircularProgress size={18} />
          <Typography>Ładowanie CV…</Typography>
        </Stack>
      </Paper>
    );
  }

  if (!viewModel.hasValidParams) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Typography sx={{ color: "error.main", fontWeight: 900 }}>
          Nieprawidłowy link.
        </Typography>
      </Paper>
    );
  }

  if (viewModel.error) {
    return (
      <Paper elevation={0} className="section" sx={{ p: 3 }}>
        <Stack gap={1}>
          <Typography sx={{ color: "error.main", fontWeight: 900 }}>
            Nie udało się pobrać danych CV.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              viewModel.refetchAll();
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

  const resume = viewModel.resume as unknown as ResumeLike;
  const vacancy = (resume.vacancy ?? resume.vacancyDto) as VacancyLike | undefined;

  const vacancyTitle = pickText(
    vacancy?.name,
    vacancy?.title,
    resume?.vacancyName,
    resume?.vacancyTitle,
    viewModel.vacancyTitle
  );

  const vacancyCompany = pickText(
    vacancy?.companyName,
    vacancy?.company,
    vacancy?.employer
  );

  const city = pickText(vacancy?.address?.city);
  const country = pickText(vacancy?.address?.country);
  const fromAddress = pickText(city && country ? `${city}, ${country}` : city || country);

  const vacancyLocationLabel = pickText(fromAddress, vacancy?.location);
  const vacancyWorkTypeLabel = workTypeToLabel(vacancy?.workType);
  const vacancySeniorityLabel = pickText(vacancy?.seniority, vacancy?.level);

  return (
    <Stack gap={2}>
      <Paper elevation={0} className="glass" sx={{ p: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          flexWrap="wrap"
        >
          <Button
            component={Link}
            to={`/hr/statistics/vacancy/${viewModel.vacancyId}`}
            variant="text"
            color="inherit"
            startIcon={<ArrowBackRoundedIcon />}
          >
            Wróć do statystyk oferty
          </Button>

          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
            <Chip
              size="small"
              icon={<InsightsRoundedIcon fontSize="small" />}
              label="Statystyki CV"
              sx={{ fontWeight: 800 }}
            />
            {!viewModel.hasFit ? (
              <Chip
                size="small"
                icon={<WarningAmberRoundedIcon fontSize="small" />}
                label="Brak statystyk"
                color="warning"
                variant="outlined"
                sx={{ fontWeight: 900 }}
              />
            ) : null}
          </Stack>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
          gap: 2,
          alignItems: "start"
        }}
      >
        <Stack gap={2} sx={{ minWidth: 0 }}>
          <ResumeCandidateCard
            candidateName={viewModel.candidateName}
            candidateEmail={viewModel.candidateEmail}
            candidateLocation={viewModel.candidateLocation}
            experienceLabel={viewModel.experienceLabel}
            languagesText={viewModel.languagesText}
            availability={viewModel.availability}
            vacancyTitle={vacancyTitle}
            vacancyCompany={vacancyCompany}
            vacancyLocationLabel={vacancyLocationLabel}
            vacancyWorkTypeLabel={vacancyWorkTypeLabel}
            vacancySeniorityLabel={vacancySeniorityLabel}
            keySkills={viewModel.keySkills}
            summaryText={viewModel.summaryText}
            hasFit={viewModel.hasFit}
            fit={viewModel.fit}
            meta={viewModel.meta}
            initials={viewModel.initials}
          />

          <ResumeInsightsCards
            strengths={viewModel.strengths}
            risks={viewModel.risks}
            quickInsights={viewModel.quickInsights}
          />

          <ResumeRequirementsMatch
            requirementsSorted={viewModel.requirementsSorted}
            requirementCounters={viewModel.requirementCounters}
          />
        </Stack>

        <Stack gap={2} sx={{ display: { xs: "none", lg: "flex" } }}>
          <ResumeDecisionPanel
            hasFit={viewModel.hasFit}
            fit={viewModel.fit}
            meta={viewModel.meta}
            inviteSent={viewModel.inviteSent}
            canInvite={viewModel.canInvite}
            isSendingInvite={viewModel.isSendingInvite}
            openInviteModal={viewModel.openInviteModal}
            candidateEmail={viewModel.candidateEmail}
            copyToClipboard={viewModel.copyToClipboard}
            weakestRequirements={viewModel.weakestRequirements}
          />
        </Stack>
      </Box>

      <Dialog
        open={viewModel.inviteModalOpen}
        onClose={viewModel.closeInviteModal}
        fullWidth
        maxWidth="sm"
        disableScrollLock
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          Zaproś kandydata na rozmowę
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack gap={1.5} sx={{ mt: 1 }}>
            <TextField
              label="Do"
              value={viewModel.inviteTo}
              onChange={(e) => viewModel.setInviteTo(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Temat"
              value={viewModel.inviteSubject}
              onChange={(e) => viewModel.setInviteSubject(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Treść"
              value={viewModel.inviteBody}
              onChange={(e) => viewModel.setInviteBody(e.target.value)}
              multiline
              minRows={10}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={viewModel.closeInviteModal}
            disabled={viewModel.isSendingInvite}
          >
            Anuluj
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={viewModel.confirmInviteSend}
            disabled={
              viewModel.isSendingInvite ||
              !viewModel.inviteTo.trim() ||
              !viewModel.inviteSubject.trim() ||
              !viewModel.inviteBody.trim()
            }
          >
            {viewModel.isSendingInvite ? "Wysyłanie…" : "Wyślij"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}