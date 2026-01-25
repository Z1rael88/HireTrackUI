import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import TranslateRoundedIcon from "@mui/icons-material/TranslateRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

type Props = {
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  experienceLabel: string;
  languagesText: string;
  availability: string;

  vacancyTitle: string;
  vacancyCompany: string;
  vacancyLocationLabel: string;
  vacancyWorkTypeLabel: string;
  vacancySeniorityLabel: string;

  keySkills: string[];
  summaryText: string;

  hasFit: boolean;
  fit: number;
  meta: { label: string };

  initials: (name: string) => string;
};

const pillSx = { borderRadius: 999 } as const;

const fitUi = (hasFit: boolean, fit: number) => {
  if (!hasFit) return { Icon: HelpOutlineRoundedIcon, color: "text.secondary" as const };
  if (fit >= 70) return { Icon: CheckCircleRoundedIcon, color: "success.main" as const };
  if (fit >= 50) return { Icon: WarningAmberRoundedIcon, color: "warning.main" as const };
  return { Icon: CancelRoundedIcon, color: "error.main" as const };
};

export default function ResumeCandidateCard({
                                              candidateName,
                                              candidateEmail,
                                              candidateLocation,
                                              experienceLabel,
                                              languagesText,
                                              availability,
                                              vacancyTitle,
                                              vacancyCompany,
                                              vacancyLocationLabel,
                                              vacancyWorkTypeLabel,
                                              vacancySeniorityLabel,
                                              keySkills,
                                              summaryText,
                                              hasFit,
                                              fit,
                                              meta,
                                              initials
                                            }: Props) {
  const theme = useTheme();
  const ui = fitUi(hasFit, fit);
  const FitIcon = ui.Icon;

  const accentColor =
    ui.color === "success.main"
      ? theme.palette.success.main
      : ui.color === "warning.main"
        ? theme.palette.warning.main
        : ui.color === "error.main"
          ? theme.palette.error.main
          : theme.palette.text.secondary;

  return (
    <Paper elevation={0} className="glass" sx={{ p: { xs: 2, md: 2.25 } }}>
      <Stack gap={1.5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          gap={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Stack direction="row" gap={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 58,
                  height: 58,
                  fontWeight: 900,
                  bgcolor: "grey.100",
                  color: "grey.900"
                }}
              >
                {initials(candidateName)}
              </Avatar>

              <Box
                sx={{
                  position: "absolute",
                  inset: -5,
                  borderRadius: 999,
                  border: "2px solid",
                  borderColor: alpha(accentColor, 0.08)
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                <Typography
                  sx={{ fontWeight: 900, fontSize: { xs: 18, md: 22 } }}
                  noWrap
                  title={candidateName}
                >
                  {candidateName}
                </Typography>

                <Chip
                  size="small"
                  icon={<FitIcon fontSize="small" />}
                  label={`Dopasowanie: ${meta.label}`}
                  sx={{
                    ...pillSx,
                    bgcolor: "grey.100",
                    fontWeight: 800,
                    "& .MuiChip-icon": { color: ui.color }
                  }}
                />

                <Chip
                  size="small"
                  label={availability ? `Dostępność: ${availability}` : "Dostępność: —"}
                  variant="outlined"
                  sx={pillSx}
                />
              </Stack>

              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                flexWrap="wrap"
                sx={{ mt: 0.75 }}
                color="text.secondary"
              >
                <Stack direction="row" gap={0.5} alignItems="center">
                  <MailOutlineRoundedIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {candidateEmail || "—"}
                  </Typography>
                </Stack>

                {candidateLocation ? (
                  <Stack direction="row" gap={0.5} alignItems="center">
                    <LocationOnRoundedIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {candidateLocation}
                    </Typography>
                  </Stack>
                ) : null}

                <Stack direction="row" gap={0.5} alignItems="center">
                  <WorkOutlineRoundedIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {experienceLabel}
                  </Typography>
                </Stack>

                <Stack direction="row" gap={0.5} alignItems="center">
                  <TranslateRoundedIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {languagesText}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Paper
            elevation={0}
            className="glass-soft"
            sx={{ display: { xs: "none", md: "block" }, p: 1.25, minWidth: 100 }}
          >
            <Typography variant="caption" color="text.secondary">
              Oferta
            </Typography>

            <Typography sx={{ fontWeight: 900, mt: 0.5, lineHeight: 1.25 }}>
              {vacancyTitle}
            </Typography>

            {vacancyCompany || vacancyLocationLabel ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {[vacancyCompany, vacancyLocationLabel].filter(Boolean).join(" • ")}
              </Typography>
            ) : null}

            {vacancyWorkTypeLabel || vacancySeniorityLabel ? (
              <Typography variant="body2" color="text.secondary">
                {[vacancyWorkTypeLabel, vacancySeniorityLabel].filter(Boolean).join(" • ")}
              </Typography>
            ) : null}
          </Paper>
        </Stack>

        <Paper elevation={0} className="section" sx={{ p: 1.75 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={1}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Typography sx={{ fontWeight: 900 }}>Kluczowe umiejętności</Typography>
            <Box sx={{ flex: 1 }} />

            <Chip
              size="small"
              icon={<AutoAwesomeRoundedIcon fontSize="small" />}
              label={hasFit ? `Dopasowanie: ${Math.round(fit)}%` : "Dopasowanie: —"}
              sx={{
                display: { xs: "inline-flex", lg: "none" },
                ...pillSx,
                bgcolor: "grey.100",
                fontWeight: 800,
                "& .MuiChip-icon": { color: ui.color }
              }}
            />
          </Stack>

          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
            {keySkills.length ? (
              keySkills.map((skill) => (
                <Chip
                  key={skill}
                  size="small"
                  label={skill}
                  sx={{ ...pillSx, bgcolor: "grey.100", fontWeight: 700 }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                —
              </Typography>
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
            {summaryText}
          </Typography>
        </Paper>
      </Stack>
    </Paper>
  );
}