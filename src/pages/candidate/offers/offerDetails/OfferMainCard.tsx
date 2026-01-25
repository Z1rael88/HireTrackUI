import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { chipSx as baseChipSx } from "../../../../utils/offers";
import { COLORS } from "../../../../style/ColorTheme";
import type { VacancyResponse } from "../../../../types/vacancy";

type OfferMainCardProps = {
  offer: Pick<VacancyResponse, "description" | "responsibilities">;
  shouldClampDescription: boolean;
  requiredYears: number | null;
  languageLines: string[];
  technologyLines: string[];
  educationLine: string;
  workTypeLabel: string;
  salaryLabel: string;
  locationLabel: string;
  benefits: string[];
};

export default function OfferMainCard({
                                        offer,
                                        shouldClampDescription,
                                        requiredYears,
                                        languageLines,
                                        technologyLines,
                                        educationLine,
                                        workTypeLabel,
                                        salaryLabel,
                                        locationLabel,
                                        benefits
                                      }: OfferMainCardProps) {
  const responsibilities = String(offer.responsibilities ?? "").trim();

  const responsibilityLines = responsibilities
    ? responsibilities
      .split(/[,;\n]/)
      .map((part) => part.trim())
      .filter(Boolean)
    : [];

  const chipSx = [
    baseChipSx,
    {
      minWidth: 0,
      maxWidth: "100%",
      backgroundColor: alpha(COLORS.black, 0.03),
      "& .MuiChip-label": {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: { xs: "normal", sm: "nowrap" },
        overflowWrap: "anywhere",
        lineHeight: 1.25,
        py: { xs: 0.35, sm: 0 }
      }
    }
  ] as const;

  const showRequirements =
    (requiredYears != null && requiredYears > 0) ||
    languageLines.length > 0 ||
    technologyLines.length > 0 ||
    Boolean(educationLine);

  return (
    <Paper
      elevation={0}
      className="section"
      sx={{
        p: { xs: 2, sm: 2.25, md: 2.5 },
        minWidth: 0,
        overflow: "hidden"
      }}
    >
      <Stack gap={{ xs: 1, sm: 1.25 }} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Opis stanowiska
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: COLORS.textSecondary,
            overflowWrap: "anywhere",
            ...(shouldClampDescription && {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: { xs: 6, sm: 4 },
              overflow: "hidden"
            })
          }}
        >
          {offer.description || "Brak opisu."}
        </Typography>
      </Stack>

      <Stack sx={{ mt: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Obowiązki
        </Typography>

        {responsibilityLines.length > 0 ? (
          <Stack component="ul" gap={0.5} sx={{ pl: 2, mt: 0.75, mb: 0 }}>
            {responsibilityLines.map((line) => (
              <Typography
                key={line}
                component="li"
                variant="body2"
                sx={{ color: COLORS.textSecondary, overflowWrap: "anywhere" }}
              >
                {line}
              </Typography>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" sx={{ color: COLORS.textSecondary, mt: 0.75 }}>
            Brak zdefiniowanych obowiązków.
          </Typography>
        )}
      </Stack>

      {showRequirements && (
        <Stack sx={{ mt: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Wymagania
          </Typography>

          <Stack gap={1} sx={{ mt: 0.75 }}>
            {requiredYears != null && requiredYears > 0 && (
              <Typography variant="body2" sx={{ color: COLORS.textSecondary, overflowWrap: "anywhere" }}>
                Ogólne doświadczenie: min. {requiredYears} lat na podobnym stanowisku.
              </Typography>
            )}

            {languageLines.length > 0 && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.35 }}>
                  Języki
                </Typography>
                <Stack component="ul" gap={0.25} sx={{ pl: 2, m: 0 }}>
                  {languageLines.map((line) => (
                    <Typography
                      key={line}
                      component="li"
                      variant="body2"
                      sx={{ color: COLORS.textSecondary, overflowWrap: "anywhere" }}
                    >
                      {line}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            {technologyLines.length > 0 && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.35 }}>
                  Technologie
                </Typography>
                <Stack component="ul" gap={0.25} sx={{ pl: 2, m: 0 }}>
                  {technologyLines.map((line) => (
                    <Typography
                      key={line}
                      component="li"
                      variant="body2"
                      sx={{ color: COLORS.textSecondary, overflowWrap: "anywhere" }}
                    >
                      {line}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            {educationLine && (
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.35 }}>
                  Wykształcenie
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.textSecondary, overflowWrap: "anywhere" }}>
                  {educationLine}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      )}

      <Stack sx={{ mt: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Co oferujemy
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.75, minWidth: 0 }}>
          <Chip label={workTypeLabel} sx={chipSx} />
          {salaryLabel ? <Chip label={salaryLabel} sx={chipSx} /> : null}
          {locationLabel ? <Chip label={locationLabel} sx={chipSx} /> : null}
          {benefits.map((benefit) => (
            <Chip key={benefit} label={benefit} sx={chipSx} />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}