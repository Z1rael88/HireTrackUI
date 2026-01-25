import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import { Link } from "react-router-dom";

import { getPostedAt } from "../../utils/offers";
import { COLORS } from "../../style/ColorTheme";
import type { VacancyResponse } from "../../types/vacancy";
import { WorkType } from "../../types/enums";

type Offer = VacancyResponse & {
  city?: string;
  country?: string;
  companyName?: string;
  company?: { name?: string };
  title?: string;
  workType?: WorkType | WorkType[] | null;
  salary?: number;
  salaryFrom?: number;
  salaryTo?: number;
  description?: string;
  responsibilities?: string;
};

type SimilarOffersProps = {
  base: Offer;
  pool: Array<Offer | null | undefined>;
};

function getWorkTypeLabel(workType?: WorkType | WorkType[] | null): string {
  const value = Array.isArray(workType) ? workType[0] : workType;
  if (value == null) return "Tryb pracy";

  const labels: Record<WorkType, string> = {
    [WorkType.OnSite]: "Praca stacjonarna",
    [WorkType.Hybrid]: "Praca hybrydowa",
    [WorkType.Remote]: "Praca zdalna"
  };

  return labels[value] ?? `Typ ${value}`;
}

function getLocationParts(offer?: Offer | null) {
  const city = String(offer?.address?.city ?? offer?.city ?? "").trim();
  const country = String(offer?.address?.country ?? offer?.country ?? "").trim();
  return { city, country };
}

function getLocationLabel(offer?: Offer | null): string {
  const { city, country } = getLocationParts(offer);
  if (!city && !country) return "";
  if (city && country) return `${city}, ${country}`;
  return city || country;
}

function getSalaryLabel(offer?: Offer | null): string {
  if (typeof offer?.salary === "number") return `${offer.salary} PLN`;
  if (typeof offer?.salaryFrom === "number" && typeof offer?.salaryTo === "number") {
    return `${offer.salaryFrom}–${offer.salaryTo} PLN`;
  }
  return "";
}

function getAvatarLetters(offer?: Offer | null): string {
  const source = String(offer?.companyName ?? offer?.company?.name ?? offer?.name ?? offer?.title ?? "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase() || "?";
}

function parseYmdDate(value?: string | null): Date | null {
  if (!value) return null;

  const parts = value.split("-").map((v) => Number(v));
  const [y, m, d] = parts;

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

function isActiveOffer(offer: Offer, todayUtc: Date): boolean {
  const endDate = parseYmdDate((offer as { endDate?: string | null }).endDate);
  if (!endDate) return true;
  return endDate.getTime() >= todayUtc.getTime();
}

function getMatchScore(baseOffer: Offer, otherOffer: Offer): number {
  let score = 0;

  const baseWorkType = Array.isArray(baseOffer.workType) ? baseOffer.workType[0] : baseOffer.workType;
  const otherWorkType = Array.isArray(otherOffer.workType) ? otherOffer.workType[0] : otherOffer.workType;

  if (baseWorkType != null && otherWorkType != null && baseWorkType === otherWorkType) score += 50;

  const baseLoc = getLocationParts(baseOffer);
  const otherLoc = getLocationParts(otherOffer);

  if (baseLoc.city && otherLoc.city && baseLoc.city.toLowerCase() === otherLoc.city.toLowerCase()) score += 40;
  else if (baseLoc.country && otherLoc.country && baseLoc.country.toLowerCase() === otherLoc.country.toLowerCase())
    score += 20;

  return Math.max(0, Math.min(100, score));
}

function postedTextPl(value: unknown): string {
  if (value == null) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfThen = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const diffDays = Math.floor((startOfNow - startOfThen) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) return "Dzisiaj";
  if (diffDays === 1) return "1 dzień temu";
  return `${diffDays} dni temu`;
}

function getMatchColor(theme: Theme, value: number) {
  if (value >= 70) return theme.palette.success.main;
  if (value >= 45) return theme.palette.warning.main;
  return theme.palette.error.main;
}

const chipSx = {
  fontWeight: 800,
  bgcolor: alpha(COLORS.black, 0.03),
  border: `1px solid ${COLORS.borderSoft}`,
  color: COLORS.textPrimary,
  maxWidth: "100%",
  "& .MuiChip-label": {
    px: 1,
    py: { xs: 0.45, sm: 0 },
    display: "block",
    lineHeight: 1.25,
    whiteSpace: { xs: "normal", sm: "nowrap" },
    overflow: "hidden",
    textOverflow: "ellipsis",
    overflowWrap: "anywhere"
  }
} as const;

export default function SimilarOffers({ base, pool }: SimilarOffersProps) {
  const baseId = String(base.id);

  const todayUtc = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())
  );

  const similarOffers = pool
    .filter((offer): offer is Offer => offer != null && String(offer.id) !== baseId)
    .filter((offer) => isActiveOffer(offer, todayUtc))
    .map((offer) => ({ offer, score: getMatchScore(base, offer) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (similarOffers.length === 0) return null;

  return (
    <Box sx={{ mt: { xs: 2, sm: 3 }, minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: { xs: 1, sm: 1.5 }, gap: 0.75 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 850 }}>
          Podobne oferty
        </Typography>

        <Typography variant="caption" sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }} noWrap>
          Dopasowanie według trybu pracy i lokalizacji
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={{ xs: 1.5, md: 2 }} sx={{ minWidth: 0 }}>
        {similarOffers.map(({ offer, score }) => {
          const offerTitle = offer.name ?? offer.title ?? "Oferta";
          const workTypeText = getWorkTypeLabel(offer.workType);
          const locationText = getLocationLabel(offer);
          const salaryText = getSalaryLabel(offer);

          const postedAt = getPostedAt(offer);
          const postedText = postedTextPl(postedAt);

          const avatarLetters = getAvatarLetters(offer);

          const descriptionText = String(offer.description ?? offer.responsibilities ?? "").trim();
          const descriptionSnippet = descriptionText
            ? descriptionText.split(/\s+/).slice(0, 25).join(" ")
            : "Brak opisu oferty.";

          return (
            <Paper
              key={String(offer.id) || offerTitle}
              elevation={0}
              variant="outlined"
              sx={{
                flex: 1,
                minWidth: 0,
                p: { xs: 1.75, sm: 2 },
                borderRadius: 3,
                bgcolor: alpha(COLORS.black, 0.02),
                overflow: "hidden",
                transition: "transform .15s ease, border-color .15s ease, background-color .15s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  borderColor: COLORS.border,
                  bgcolor: alpha(COLORS.black, 0.03)
                }
              }}
            >
              <Stack gap={1.25} sx={{ minWidth: 0 }}>
                <Stack direction="row" gap={1.25} alignItems="flex-start" sx={{ minWidth: 0 }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(COLORS.accent, 0.18),
                      border: `1px solid ${alpha(COLORS.accent, 0.35)}`,
                      color: COLORS.textPrimary,
                      fontWeight: 850,
                      flexShrink: 0
                    }}
                  >
                    {avatarLetters}
                  </Avatar>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 850 }} noWrap>
                      {offerTitle}
                    </Typography>

                    <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 0.35, color: "text.secondary" }}>
                      {workTypeText && (
                        <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                          <WorkOutlineRoundedIcon fontSize="inherit" />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {workTypeText}
                          </Typography>
                        </Stack>
                      )}

                      {locationText && (
                        <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                          <LocationOnRoundedIcon fontSize="inherit" />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {locationText}
                          </Typography>
                        </Stack>
                      )}

                      {postedText && (
                        <Stack direction="row" gap={0.5} alignItems="center">
                          <AccessTimeRoundedIcon fontSize="inherit" />
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {postedText}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={(theme) => ({
                        color: "text.secondary",
                        mt: 0.85,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflowWrap: "anywhere",
                        [theme.breakpoints.up("sm")]: { WebkitLineClamp: 2 }
                      })}
                    >
                      {descriptionSnippet}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" sx={{ minWidth: 0 }}>
                  <Chip
                    size="small"
                    sx={chipSx}
                    label={
                      <Box component="span"
                           sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                        <Box
                          component="span"
                          sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          Dopasowanie:
                        </Box>
                        <Box
                          component="span"
                          sx={(theme) => ({
                            color: getMatchColor(theme, score),
                            fontWeight: 900,
                            whiteSpace: "nowrap"
                          })}
                        >
                          {score}%
                        </Box>
                      </Box>
                    }
                  />
                  {salaryText && <Chip size="small" label={salaryText} sx={chipSx} />}
                </Stack>

                <Button
                  component={Link}
                  to={`/candidate/offers/${offer.id}`}
                  variant="outlined"
                  sx={{
                    mt: 0.5,
                    minHeight: 42,
                    width: { xs: "100%", sm: "auto" },
                    borderColor: COLORS.borderSoft,
                    color: COLORS.textPrimary,
                    "&:hover": { borderColor: COLORS.border, bgcolor: alpha(COLORS.black, 0.04) }
                  }}
                >
                  Szczegóły
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
