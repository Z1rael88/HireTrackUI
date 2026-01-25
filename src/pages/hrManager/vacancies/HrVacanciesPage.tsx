import * as React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { useGetVacanciesQuery } from "../../../api/vacanciesApi";
import type { VacancyResponse } from "../../../types/vacancy";
import type { RootState } from "../../../store/store";
import { WORK_TYPE } from "../../../types/enumLabels";
import { COLORS } from "../../../style/ColorTheme";
import { daysAgo } from "../../../utils/offers";

type SortMode = "Newest" | "Title A–Z";

type VacancyWithHr = VacancyResponse & {
  hrId?: number | string | null;
  hr?: { id?: number | string | null } | null;
};

function toNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function getUserId(raw: RootState["user"]["id"]): number | null {
  return toNumber(raw);
}

function getHrId(v: VacancyWithHr): number | null {
  return toNumber(v.hrId ?? v.hr?.id);
}

function getEndDateIso(v: VacancyResponse): string {
  return v.endDate?.slice(0, 10) ?? "";
}

function getTitle(v: VacancyResponse): string {
  return v.name ?? "Oferta";
}

function getCity(v: VacancyResponse): string {
  return v.address?.city ?? "";
}

function getPostedLabel(v: VacancyResponse): string {
  return v.addDate ? daysAgo(v.addDate) : "";
}

function getSalaryLabel(v: VacancyResponse): string | null {
  return Number.isFinite(v.salary) ? `Wynagrodzenie: ${v.salary} PLN` : null;
}

function getTags(v: VacancyResponse): string[] {
  const tech = v.requirements?.jobExperience?.technologyRequirements;
  if (!Array.isArray(tech)) return [];
  return tech.map((t) => String(t?.name ?? "").trim()).filter(Boolean);
}

const chipBaseSx = {
  border: "1px solid",
  borderColor: COLORS.inputBorder,
  bgcolor: COLORS.inputBg,
  fontWeight: 700
} as const;

function StateCard({ children }: { children: React.ReactNode }) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: COLORS.inputBorder, borderRadius: 4 }}>
      {children}
    </Paper>
  );
}

function MetaRow({
                   icon,
                   text
                 }: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Stack direction="row" gap={0.75} alignItems="center" sx={{ color: COLORS.textMuted }}>
      {icon}
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}

function DividerV() {
  return <Divider orientation="vertical" flexItem sx={{ borderColor: alpha(COLORS.black, 0.12) }} />;
}

type HrVacancyCardProps = { vacancy: VacancyResponse };

function HrVacancyCard({ vacancy }: HrVacancyCardProps) {
  const id = vacancy.id;
  const title = getTitle(vacancy);
  const workTypeLabel = (() => {
    const labels = WORK_TYPE as Record<number, string>;
    const list = Array.isArray(vacancy.workType) ? vacancy.workType : vacancy.workType != null ? [vacancy.workType] : [];
    const mapped = list
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n))
      .map((n) => labels[n])
      .filter(Boolean);

    return mapped.join(", ");
  })();
  const city = getCity(vacancy);
  const postedLabel = getPostedLabel(vacancy);
  const salaryLabel = getSalaryLabel(vacancy);
  const tags = getTags(vacancy);

  const avatarSource = (title || city || "OF").trim();
  const avatarLetters = avatarSource.slice(0, 2).toUpperCase();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: COLORS.inputBorder,
        bgcolor: COLORS.bg,
        borderRadius: 4,
        transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        "&:hover": {
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
          borderColor: alpha(COLORS.black, 0.22)
        }
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} gap={2} alignItems={{ xs: "flex-start", sm: "center" }}>
        <Avatar
          variant="rounded"
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: alpha(COLORS.accent, 0.18),
            color: COLORS.textPrimary,
            fontWeight: 900
          }}
        >
          {avatarLetters}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                <Typography variant="h6" noWrap sx={{ fontWeight: 900, color: COLORS.textPrimary, minWidth: 0 }}>
                  {title}
                </Typography>

                <Chip
                  size="small"
                  label="Aktywne"
                  sx={{
                    ...chipBaseSx,
                    bgcolor: alpha(COLORS.success, 0.14),
                    borderColor: alpha(COLORS.success, 0.35)
                  }}
                />
              </Stack>

              <Stack direction="row" gap={1.25} flexWrap="wrap" alignItems="center" mt={0.5}>
                <MetaRow
                  icon={<WorkOutlineRoundedIcon fontSize="small" />}
                  text={workTypeLabel || "Brak danych"}
                />
                <DividerV />
                <MetaRow
                  icon={<LocationOnRoundedIcon fontSize="small" />}
                  text={city || "Brak lokalizacji"}
                />
                <DividerV />
                <MetaRow
                  icon={<AccessTimeRoundedIcon fontSize="small" />}
                  text={postedLabel || "Brak daty"}
                />
              </Stack>
            </Box>

            <Button
              component={Link}
              to={`/hr/vacancies/${id}`}
              variant="outlined"
              sx={{
                borderColor: COLORS.inputBorder,
                color: COLORS.textPrimary,
                bgcolor: alpha(COLORS.black, 0.02),
                px: 2.5,
                "&:hover": {
                  borderColor: alpha(COLORS.black, 0.28),
                  bgcolor: alpha(COLORS.black, 0.04)
                }
              }}
            >
              Szczegóły
            </Button>
          </Stack>

          <Stack direction="row" gap={1} flexWrap="wrap" mt={1.5}>
            {salaryLabel ? (
              <Chip
                size="small"
                label={salaryLabel}
                sx={{ ...chipBaseSx, "& .MuiChip-label": { fontWeight: 800 } }}
              />
            ) : null}
            {tags.map((tag) => (
              <Chip key={`${id}-${tag}`} size="small" label={tag} sx={chipBaseSx} />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function HrVacanciesPage() {
  const userId = getUserId(useSelector((s: RootState) => s.user.id));
  const { data, isLoading, isError, refetch } = useGetVacanciesQuery();

  const [searchText, setSearchText] = React.useState("");
  const [sortMode, setSortMode] = React.useState<SortMode>("Newest");

  if (!userId) {
    return (
      <StateCard>
        <Typography sx={{ color: COLORS.error }}>Brak informacji o użytkowniku.</Typography>
      </StateCard>
    );
  }

  if (isLoading) {
    return (
      <StateCard>
        <Typography sx={{ mb: 1, color: COLORS.textMuted }}>Ładowanie ogłoszeń…</Typography>
        <LinearProgress />
      </StateCard>
    );
  }

  if (isError) {
    return (
      <StateCard>
        <Typography sx={{ mb: 1, color: COLORS.error }}>Nie udało się pobrać ogłoszeń.</Typography>
        <Button variant="outlined" onClick={() => refetch()}>
          Spróbuj ponownie
        </Button>
      </StateCard>
    );
  }

  const vacancies = (data ?? []) as VacancyWithHr[];
  const today = new Date().toISOString().slice(0, 10);

  let list = vacancies.filter((v) => getHrId(v) === userId);
  list = list.filter((v) => {
    const end = getEndDateIso(v);
    return !end || end >= today;
  });

  const query = searchText.trim().toLowerCase();
  if (query) {
    list = list.filter((v) => {
      const title = getTitle(v).toLowerCase();
      const city = getCity(v).toLowerCase();
      const tags = getTags(v);
      return title.includes(query) || city.includes(query) || tags.some((t) => t.toLowerCase().includes(query));
    });
  }

  if (sortMode === "Newest") {
    list.sort((a, b) => new Date(b.addDate ?? 0).getTime() - new Date(a.addDate ?? 0).getTime());
  } else {
    list.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
  }

  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1}
      >
        <Stack spacing={0.25}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: COLORS.textPrimary }}>
            Oferty
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
            Aktywne oferty pracy Twojej firmy.
          </Typography>
        </Stack>

        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button component={Link} to="/hr/vacancies/archive" variant="outlined">
            Archiwum
          </Button>
          <Button
            component={Link}
            to="/hr/vacancies/new"
            variant="contained"
            color="warning"
            startIcon={<AddRoundedIcon />}
          >
            Utwórz ofertę
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ p: 1.5, border: "1px solid", borderColor: COLORS.inputBorder, borderRadius: 4 }}>
        <Stack direction={{ xs: "column", md: "row" }} gap={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <TextField
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Szukaj po nazwie, lokalizacji lub technologii…"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                )
              }
            }}
          />

          <Button
            variant="outlined"
            startIcon={<SortRoundedIcon />}
            onClick={() => {
              setSearchText("");
              setSortMode("Newest");
            }}
            sx={{
              borderColor: COLORS.inputBorder,
              color: COLORS.textPrimary,
              bgcolor: alpha(COLORS.black, 0.02),
              px: 3,
              "&:hover": {
                borderColor: alpha(COLORS.black, 0.28),
                bgcolor: alpha(COLORS.black, 0.04)
              }
            }}
          >
            Resetuj
          </Button>
        </Stack>
      </Paper>

      <Stack spacing={1.5}>
        {list.map((vacancy) => (
          <HrVacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}

        {!list.length && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              border: "1px dashed",
              borderColor: COLORS.inputBorder,
              bgcolor: COLORS.inputBg,
              borderRadius: 4
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: COLORS.textPrimary }}>
              Brak aktywnych ogłoszeń
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
              Dodaj nowe ogłoszenie, aby pojawiło się na tej liście.
            </Typography>
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}