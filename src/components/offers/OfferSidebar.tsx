import { useMemo, useState } from "react";
import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { alpha } from "@mui/material/styles";

import { daysAgo, getCity, getCompany, getPostedAt, getSalary } from "../../utils/offers";
import { COLORS } from "../../style/ColorTheme";
import type { UserProfileResponse } from "../../types/user";
import type { CompanyResponse } from "../../types/company";

type OfferSidebarProps = {
  offer: unknown;
  hrUser?: UserProfileResponse;
  company?: CompanyResponse;
  onApply: () => void;
};

type OfferContact = {
  hrName?: string;
  hrEmail?: string;
};

function getAvatarLetters(source: string) {
  return source
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function OfferSidebar({ offer, hrUser, company, onApply }: OfferSidebarProps) {
  const [isCompanyExpanded, setIsCompanyExpanded] = useState(false);

  const salaryValue = getSalary(offer);
  const postedAt = getPostedAt(offer);
  const postedLabel = postedAt != null ? daysAgo(String(postedAt)) : "";
  const cityLabel = getCity(offer);

  const companyName = company?.name || getCompany(offer);
  const companyDescription = (company?.description ?? "").trim();

  const offerContact = offer as OfferContact | null;
  const hrName = `${hrUser?.firstname ?? ""} ${hrUser?.lastname ?? ""}`.trim() || offerContact?.hrName || "Rekruter";
  const hrEmail = hrUser?.email || offerContact?.hrEmail || "";

  const avatarLetters = useMemo(() => {
    const source = hrName || companyName || "HR";
    return getAvatarLetters(source);
  }, [hrName, companyName]);

  const shouldClampCompany = !isCompanyExpanded && companyDescription.length > 0;

  return (
    <Stack gap={{ xs: 1.5, sm: 2 }} sx={{ minWidth: 0, width: "100%" }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 1.75, sm: 2 },
          borderRadius: 3,
          bgcolor: alpha(COLORS.black, 0.02),
          minWidth: 0,
          overflow: "hidden"
        }}
      >
        <Typography sx={{ fontWeight: 850, mb: 1 }}>Szczegóły</Typography>

        <Stack gap={1} sx={{ minWidth: 0 }}>
          {salaryValue != null && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: COLORS.textMuted, fontWeight: 750 }}>
                Wynagrodzenie
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 850 }} noWrap>
                {String(salaryValue)} PLN
              </Typography>
            </Box>
          )}

          {postedLabel && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: COLORS.textMuted, fontWeight: 750 }}>
                Dodano
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 750 }} noWrap>
                {postedLabel}
              </Typography>
            </Box>
          )}

          {cityLabel && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: COLORS.textMuted, fontWeight: 750 }}>
                Lokalizacja
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 750 }} noWrap>
                {cityLabel}
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 1.75, sm: 2 },
          borderRadius: 3,
          bgcolor: alpha(COLORS.black, 0.02),
          minWidth: 0,
          overflow: "hidden"
        }}
      >
        <Stack direction="row" gap={1} alignItems="center" mb={1} sx={{ minWidth: 0 }}>
          <BusinessRoundedIcon fontSize="small" sx={{ color: "text.secondary", flexShrink: 0 }} />
          <Typography sx={{ fontWeight: 850 }}>O firmie</Typography>
        </Stack>

        {companyName && (
          <Typography variant="body2" sx={{ fontWeight: 850, mb: 0.5 }} noWrap>
            {companyName}
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            overflowWrap: "anywhere",
            ...(shouldClampCompany && {
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 6
            })
          }}
        >
          {companyDescription || "Brak opisu."}
        </Typography>

        {companyDescription.length > 160 && (
          <Button
            variant="text"
            onClick={() => setIsCompanyExpanded((prev) => !prev)}
            sx={{
              mt: 0.75,
              px: 0,
              minHeight: 36,
              fontWeight: 850,
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
                backgroundColor: "transparent",
                textDecoration: "underline",
                textUnderlineOffset: "4px"
              }
            }}
          >
            {isCompanyExpanded ? "Pokaż mniej" : "Pokaż więcej"}
          </Button>
        )}
      </Paper>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 1.75, sm: 2 },
          borderRadius: 3,
          bgcolor: alpha(COLORS.black, 0.02),
          minWidth: 0,
          overflow: "hidden"
        }}
      >
        <Stack direction="row" gap={1} alignItems="center" mb={1.25} sx={{ minWidth: 0 }}>
          <PersonRoundedIcon fontSize="small" sx={{ color: "text.secondary", flexShrink: 0 }} />
          <Typography sx={{ fontWeight: 850 }}>Kontakt HR</Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          gap={{ xs: 1, sm: 1.25 }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ minWidth: 0 }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(COLORS.accent, 0.18),
              color: COLORS.textPrimary,
              border: `1px solid ${alpha(COLORS.accent, 0.35)}`,
              fontWeight: 850,
              flexShrink: 0
            }}
          >
            {avatarLetters}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1, width: "100%" }}>
            <Typography sx={{ fontWeight: 850 }} noWrap>
              {hrName}
            </Typography>

            {hrEmail && (
              <Stack direction="row" gap={0.5} alignItems="center" sx={{ color: "text.secondary", minWidth: 0 }}>
                <EmailRoundedIcon fontSize="small" sx={{ opacity: 0.9, flexShrink: 0 }} />
                <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                  {hrEmail}
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          onClick={onApply}
          sx={{
            mt: 1.25,
            minHeight: 44,
            fontWeight: 850
          }}
        >
          Aplikuj teraz
        </Button>
      </Paper>
    </Stack>
  );
}