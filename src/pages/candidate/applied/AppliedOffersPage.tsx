import { useMemo, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Paper,
  Chip
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import { useSelector } from "react-redux";

import { useGetVacanciesByUserIdQuery } from "../../../api/vacanciesApi";
import { useGetResumeByUserIdQuery } from "../../../api/resumesApi";
import type { RootState } from "../../../store/store";
import type { VacancyResponse } from "../../../types/vacancy";
import type { ResumeResponse } from "../../../types/resume";
import { ResumeStatus } from "../../../types/enums";
import { RESUME_STATUS, RESUME_STATUS_COLOR } from "../../../types/enumLabels";
import { getVacancyTitle } from "../../../utils/offerDetailsUtils.ts";
import type { AppliedOfferItem, AppliedOffersSortOption } from "./appliedOffersTypes";
import { normalizeResumeStatus } from "../../../utils/normalizeResumeStatus";
import { COLORS } from "../../../style/ColorTheme";
import { alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";

type VacancyWithCompany = VacancyResponse & {
  company?: { name?: string | null } | null;
  companyName?: string | null;
  status?: unknown;
};

type ResumeWithVacancyId = ResumeResponse & {
  vacancyId?: number | string | null;
  status?: unknown;
};

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("pl-PL");
}

export default function AppliedOffersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<AppliedOffersSortOption>("Najnowsze");

  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId = typeof rawUserId === "number" ? rawUserId : Number(rawUserId) || null;

  const { data: userVacancies = [], isLoading: isVacanciesLoading } = useGetVacanciesByUserIdQuery(userId ?? 0, {
    skip: userId == null
  });

  const { data: userResumesData, isLoading: isResumesLoading } = useGetResumeByUserIdQuery(userId ?? 0, {
    skip: userId == null
  });

  const isLoading = isVacanciesLoading || isResumesLoading;

  const statusByVacancyId = useMemo(() => {
    const map = new Map<number, ResumeStatus>();
    if (!userResumesData) return map;

    const resumes: ResumeWithVacancyId[] = Array.isArray(userResumesData)
      ? (userResumesData as ResumeWithVacancyId[])
      : [userResumesData as ResumeWithVacancyId];

    resumes.forEach((resume) => {
      const status = normalizeResumeStatus(resume.status);
      const rawVacancyId = resume.vacancyId;
      const vacancyId =
        typeof rawVacancyId === "number"
          ? rawVacancyId
          : rawVacancyId != null
            ? Number(rawVacancyId)
            : NaN;

      if (status != null && !Number.isNaN(vacancyId)) {
        map.set(vacancyId, status);
      }
    });

    return map;
  }, [userResumesData]);

  const appliedItems: AppliedOfferItem[] = useMemo(() => {
    return (userVacancies as VacancyWithCompany[]).map((vacancy) => {
      const title = getVacancyTitle(vacancy);
      const company = (vacancy.company?.name ?? vacancy.companyName ?? "").trim();

      const cityLabel =
        [vacancy.address?.city ?? "", vacancy.address?.country ?? ""].filter(Boolean).join(", ") || null;

      const salaryLabel = vacancy.salary ? `${vacancy.salary} PLN` : null;
      const endDateLabel = formatDate(vacancy.endDate);

      const vacancyId = Number(vacancy.id);

      const statusFromVacancy = normalizeResumeStatus(vacancy.status);
      const statusFromResume = statusByVacancyId.get(vacancyId);

      const status: ResumeStatus = statusFromVacancy ?? statusFromResume ?? ResumeStatus.Sent;

      return { vacancyId, title, company, cityLabel, salaryLabel, endDateLabel, status };
    });
  }, [userVacancies, statusByVacancyId]);

  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let items = appliedItems;
    if (query) {
      items = items.filter(
        (item) => item.title.toLowerCase().includes(query) || item.company.toLowerCase().includes(query)
      );
    }

    if (sortBy === "Status") {
      return [...items].sort((a, b) => a.status - b.status);
    }

    return [...items].sort((a, b) => b.vacancyId - a.vacancyId);
  }, [appliedItems, searchQuery, sortBy]);

  const handleToggleSort = () => {
    setSortBy((prev) => (prev === "Najnowsze" ? "Status" : "Najnowsze"));
  };

  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={1}
        sx={{ minWidth: 0 }}
      >
        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Aplikowane
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Twoje złożone aplikacje i ich status.
          </Typography>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            startIcon={<SortRoundedIcon />}
            onClick={handleToggleSort}
            sx={{
              bgcolor: COLORS.black,
              color: "common.white",
              borderColor: "transparent",
              "&:hover": { bgcolor: alpha(COLORS.black, 0.85), borderColor: "transparent" },
              width: { xs: "100%", sm: "auto" }
            }}
          >
            {sortBy}
          </Button>

          <TextField
            size="small"
            placeholder="Szukaj po tytule lub firmie"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 320 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ mr: 1 }} />
                  </InputAdornment>
                )
              }
            }}
          />
        </Stack>
      </Stack>

      {isLoading && (
        <Typography variant="body2" color="text.secondary">
          Ładowanie aplikacji…
        </Typography>
      )}

      {!isLoading && (
        <Stack gap={1.5} sx={{ minWidth: 0 }}>
          {visibleItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nie masz jeszcze żadnych wysłanych aplikacji.
            </Typography>
          ) : (
            visibleItems.map((item) => {
              const statusLabel = RESUME_STATUS[item.status] ?? "Status";
              const statusColor = RESUME_STATUS_COLOR[item.status];

              return (
                <Paper
                  key={item.vacancyId}
                  elevation={0}
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(COLORS.black, 0.02) }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={0.75}
                    sx={{ minWidth: 0 }}
                  >
                    <Stack gap={0.5} sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                        {item.title}
                      </Typography>

                      {item.company && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.company}
                        </Typography>
                      )}

                      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
                        {item.cityLabel && (
                          <Stack direction="row" gap={0.5} alignItems="center">
                            <PlaceRoundedIcon fontSize="small" />
                            <Typography variant="body2" sx={{ color: "text.primary" }}>
                              {item.cityLabel}
                            </Typography>
                          </Stack>
                        )}

                        {item.salaryLabel && (
                          <Stack direction="row" gap={0.5} alignItems="center">
                            <MonetizationOnRoundedIcon fontSize="small" />
                            <Typography variant="body2" sx={{ color: "text.primary" }}>
                              {item.salaryLabel}
                            </Typography>
                          </Stack>
                        )}

                        {item.endDateLabel && (
                          <Stack direction="row" gap={0.5} alignItems="center">
                            <EventRoundedIcon fontSize="small" />
                            <Typography variant="body2" sx={{ color: "text.primary" }}>
                              Do {item.endDateLabel}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>

                    <Chip
                      label={statusLabel}
                      color={statusColor}
                      variant={statusColor === "default" ? "outlined" : "filled"}
                      sx={{ fontWeight: 600 }}
                    />
                    <Button
                      component={Link}
                      to={`/candidate/offers/${item.vacancyId}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        minHeight: 34,
                        bgcolor: COLORS.black,
                        color: "common.white",
                        "&:hover": { bgcolor: COLORS.black, borderColor: "transparent", color: COLORS.accent },
                        width: { xs: "100%", sm: "auto" }
                      }}
                    >
                      Szczegóły
                    </Button>
                  </Stack>
                </Paper>
              );
            })
          )}
        </Stack>
      )}
    </Stack>
  );
}