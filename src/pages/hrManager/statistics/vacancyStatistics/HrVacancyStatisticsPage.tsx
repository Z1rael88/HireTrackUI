import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import { toast } from "react-toastify";
import { useSendGenericEmailMutation } from "../../../../api/emailsApi";

import { clampPercent, useHrVacancyStatisticsData, type ViewMode } from "./hrVacancyStatistics.utils";

import VacancyHeaderCard from "./VacancyHeaderCard";
import TopCandidatesSection from "./TopCandidatesSection";
import AllCandidatesSection, { type FitMeta } from "./AllCandidatesSection";
import CandidateDetailsPanel from "./CandidateDetailsPanel";
import InviteModal from "./InviteModal";

function getFitMeta(percent: number): FitMeta {
  const fitPercent = clampPercent(percent);

  if (fitPercent >= 70) {
    return {
      label: "Wysokie",
      ringColor: "success.main",
      icon: <CheckCircleRoundedIcon fontSize="small" />
    };
  }

  if (fitPercent >= 50) {
    return {
      label: "Średnie",
      ringColor: "warning.main",
      icon: <WarningAmberRoundedIcon fontSize="small" />
    };
  }

  return {
    label: "Niskie",
    ringColor: "error.main",
    icon: <CancelRoundedIcon fontSize="small" />
  };
}

const pillSx = { borderRadius: 999 } as const;

export default function HrVacancyStatisticsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const {
    vacancyIdNum,
    hasVacancyId,
    vacancy,
    stats,
    topCandidates,
    topCandidateLabel,
    frequentRisks,
    filtered,
    selected,
    loading,
    filter,
    setFilter,
    sortDesc,
    setSortDesc,
    query,
    setQuery,
    riskFilter,
    setRiskFilter,
    selectedResumeId,
    setSelectedResumeId
  } = useHrVacancyStatisticsData();

  const [sendGenericEmail, { isLoading: isSendingInvite }] = useSendGenericEmailMutation();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteTo, setInviteTo] = useState("");
  const [inviteSubject, setInviteSubject] = useState("");
  const [inviteBody, setInviteBody] = useState("");

  if (!hasVacancyId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 950, fontSize: 18 }}>
          Brak vacancyId w URL
        </Typography>

        <Button
          component={Link}
          to="/hr/statistics"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ mt: 2, ...pillSx }}
        >
          Wróć do listy ofert
        </Button>
      </Box>
    );
  }

  const selectedFit = clampPercent(selected?.fit ?? 0);
  const selectedMeta = getFitMeta(selectedFit);

  const detailsUrl = selected
    ? `/hr/statistics/vacancy/${vacancyIdNum}/resume/${selected.resumeId}`
    : "/hr/statistics";

  const vacancyTitle = vacancy?.name ?? "—";
  const selectedEmail = selected?.email?.trim() ?? "";
  const canInvite = Boolean(selectedEmail && selectedEmail !== "—" && !isSendingInvite);

  const openInviteModal = () => {
    if (!selectedEmail || selectedEmail === "—") {
      toast.error("Brak email kandydata — nie można wysłać zaproszenia.");
      return;
    }

    const subject = `Zaproszenie na rozmowę — ${vacancyTitle}`;

    const body =
      `Cześć ${selected?.name ?? ""}!\n\n` +
      `Dziękujemy za aplikację na ofertę: ${vacancyTitle}.\n` +
      `Chcielibyśmy zaprosić Cię na rozmowę rekrutacyjną.\n\n` +
      `Link do spotkania (Teams): \n\n` +
      `Prosimy o odpowiedź z dostępnymi terminami.\n\n` +
      `Pozdrawiamy`;

    setInviteTo(selectedEmail);
    setInviteSubject(subject);
    setInviteBody(body);
    setInviteModalOpen(true);
  };

  const confirmInviteSend = async () => {
    const to = inviteTo.trim();
    const subject = inviteSubject.trim();
    const body = inviteBody.trim();

    if (!to || !subject || !body) return;

    try {
      await sendGenericEmail({ to, subject, body }).unwrap();
      toast.success("Zaproszenie wysłane.");
      setInviteModalOpen(false);
    } catch {
      toast.error("Nie udało się wysłać zaproszenia.");
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, width: "100%" }}>
      <Stack gap={2} sx={{ width: "100%" }}>
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
              to="/hr/statistics"
              variant="text"
              color="inherit"
              startIcon={<ArrowBackRoundedIcon />}
              sx={pillSx}
            >
              Wróć do listy ofert
            </Button>

            <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<SortRoundedIcon />}
                onClick={() => setSortDesc((prev) => !prev)}
                sx={pillSx}
              >
                {sortDesc ? "Najlepsze → najgorsze" : "Najgorsze → najlepsze"}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <VacancyHeaderCard
          vacancy={vacancy}
          stats={stats}
          topCandidateLabel={topCandidateLabel}
          loading={loading}
        />

        <TopCandidatesSection
          topCandidates={topCandidates}
          selectedResumeId={selectedResumeId}
          onSelect={setSelectedResumeId}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" },
            gap: 1.5,
            alignItems: "start"
          }}
        >
          <AllCandidatesSection
            viewMode={viewMode}
            setViewMode={setViewMode}
            filter={filter}
            setFilter={setFilter}
            query={query}
            setQuery={setQuery}
            riskFilter={riskFilter}
            setRiskFilter={setRiskFilter}
            frequentRisks={frequentRisks}
            filtered={filtered}
            statsTotal={stats.total}
            selectedResumeId={selectedResumeId}
            setSelectedResumeId={setSelectedResumeId}
            getFitMeta={getFitMeta}
          />

          <CandidateDetailsPanel
            selected={selected}
            selectedFit={selectedFit}
            selectedMeta={selectedMeta}
            detailsUrl={detailsUrl}
            canInvite={canInvite}
            openInviteModal={openInviteModal}
          />
        </Box>

        <InviteModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          inviteTo={inviteTo}
          setInviteTo={setInviteTo}
          inviteSubject={inviteSubject}
          setInviteSubject={setInviteSubject}
          inviteBody={inviteBody}
          setInviteBody={setInviteBody}
          isSendingInvite={isSendingInvite}
          onConfirmSend={confirmInviteSend}
        />
      </Stack>
    </Box>
  );
}