import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { clampPercent, initials, type ResumeStatUi } from "./hrVacancyStatistics.utils";

type FitMeta = {
  label: string;
  ringColor: "success.main" | "warning.main" | "error.main";
  icon: React.ReactElement;
};

type Props = {
  selected: ResumeStatUi | null;
  selectedFit: number;
  selectedMeta: FitMeta;
  detailsUrl: string;
  canInvite: boolean;
  openInviteModal: () => void;
};

const pillSx = { borderRadius: 999 } as const;

const subtleChipSx = {
  ...pillSx,
  bgcolor: "grey.100",
  color: "grey.900"
} as const;

const fitChipSx = (ringColor: FitMeta["ringColor"]) =>
  ({
    ...subtleChipSx,
    fontWeight: 950,
    "& .MuiChip-icon": { color: ringColor }
  }) as const;

const highlightChipSx = {
  ...subtleChipSx,
  fontWeight: 850,
  "& .MuiChip-icon": { color: "success.main" }
} as const;

const riskChipSx = {
  ...subtleChipSx,
  fontWeight: 900,
  "& .MuiChip-icon": { color: "warning.main" }
} as const;

const blackPillButtonSx = {
  ...pillSx,
  bgcolor: "grey.900",
  color: "warning.main",
  "& .MuiButton-startIcon": { color: "warning.main" },
  "&:hover": { bgcolor: "grey.800" },
  "&.Mui-disabled": {
    bgcolor: "grey.200",
    color: "grey.600",
    "& .MuiButton-startIcon": { color: "grey.500" }
  }
} as const;

export default function CandidateDetailsPanel({
                                                selected,
                                                selectedFit,
                                                selectedMeta,
                                                detailsUrl,
                                                canInvite,
                                                openInviteModal
                                              }: Props) {
  const fitSafe = clampPercent(selectedFit);

  return (
    <Paper
      elevation={0}
      className="glass"
      sx={{
        p: 2,
        position: { lg: "sticky" },
        top: { lg: 92 },
        overflow: "hidden"
      }}
    >
      <Box sx={{ height: 3, bgcolor: "warning.main", opacity: 0.9, mx: -2, mt: -2, mb: 2 }} />

      {!selected ? (
        <Typography variant="body2" color="text.secondary">
          Wybierz kandydata z listy.
        </Typography>
      ) : (
        <Stack gap={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "grey.200",
                  color: "grey.900",
                  fontWeight: 950,
                  border: "1px solid",
                  borderColor: "rgba(0,0,0,0.18)"
                }}
              >
                {initials(selected.name)}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 950, lineHeight: 1.2 }} noWrap>
                  {selected.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {selected.email}
                </Typography>
              </Box>
            </Stack>

            <Chip size="small" icon={selectedMeta.icon} label={`${fitSafe}%`} sx={fitChipSx(selectedMeta.ringColor)} />
          </Stack>

          <Divider />

          <Stack direction="row" gap={1.25} alignItems="center">
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={fitSafe}
                size={72}
                thickness={5}
                sx={{ color: selectedMeta.ringColor }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Typography sx={{ fontWeight: 950, fontSize: 14 }}>{fitSafe}%</Typography>
              </Box>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 950, lineHeight: 1.05 }}>Decyzja</Typography>
              <Typography variant="caption" color="text.secondary">
                Dopasowanie + szybkie akcje
              </Typography>

              <Chip
                size="small"
                icon={selectedMeta.icon}
                label={`Dopasowanie: ${selectedMeta.label}`}
                sx={{ mt: 0.75, width: "fit-content", ...fitChipSx(selectedMeta.ringColor) }}
              />
            </Box>
          </Stack>

          <Divider />

          <Stack gap={0.75}>
            <Typography sx={{ fontWeight: 950 }}>Mocne strony</Typography>

            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {selected.highlights.length ? (
                selected.highlights.slice(0, 6).map((highlight) => (
                  <Chip
                    key={highlight}
                    size="small"
                    icon={<CheckCircleRoundedIcon fontSize="small" />}
                    label={highlight}
                    sx={highlightChipSx}
                  />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">
                  —
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack gap={0.75}>
            <Typography sx={{ fontWeight: 950 }}>Ryzyka</Typography>

            <Stack direction="row" gap={0.5} flexWrap="wrap">
              {selected.risks.length ? (
                selected.risks.slice(0, 6).map((risk) => (
                  <Chip
                    key={risk}
                    size="small"
                    icon={<WarningAmberRoundedIcon fontSize="small" />}
                    label={risk}
                    sx={riskChipSx}
                  />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary">
                  —
                </Typography>
              )}
            </Stack>
          </Stack>

          <Divider />

          <Stack gap={1}>
            <Button
              component={Link}
              to={detailsUrl}
              variant="contained"
              startIcon={<OpenInNewRoundedIcon />}
              sx={blackPillButtonSx}
            >
              Otwórz szczegóły
            </Button>

            <Button
              variant="contained"
              startIcon={<SendRoundedIcon />}
              onClick={openInviteModal}
              sx={blackPillButtonSx}
              disabled={!canInvite}
            >
              Zaproś na rozmowę
            </Button>

            <Typography variant="caption" color="text.secondary">
              Wybór kandydata nie przenosi do szczegółów — otworzysz je przyciskiem.
            </Typography>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}