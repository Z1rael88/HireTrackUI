import { useMemo } from "react";
import { Box, Chip, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";

import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

import { WORK_TYPE } from "../../../../types/enumLabels";
import { clampPercent, getLocation, getVacancyTech, getWorkTypeLabel } from "./hrVacancyStatistics.utils";

import type { VacancyDto } from "../../../../types/statistics";

type Stats = {
  total: number;
  high: number;
  mid: number;
  low: number;
  avg: number;
  top: number;
};

type Props = {
  vacancy: VacancyDto | null;
  stats: Stats;
  topCandidateLabel: string;
  loading: boolean;
};

const pillSx = { borderRadius: 999 } as const;

export default function VacancyHeaderCard({
                                            vacancy,
                                            stats,
                                            topCandidateLabel,
                                            loading
                                          }: Props) {
  const vacancyTitle = vacancy?.name ?? "—";
  const vacancyLocation = getLocation(vacancy?.address);

  const vacancyWorkTypeLabel = getWorkTypeLabel(
    vacancy?.workType ?? null,
    WORK_TYPE as Record<number, string>
  );

  const requiredYears = vacancy?.requirements?.yearsOfExperience;

  const requiredYearsLabel =
    typeof requiredYears === "number" && Number.isFinite(requiredYears)
      ? `Min. ${requiredYears} lat doświadczenia`
      : "—";

  const vacancyTechnologies = useMemo(
    () => getVacancyTech(vacancy ?? undefined),
    [vacancy]
  );

  const vacancyDescription = vacancy?.description ?? "";

  const totalSafe = Math.max(1, stats.total);

  const distribution = useMemo(() => {
    const highWidth = (stats.high / totalSafe) * 100;
    const midWidth = (stats.mid / totalSafe) * 100;
    const lowWidth = (stats.low / totalSafe) * 100;

    return {
      highWidth,
      midWidth,
      lowWidth,
      highPercent: Math.round(highWidth),
      midPercent: Math.round(midWidth),
      lowPercent: Math.round(lowWidth)
    };
  }, [stats.high, stats.mid, stats.low, totalSafe]);

  return (
    <Paper elevation={0} className="glass" sx={{ p: { xs: 2, md: 2.25 } }}>
      <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" gap={2}>
        <Stack gap={0.75} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 950,
              fontSize: { xs: 18, md: 20 },
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
            title={vacancyTitle}
          >
            {vacancyTitle}
          </Typography>

          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" color="text.secondary">
            <Stack direction="row" gap={0.5} alignItems="center">
              <WorkOutlineRoundedIcon fontSize="small" />
              <Typography variant="body2">
                {vacancyWorkTypeLabel} • {requiredYearsLabel}
              </Typography>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack direction="row" gap={0.5} alignItems="center">
              <PlaceRoundedIcon fontSize="small" />
              <Typography variant="body2">{vacancyLocation}</Typography>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack direction="row" gap={0.5} alignItems="center">
              <GroupRoundedIcon fontSize="small" />
              <Typography variant="body2">{stats.total} aplikacji</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 0.5 }}>
            {vacancyTechnologies.map((technology) => (
              <Chip
                key={technology}
                size="small"
                label={technology}
                sx={{
                  ...pillSx,
                  bgcolor: "grey.100",
                  color: "grey.900",
                  fontWeight: 850
                }}
              />
            ))}
          </Stack>

          {vacancyDescription ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 1100 }}>
              {vacancyDescription}
            </Typography>
          ) : null}
        </Stack>

        <Stack gap={1} sx={{ minWidth: { xs: "100%", lg: 560 } }}>
          <Stack
            direction="row"
            gap={1.25}
            flexWrap="wrap"
            justifyContent={{ xs: "flex-start", lg: "flex-end" }}
          >
            <Paper elevation={0} className="section" sx={{ p: 1.25, minWidth: 220 }}>
              <Stack direction="row" gap={1.25} alignItems="center">
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={clampPercent(stats.avg)}
                    size={52}
                    thickness={5}
                    sx={{ color: "grey.700" }}
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
                    <Typography sx={{ fontWeight: 950, fontSize: 12 }}>
                      {clampPercent(stats.avg)}%
                    </Typography>
                  </Box>
                </Box>

                <Stack>
                  <Typography sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                    Średnie dopasowanie
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Wszystkie CV
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            <Paper elevation={0} className="section" sx={{ p: 1.25, minWidth: 190 }}>
              <Stack direction="row" gap={1} alignItems="center">
                <GroupRoundedIcon fontSize="small" />
                <Stack>
                  <Typography sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                    {stats.total} aplikacji
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Liczba zgłoszeń
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            <Paper elevation={0} className="section" sx={{ p: 1.25, minWidth: 220 }}>
              <Stack gap={0.35}>
                <Typography sx={{ fontWeight: 950, lineHeight: 1.1 }}>
                  Najlepszy wynik
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Top CV: {topCandidateLabel}
                </Typography>
              </Stack>
            </Paper>
          </Stack>

          <Paper elevation={0} className="section" sx={{ p: 1.25 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={1.25}
            >
              <Stack>
                <Typography sx={{ fontWeight: 950 }}>
                  Rozkład dopasowania
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Podział puli kandydatów (liczba + udział)
                </Typography>
              </Stack>

              <Stack
                direction="row"
                gap={0.75}
                flexWrap="wrap"
                alignItems="center"
                justifyContent="flex-end"
              >
                {[
                  {
                    label: "≥70%",
                    count: stats.high,
                    pct: distribution.highPercent,
                    dot: "success.main" as const
                  },
                  {
                    label: "50–69%",
                    count: stats.mid,
                    pct: distribution.midPercent,
                    dot: "warning.main" as const
                  },
                  {
                    label: "<50%",
                    count: stats.low,
                    pct: distribution.lowPercent,
                    dot: "error.main" as const
                  }
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      ...pillSx,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.7,
                      px: 1,
                      py: 0.55,
                      bgcolor: "grey.100",
                      border: "1px solid",
                      borderColor: "divider"
                    }}
                  >
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.dot }} />
                    <Typography variant="caption" sx={{ fontWeight: 950 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 950 }}>
                      {item.count}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({item.pct}%)
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>

            <Box
              sx={{
                mt: 1.1,
                height: 10,
                borderRadius: 999,
                overflow: "hidden",
                bgcolor: "rgba(0,0,0,0.06)",
                display: "flex"
              }}
            >
              <Box sx={{ width: `${distribution.highWidth}%`, bgcolor: "success.main" }} />
              <Box sx={{ width: `${distribution.midWidth}%`, bgcolor: "warning.main" }} />
              <Box sx={{ width: `${distribution.lowWidth}%`, bgcolor: "error.main" }} />
            </Box>
          </Paper>

          {loading ? (
            <Typography variant="caption" color="text.secondary">
              Ładowanie danych…
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}