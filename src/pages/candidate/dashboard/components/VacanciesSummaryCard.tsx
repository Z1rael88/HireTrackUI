import {
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { Link } from "react-router-dom";

import Section from "./Section";
import { useGetVacanciesQuery } from "../../../../api/vacanciesApi";
import type { VacancyResponse } from "../../../../types/vacancy";
import { WORK_TYPE } from "../../../../types/enumLabels";
import { COLORS } from "../../../../style/ColorTheme";

function getAvatarLetters(source?: string): string {
  const value = source?.trim();
  if (!value) return "–";
  const [first = "", second = ""] = value.split(/\s+/);
  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase() || "–";
}

function getSalaryLabel(vacancy: VacancyResponse): string {
  const salary = vacancy.salary;
  return salary && salary > 0 ? `${salary} PLN` : "";
}

function normalizeWorkTypeId(raw: unknown): number | null {
  const num = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(num)) return null;
  if (num >= 1 && num <= 3) return num;
  if (num >= 0 && num <= 2) return num + 1;
  return num;
}

function getWorkTypeLabel(workType: unknown): string {
  const items = Array.isArray(workType)
    ? workType
    : workType != null
      ? [workType]
      : [];

  const ids = items
    .map(normalizeWorkTypeId)
    .filter((v): v is number => v != null);

  if (!ids.length) return "Tryb pracy";

  return ids
    .map((id) => (WORK_TYPE as Record<number, string>)[id] ?? `Typ ${id}`)
    .join(", ");
}

function getLocationLabel(vacancy: VacancyResponse): string {
  const city = vacancy.address?.city?.trim() ?? "";
  const country = vacancy.address?.country?.trim() ?? "";
  if (city && country) return `${city}, ${country}`;
  return city || country;
}

function parseYmd(value: unknown): Date | null {
  const str = String(value ?? "").trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isVacancyActive(vacancy: VacancyResponse): boolean {
  const end = parseYmd(vacancy.endDate);
  if (!end) return true;

  const endOfDay = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
    23,
    59,
    59,
    999
  );

  return endOfDay.getTime() >= Date.now();
}

function formatAddDate(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) return "Dzisiaj";

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function VacancyRow({ vacancy }: { vacancy: VacancyResponse }) {
  const title = vacancy.name || "—";
  const avatarLetters = getAvatarLetters(title);

  const workTypeLabel = getWorkTypeLabel(vacancy.workType);
  const locationLabel = getLocationLabel(vacancy);
  const addDateLabel = formatAddDate(vacancy.addDate);
  const salaryLabel = getSalaryLabel(vacancy);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        backgroundColor: alpha(COLORS.black, 0.03)
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ minWidth: 0 }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            borderRadius: 3,
            backgroundColor: alpha(COLORS.accent, 0.18),
            border: `1px solid ${alpha(COLORS.accent, 0.35)}`,
            color: COLORS.textPrimary,
            fontWeight: 800,
            flexShrink: 0
          }}
        >
          {avatarLetters}
        </Avatar>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={{ xs: 1, sm: 2 }}
          sx={{ flex: 1, minWidth: 0, width: "100%" }}
        >
          <Stack sx={{ minWidth: 0, flex: 1 }} gap={0.75}>
            <Typography
              sx={{
                fontWeight: 800,
                color: COLORS.textPrimary,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: { xs: 2, sm: 1 },
                overflowWrap: "anywhere"
              }}
            >
              {title}
            </Typography>

            <Stack
              direction="row"
              gap={1.25}
              flexWrap="wrap"
              alignItems="center"
              sx={{ color: COLORS.textSecondary, minWidth: 0 }}
            >
              <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                <WorkOutlineRoundedIcon sx={{ fontSize: 18, opacity: 0.85 }} />
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ color: "inherit", maxWidth: { xs: 240, sm: "none" } }}
                >
                  {workTypeLabel}
                </Typography>
              </Stack>

              {locationLabel ? (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: COLORS.divider,
                      display: { xs: "none", sm: "block" }
                    }}
                  />
                  <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <LocationOnRoundedIcon sx={{ fontSize: 18, opacity: 0.85 }} />
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "inherit", maxWidth: { xs: 240, sm: "none" } }}
                    >
                      {locationLabel}
                    </Typography>
                  </Stack>
                </>
              ) : null}

              {addDateLabel ? (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      borderColor: COLORS.divider,
                      display: { xs: "none", sm: "block" }
                    }}
                  />
                  <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.85 }} />
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "inherit", maxWidth: { xs: 180, sm: "none" } }}
                    >
                      {addDateLabel}
                    </Typography>
                  </Stack>
                </>
              ) : null}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            sx={{
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              flexWrap: { xs: "wrap", sm: "nowrap" },
              rowGap: 1,
              flexShrink: 0
            }}
          >
            {salaryLabel ? (
              <Chip
                size="small"
                label={salaryLabel}
                variant="outlined"
                sx={{
                  maxWidth: { xs: "100%", sm: 180 },
                  fontWeight: 800,
                  color: COLORS.textPrimary,
                  backgroundColor: alpha(COLORS.accent, 0.12),
                  borderColor: alpha(COLORS.black, 0.18),
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }
                }}
              />
            ) : null}

            <Button
              component={Link}
              to={`/candidate/offers/${vacancy.id}`}
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Szczegóły
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function VacanciesSummaryCard() {
  const { data, isLoading, isError, refetch } = useGetVacanciesQuery();

  const vacancies: VacancyResponse[] = Array.isArray(data) ? data : [];

  const activeVacancies = vacancies
    .filter(isVacancyActive)
    .sort((a, b) => {
      const aTime = a.addDate ? new Date(a.addDate).getTime() : NaN;
      const bTime = b.addDate ? new Date(b.addDate).getTime() : NaN;
      if (Number.isFinite(aTime) && Number.isFinite(bTime)) return bTime - aTime;
      return Number(b.id) - Number(a.id);
    });

  return (
    <Section
      title="Dostępne ogłoszenia"
      action={
        <Button component={Link} to="/candidate/offers" size="small" variant="text">
          Przeglądaj
        </Button>
      }
    >
      {isLoading ? (
        <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
          Ładowanie…
        </Typography>
      ) : isError ? (
        <Typography
          variant="body2"
          sx={{ color: COLORS.error, cursor: "pointer" }}
          onClick={() => refetch()}
        >
          Nie udało się pobrać ofert — kliknij, aby spróbować ponownie
        </Typography>
      ) : activeVacancies.length === 0 ? (
        <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
          Brak aktywnych ofert
        </Typography>
      ) : (
        <Stack gap={1.5}>
          <Typography variant="body2" sx={{ color: COLORS.textSecondary, fontWeight: 700 }}>
            Łącznie: {activeVacancies.length}
          </Typography>

          {activeVacancies.slice(0, 5).map((vacancy) => (
            <VacancyRow key={String(vacancy.id)} vacancy={vacancy} />
          ))}
        </Stack>
      )}
    </Section>
  );
}
