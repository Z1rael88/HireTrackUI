import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";

import type { CandidateDto } from "../../../types/common";
import { RESUME_STATUS } from "../../../types/enumLabels";
import type { ResumeResponse } from "../../../types/resume";
import { COLORS } from "../../../style/ColorTheme";

type HrDashboardCandidateMiniCardProps = {
  resume: ResumeResponse;
  vacancyId: number;
};

type ResumeExtraFields = {
  vacancyId?: number;
  status?: number;
};

function getInitials(firstname?: string, lastname?: string) {
  const first = firstname?.trim()?.[0] ?? "";
  const last = lastname?.trim()?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "🙂";
}

const chipSx = {
  fontWeight: 700,
  maxWidth: "100%",
  borderColor: COLORS.borderSoft,
  color: COLORS.textSecondary,
  backgroundColor: alpha(COLORS.black, 0.02),
  "& .MuiChip-label": {
    px: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%"
  }
} as const;

export default function HrDashboardCandidateMiniCard({
                                                       resume,
                                                       vacancyId: vacancyIdFromProps
                                                     }: HrDashboardCandidateMiniCardProps) {
  const candidate = resume.candidate as CandidateDto | undefined;

  const firstname = candidate?.firstname?.trim() ?? "";
  const lastname = candidate?.lastname?.trim() ?? "";
  const fullName = `${firstname} ${lastname}`.trim() || `ID #${resume.id}`;
  const initials = getInitials(firstname, lastname);

  const hasJobExperiences = (resume.jobExperiences?.length ?? 0) > 0;

  const extra = resume as ResumeResponse & ResumeExtraFields;
  const vacancyId = extra.vacancyId ?? vacancyIdFromProps;

  const detailsUrl = `/hr/vacancies/${vacancyId}/candidates/${resume.id}`;

  const statusKey = extra.status as keyof typeof RESUME_STATUS | undefined;
  const statusLabel = statusKey != null ? RESUME_STATUS[statusKey] : undefined;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.5, md: 1.75 },
        border: `1px solid ${COLORS.borderSoft}`,
        backgroundColor: alpha(COLORS.surface, 0.92),
        height: "100%",
        transition: "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: COLORS.border,
          boxShadow: "0 12px 30px rgba(17,19,24,0.10)"
        }
      }}
    >
      <Stack direction="row" alignItems="center" gap={{ xs: 1, sm: 1.25 }} sx={{ minWidth: 0 }}>
        <Avatar
          sx={{
            width: { xs: 40, sm: 44 },
            height: { xs: 40, sm: 44 },
            bgcolor: alpha(COLORS.accent, 0.16),
            color: COLORS.textPrimary,
            border: `1px solid ${alpha(COLORS.accent, 0.28)}`,
            fontWeight: 900,
            flexShrink: 0
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: COLORS.textPrimary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: 1.15,
              fontSize: { xs: 14, sm: 15 }
            }}
            title={fullName}
          >
            {fullName}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: COLORS.textSecondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: { xs: 12.5, sm: 13.5 }
            }}
            title={candidate?.email ?? ""}
          >
            {candidate?.email ?? "—"}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: { xs: 1, sm: 1.25 } }}>
        {!hasJobExperiences ? <Chip label="Brak danych" size="small" variant="outlined" sx={chipSx} /> : null}
        {statusLabel ? <Chip label={statusLabel} size="small" variant="outlined" sx={chipSx} /> : null}
      </Stack>

      <Box sx={{ mt: { xs: 1.25, sm: 1.5 }, display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="small"
          component={Link}
          to={detailsUrl}
          variant="contained"
          sx={{
            fontWeight: 900,
            px: { xs: 1.75, sm: 2.25 },
            width: { xs: "100%", sm: "auto" },
            minWidth: { xs: 0, sm: 88 }
          }}
        >
          Profil
        </Button>
      </Box>
    </Paper>
  );
}