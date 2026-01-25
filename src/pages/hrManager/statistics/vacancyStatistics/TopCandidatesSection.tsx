import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { ReactElement } from "react";

import { clampPercent, initials, type ResumeStatUi } from "../../../../utils/HrVacancyStatisticsUtils";

type Props = {
  topCandidates: ResumeStatUi[];
  selectedResumeId: number;
  onSelect: (resumeId: number) => void;
};

type FitMeta = {
  ringColor: "success.main" | "warning.main" | "error.main";
  icon: ReactElement;
};

const fitMeta = (percent: number): FitMeta => {
  const fitPercent = clampPercent(percent);

  if (fitPercent >= 70) {
    return {
      ringColor: "success.main",
      icon: <CheckCircleRoundedIcon fontSize="small" />
    };
  }

  if (fitPercent >= 50) {
    return {
      ringColor: "warning.main",
      icon: <WarningAmberRoundedIcon fontSize="small" />
    };
  }

  return {
    ringColor: "error.main",
    icon: <CancelRoundedIcon fontSize="small" />
  };
};

const pillSx = { borderRadius: 999 } as const;

export default function TopCandidatesSection({
                                               topCandidates,
                                               selectedResumeId,
                                               onSelect
                                             }: Props) {
  return (
    <Paper elevation={0} className="glass" sx={{ p: { xs: 2, md: 2.25 } }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
      >
        <Stack>
          <Typography sx={{ fontWeight: 950 }}>
            Top kandydaci
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Najlepiej dopasowane CV — szybki start
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Kliknij kartę, aby zaznaczyć kandydata
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 1.25,
          mt: 1.25
        }}
      >
        {topCandidates.map((candidate) => {
          const meta = fitMeta(candidate.fit);
          const isSelected = candidate.resumeId === selectedResumeId;

          return (
            <Paper
              key={candidate.resumeId}
              elevation={0}
              onClick={() => onSelect(candidate.resumeId)}
              sx={{
                p: 1.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: isSelected ? "grey.900" : "divider",
                bgcolor: "background.paper",
                cursor: "pointer",
                transition: "box-shadow .14s ease, border-color .14s ease",
                boxShadow: isSelected ? "0 12px 28px rgba(0,0,0,0.10)" : "none",
                "&:hover": { boxShadow: "0 14px 30px rgba(0,0,0,0.10)" }
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                gap={1}
                alignItems="flex-start"
              >
                <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: "grey.200",
                      color: "grey.900",
                      fontWeight: 950,
                      border: "1px solid",
                      borderColor: "rgba(0,0,0,0.18)"
                    }}
                  >
                    {initials(candidate.name)}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 950, lineHeight: 1.2 }} noWrap>
                      {candidate.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" noWrap>
                      {candidate.email}
                    </Typography>

                    <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 0.85 }}>
                      {candidate.highlights.slice(0, 3).map((highlight) => (
                        <Chip
                          key={highlight}
                          size="small"
                          label={highlight}
                          sx={{ ...pillSx, bgcolor: "grey.100", color: "grey.900", fontWeight: 850 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>

                <Chip
                  size="small"
                  icon={meta.icon}
                  label={`${clampPercent(candidate.fit)}%`}
                  sx={{
                    ...pillSx,
                    bgcolor: "grey.100",
                    color: "grey.900",
                    fontWeight: 950,
                    height: 26,
                    border: "1px solid",
                    borderColor: "divider",
                    "& .MuiChip-icon": { color: meta.ringColor }
                  }}
                />
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}