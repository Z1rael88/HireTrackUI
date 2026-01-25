import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";

import { WORK_TYPE } from "../../../types/enumLabels";
import type { VacancyResponse } from "../../../types/vacancy";
import { daysAgo } from "../../../utils/offers";

export type VacancyOffer = VacancyResponse & {
  title?: string | null;
  city?: string | null;
  location?: string | null;
  tags?: unknown[];
  technologies?: unknown[];
  postedAt?: string | null;
  createdAt?: string | null;
  salaryRange?: string | null;
  salaryFrom?: number | null;
  salaryTo?: number | null;
};

export function getWorkTypeLabel(workType: unknown): string {
  const ids = Array.isArray(workType)
    ? workType.map(Number).filter(Number.isFinite)
    : workType != null && Number.isFinite(Number(workType))
      ? [Number(workType)]
      : [];

  return ids.length
    ? ids.map((id) => (WORK_TYPE as Record<number, string>)[id] ?? `Typ ${id}`).join(", ")
    : "";
}

type JobCardProps = {
  offer: VacancyOffer;
  onApply: () => void;
};

function parseYmdDate(value?: string | null): Date | null {
  if (!value) return null;

  const parts = value.split("-").map((v) => Number(v));
  const [y, m, d] = parts;

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

export function OfferJobCards({ offer, onApply }: JobCardProps) {
  const vacancyId = offer.id;
  const vacancyTitle = offer.name || offer.title || "Oferta";
  const workTypeLabel = getWorkTypeLabel(offer.workType);

  const cityLabel = offer.address?.city || offer.city || offer.location || "";
  const postedAt = offer.addDate || offer.postedAt || offer.createdAt;
  const postedLabel = postedAt ? daysAgo(postedAt) : "";

  const salaryAmountLabel =
    offer.salaryRange ||
    (offer.salaryFrom != null && offer.salaryTo != null
      ? `${offer.salaryFrom}–${offer.salaryTo} PLN`
      : offer.salary != null
        ? `${offer.salary} PLN`
        : undefined);

  const salaryLabel = salaryAmountLabel ? `Wynagrodzenie: ${salaryAmountLabel}` : undefined;

  const rawTags: unknown[] = Array.isArray(offer.tags)
    ? offer.tags
    : Array.isArray(offer.technologies)
      ? offer.technologies
      : [];

  const tags = rawTags
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .slice(0, 12);

  const avatarSource = vacancyTitle || cityLabel;
  const avatarLetters = String(avatarSource).substring(0, 2).toUpperCase();

  const todayUtc = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  );

  const endDate = parseYmdDate(offer.endDate);
  const isExpired = endDate != null && endDate.getTime() < todayUtc.getTime();

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ p: { xs: 1.75, sm: 2.25, md: 2.5 }, borderRadius: 3, minWidth: 0, overflow: "hidden" }}
    >
      <Stack direction="row" gap={{ xs: 1.5, sm: 2 }} alignItems="flex-start" sx={{ minWidth: 0 }}>
        <Avatar
          variant="rounded"
          sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            flexShrink: 0,
            fontWeight: 800
          }}
        >
          {avatarLetters}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "flex-start" }}
            justifyContent="space-between"
            gap={{ xs: 1.25, sm: 2 }}
            sx={{ minWidth: 0 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: { xs: 2, sm: 1 },
                  overflow: "hidden"
                }}
              >
                {vacancyTitle}
              </Typography>

              <Stack
                direction="row"
                gap={{ xs: 1, sm: 1.5 }}
                flexWrap="wrap"
                alignItems="center"
                mt={0.75}
                sx={{ minWidth: 0 }}
              >
                <Stack direction="row" gap={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                  <WorkOutlineRoundedIcon fontSize="small" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: { xs: "normal", sm: "nowrap" }
                    }}
                  >
                    {workTypeLabel || "Brak danych"}
                  </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <LocationOnRoundedIcon fontSize="small" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: { xs: "normal", sm: "nowrap" }
                    }}
                  >
                    {cityLabel || "Brak lokalizacji"}
                  </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

                <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <AccessTimeRoundedIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    {postedLabel || "Brak daty"}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              flexWrap="wrap"
              sx={{
                flexShrink: 0,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "flex-start", sm: "flex-end" }
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={onApply}
                disabled={isExpired}
                sx={{ borderRadius: 999, fontWeight: 750, px: 2, minHeight: 40, flex: { xs: 1, sm: "initial" } }}
              >
                Aplikuj
              </Button>

              <Button
                component={Link}
                to={`/candidate/offers/${vacancyId}`}
                variant="outlined"
                size="small"
                sx={{ px: 2, minHeight: 40, flex: { xs: 1, sm: "initial" } }}
              >
                Szczegóły
              </Button>
            </Stack>
          </Stack>

          {(salaryLabel || tags.length > 0) && (
            <Stack direction="row" gap={1} flexWrap="wrap" mt={{ xs: 1.25, sm: 1.5 }} sx={{ minWidth: 0 }}>
              {salaryLabel ? (
                <Chip
                  size="small"
                  label={salaryLabel}
                  variant="outlined"
                  sx={{
                    maxWidth: "100%",
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%"
                    }
                  }}
                />
              ) : null}

              {tags.map((tag) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  variant="outlined"
                  sx={{
                    maxWidth: { xs: "100%", sm: 260 },
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%"
                    }
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}