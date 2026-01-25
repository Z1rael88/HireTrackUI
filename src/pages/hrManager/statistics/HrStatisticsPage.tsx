import { Link } from "react-router-dom";
import { Box, Button, Chip, Divider, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";

import { useGetVacanciesQuery } from "../../../api/vacanciesApi";
import { useGetResumeByVacancyIdQuery } from "../../../api/resumesApi";
import { useGetOverallStatisticsByVacancyIdQuery } from "../../../api/statisticsApi";
import { WORK_TYPE } from "../../../types/enumLabels";

type VacancyListItem = {
  id: number;
  title?: string;
  name?: string;
  workType?: unknown;
  location?: string;
  addressText?: string;
  place?: string;
  city?: string;
  country?: string;
  address?: { city?: string; country?: string };
};

type ResumeShort = { id: number };

type OverallStatItem = {
  totalStatistics?: {
    totalMatchPercent?: number;
  };
};

const clampPercent = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
};

const getFitChipSx = (percent: number) => {
  const p = clampPercent(percent);
  if (p >= 70) return { color: "success.main" };
  if (p >= 50) return { color: "warning.main" };
  return { color: "error.main" };
};

const pickText = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "—";
};

const buildLocation = (vacancy: VacancyListItem) => {
  const direct = pickText(vacancy.location, vacancy.addressText, vacancy.place);
  if (direct !== "—") return direct;

  const city = pickText(vacancy.city, vacancy.address?.city);
  const country = pickText(vacancy.country, vacancy.address?.country);

  if (city !== "—" && country !== "—") return `${city}, ${country}`;
  if (city !== "—") return city;
  if (country !== "—") return country;

  return "—";
};

const getWorkTypeLabel = (workType: unknown) => {
  const labels = WORK_TYPE as Record<number, string>;
  const raw = Array.isArray(workType) ? workType : workType == null ? [] : [workType];
  const ids = raw.map(Number).filter(Number.isFinite);
  return ids.length ? ids.map((id) => labels[id] ?? String(id)).join(", ") : "—";
};

const getPercents01 = (items: OverallStatItem[] | undefined) =>
  (items ?? [])
    .map((item) => item.totalStatistics?.totalMatchPercent)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

const averagePercent = (percents01: number[]) =>
  percents01.length ? clampPercent((percents01.reduce((sum, n) => sum + n, 0) / percents01.length) * 100) : 0;

const topPercent = (percents01: number[]) => (percents01.length ? clampPercent(Math.max(...percents01) * 100) : 0);

function VacancyStatsRow({ vacancy }: { vacancy: VacancyListItem }) {
  const vacancyId = vacancy.id;

  const {
    data: resumesData,
    isLoading: resumesLoading
  } = useGetResumeByVacancyIdQuery(vacancyId, { skip: !vacancyId }) as {
    data?: ResumeShort[];
    isLoading: boolean;
  };

  const { data: overallStatsData, isLoading: statsLoading } = useGetOverallStatisticsByVacancyIdQuery(vacancyId, {
    skip: !vacancyId
  }) as {
    data?: OverallStatItem[];
    isLoading: boolean;
  };

  const title = pickText(vacancy.title, vacancy.name);
  const location = buildLocation(vacancy);
  const workTypeLabel = getWorkTypeLabel(vacancy.workType);
  const applicationsCount = (resumesData ?? []).length;

  const percents01 = getPercents01(overallStatsData);
  const averageFit = averagePercent(percents01);
  const topFit = topPercent(percents01);

  return (
    <Paper elevation={0} className="glass" sx={{ p: 2 }}>
      {resumesLoading || statsLoading ? (
        <LinearProgress sx={{ mb: 1.5, borderRadius: 999 }} />
      ) : null}

      <Stack direction={{ xs: "column", md: "row" }} gap={2} justifyContent="space-between">
        <Stack sx={{ minWidth: 0 }} gap={0.75}>
          <Typography sx={{ fontWeight: 900, fontSize: 16 }} noWrap title={title}>
            {title}
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ color: "text.secondary" }}>
            <Stack direction="row" gap={0.5} alignItems="center">
              <WorkOutlineRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {workTypeLabel}
              </Typography>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack direction="row" gap={0.5} alignItems="center">
              <PlaceRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack direction="row" gap={0.5} alignItems="center">
              <GroupRoundedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {applicationsCount} aplikacji
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              label={`Średnie dopasowanie: ${averageFit}%`}
              sx={{ borderRadius: 999, fontWeight: 800, ...getFitChipSx(averageFit) }}
            />
            <Chip
              size="small"
              label={`Top kandydat: ${topFit}%`}
              sx={{ borderRadius: 999, bgcolor: "grey.100", color: "grey.800", fontWeight: 700 }}
            />
          </Stack>

          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Średnie dopasowanie
            </Typography>
            <LinearProgress variant="determinate" value={averageFit} sx={{ mt: 0.5, height: 8, borderRadius: 999 }} />
          </Box>
        </Stack>

        <Stack alignItems={{ xs: "stretch", md: "flex-end" }} justifyContent="space-between" gap={1}>
          <Button
            component={Link}
            to={`/hr/statistics/vacancy/${vacancyId}`}
            variant="contained"
            color="warning"
            sx={{ fontWeight: 900, borderRadius: 999 }}
            disabled={!vacancyId}
          >
            Zobacz statystyki →
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function HrStatisticsPage() {
  const { data: vacanciesData, isLoading, isError } = useGetVacanciesQuery() as {
    data?: VacancyListItem[];
    isLoading: boolean;
    isError: boolean;
  };

  const vacancies = vacanciesData ?? [];

  return (
    <Stack gap={2}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="flex-start" gap={1}>
        <Stack>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Statystyki
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Podgląd dopasowania CV do ofert
          </Typography>
        </Stack>
      </Stack>

      <Divider />

      {isLoading ? <LinearProgress /> : null}

      {isError ? (
        <Typography variant="body2" color="text.secondary">
          Nie udało się pobrać listy ofert.
        </Typography>
      ) : null}

      {!isLoading && !isError && vacancies.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Brak ofert do wyświetlenia.
        </Typography>
      ) : null}

      <Stack gap={1.25}>
        {vacancies.map((vacancy) => (
          <VacancyStatsRow key={vacancy.id} vacancy={vacancy} />
        ))}
      </Stack>
    </Stack>
  );
}