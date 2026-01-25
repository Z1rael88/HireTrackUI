import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";

type RequirementItem = { label: string; scorePercent: number; note: string };

type Props = {
  requirementsSorted: RequirementItem[];
  requirementCounters: { high: number; mid: number; low: number };
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

const getBadge = (score: number, hasData: boolean) => {
  if (!hasData) {
    return { label: "—", Icon: HelpOutlineRoundedIcon, barColor: "rgba(0,0,0,0.18)" };
  }
  if (score >= 70) {
    return { label: `${score}%`, Icon: CheckCircleRoundedIcon, barColor: "success.main" };
  }
  if (score >= 50) {
    return { label: `${score}%`, Icon: WarningAmberRoundedIcon, barColor: "warning.main" };
  }
  return { label: `${score}%`, Icon: CancelRoundedIcon, barColor: "error.main" };
};

const pillSx = { borderRadius: 999, fontWeight: 900 } as const;

export default function ResumeRequirementsMatch({ requirementsSorted, requirementCounters }: Props) {
  const summaryChips = [
    { label: `≥70%: ${requirementCounters.high}`, bg: "success.light", border: "success.main" },
    { label: `50–69%: ${requirementCounters.mid}`, bg: "warning.light", border: "warning.main" },
    { label: `<50%: ${requirementCounters.low}`, bg: "error.light", border: "error.main" }
  ] as const;

  return (
    <Paper elevation={0} className="section" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        flexWrap="wrap"
        sx={{ mb: 1.25 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
          Dopasowanie do wymagań
        </Typography>

        <Stack direction="row" gap={0.75} flexWrap="wrap" alignItems="center">
          {summaryChips.map((chip) => (
            <Chip
              key={chip.label}
              size="small"
              variant="outlined"
              label={chip.label}
              sx={{ ...pillSx, bgcolor: chip.bg, borderColor: chip.border }}
            />
          ))}
        </Stack>
      </Stack>

      <Stack gap={1.05}>
        {requirementsSorted.map((item, index) => {
          const hasData = item.note !== "—";
          const score = clampPercent(item.scorePercent);
          const badge = getBadge(score, hasData);

          return (
            <Paper key={`${item.label}-${index}`} elevation={0} className="glass-soft" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack gap={0.75}>
                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography sx={{ fontWeight: 900 }}>{item.label}</Typography>

                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<badge.Icon fontSize="small" />}
                    label={badge.label}
                    sx={{
                      ...pillSx,
                      bgcolor: "grey.100",
                      color: "grey.900",
                      borderColor: "divider",
                      "& .MuiChip-icon": { color: badge.barColor }
                    }}
                  />
                </Stack>

                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {item.note}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={hasData ? score : 0}
                  sx={{
                    height: 10,
                    bgcolor: "rgba(0,0,0,0.06)",
                    "& .MuiLinearProgress-bar": { backgroundColor: badge.barColor }
                  }}
                />
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Paper>
  );
}