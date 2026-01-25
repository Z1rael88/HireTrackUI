import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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

import { useGetVacanciesQuery } from "../../../api/vacanciesApi";
import type { VacancyResponse } from "../../../types/vacancy";
import type { RootState } from "../../../store/store";
import { WORK_TYPE } from "../../../types/enumLabels";
import { COLORS } from "../../../style/ColorTheme";
import { daysAgo } from "../../../utils/offers";

type VacancyWithHr = VacancyResponse & {
  hrId?: number;
  hr?: { id?: number };
};

function getUserId(raw: RootState["user"]["id"]): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

function getHrId(v: VacancyWithHr): number | null {
  if (typeof v.hrId === "number") return v.hrId;
  if (typeof v.hr?.id === "number") return v.hr.id;
  return null;
}

function getWorkTypeLabel(workType: unknown): string {
  const map = WORK_TYPE as Record<number, string>;

  const ids = Array.isArray(workType)
    ? workType.map((x) => Number(x)).filter(Number.isFinite)
    : typeof workType === "number"
      ? [workType]
      : [];

  const labels = ids.map((id) => map[id]).filter(Boolean);
  return labels.join(", ");
}

function getPostedLabel(v: VacancyResponse): string {
  const posted = v.addDate;
  return posted ? daysAgo(posted) : "";
}

function getSalaryLabel(v: VacancyResponse): string | null {
  return Number.isFinite(v.salary) ? `Wynagrodzenie: ${v.salary} PLN` : null;
}

function getTags(v: VacancyResponse): string[] {
  const techReqs = v.requirements?.jobExperience?.technologyRequirements;
  if (!Array.isArray(techReqs)) return [];
  return techReqs.map((t) => String(t?.name ?? "").trim()).filter(Boolean);
}

const chipBaseSx = {
  border: "1px solid",
  borderColor: COLORS.inputBorder,
  bgcolor: COLORS.inputBg,
  fontWeight: 700
} as const;

type ArchiveVacancyCardProps = {
  vacancy: VacancyResponse;
};

function ArchiveVacancyCard({ vacancy }: ArchiveVacancyCardProps) {
  const id = vacancy.id;
  const title = vacancy.name ?? "Oferta";
  const workTypeLabel = getWorkTypeLabel(vacancy.workType);
  const city = vacancy.address?.city ?? "";
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
                  label="Zakończone"
                  sx={{
                    ...chipBaseSx,
                    bgcolor: alpha(COLORS.accent, 0.18),
                    borderColor: alpha(COLORS.accent, 0.45)
                  }}
                />
              </Stack>

              <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center" mt={0.5}>
                <Stack direction="row" gap={1} alignItems="center" sx={{ color: COLORS.textMuted }}>
                  <WorkOutlineRoundedIcon fontSize="small" />
                  <Typography variant="body2">{workTypeLabel || "Brak danych"}</Typography>
                </Stack>

                <Divider orientation="vertical" flexItem sx={{ borderColor: alpha(COLORS.black, 0.12) }} />

                <Stack direction="row" gap={0.5} alignItems="center" sx={{ color: COLORS.textMuted }}>
                  <LocationOnRoundedIcon fontSize="small" />
                  <Typography variant="body2">{city || "Brak lokalizacji"}</Typography>
                </Stack>

                <Divider orientation="vertical" flexItem sx={{ borderColor: alpha(COLORS.black, 0.12) }} />

                <Stack direction="row" gap={0.5} alignItems="center" sx={{ color: COLORS.textMuted }}>
                  <AccessTimeRoundedIcon fontSize="small" />
                  <Typography variant="body2">{postedLabel || "Brak daty"}</Typography>
                </Stack>
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
                sx={{
                  ...chipBaseSx,
                  "& .MuiChip-label": { fontWeight: 800 }
                }}
              />
            ) : null}

            {tags.map((tag) => (
              <Chip key={tag} size="small" label={tag} sx={chipBaseSx} />
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function HrVacanciesArchivePage() {
  const userId = getUserId(useSelector((state: RootState) => state.user.id));
  const { data, isLoading, isError, refetch } = useGetVacanciesQuery();
  const [searchText, setSearchText] = React.useState("");

  const notified = React.useRef({ noUser: false, loadError: false });

  React.useEffect(() => {
    if (!userId && !notified.current.noUser) {
      notified.current.noUser = true;
      toast.error("Brak informacji o użytkowniku.");
    }
  }, [userId]);

  React.useEffect(() => {
    if (isError && !notified.current.loadError) {
      notified.current.loadError = true;
      toast.error("Nie udało się pobrać ogłoszeń.");
    }
  }, [isError]);

  if (!userId) return null;

  if (isLoading) {
    return (
      <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: COLORS.inputBorder, borderRadius: 4 }}>
        <Typography sx={{ mb: 1, color: COLORS.textMuted }}>Ładowanie ogłoszeń…</Typography>
        <LinearProgress />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: COLORS.inputBorder, borderRadius: 4 }}>
        <Button variant="outlined" onClick={() => refetch()}>
          Spróbuj ponownie
        </Button>
      </Paper>
    );
  }

  const vacancies = (data ?? []) as VacancyWithHr[];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  const query = searchText.trim().toLowerCase();

  const archived = vacancies
    .filter((v) => getHrId(v) === userId)
    .filter((v) => {
      if (!v.endDate) return false;
      const end = new Date(v.endDate);
      if (Number.isNaN(end.getTime())) return false;
      end.setHours(0, 0, 0, 0);
      return end.getTime() < todayTs;
    });

  const filtered = !query
    ? archived
    : archived.filter((v) => {
      const title = String(v.name ?? "").toLowerCase();
      const city = String(v.address?.city ?? "").toLowerCase();
      const tags = getTags(v);
      return title.includes(query) || city.includes(query) || tags.some((t) => t.toLowerCase().includes(query));
    });

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
            Archiwum
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
            Zakończone oferty pracy Twojej firmy.
          </Typography>
        </Stack>

        <Button component={Link} to="/hr/vacancies" variant="outlined">
          Aktywne oferty
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 1.5, border: "1px solid", borderColor: COLORS.inputBorder, borderRadius: 4 }}>
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
      </Paper>

      <Stack spacing={1.5}>
        {filtered.map((vacancy) => (
          <ArchiveVacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}

        {!filtered.length && (
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
              Brak zakończonych ogłoszeń
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
              Zakończone oferty będą pojawiać się w tym miejscu.
            </Typography>
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}