import type { ReactNode } from "react";
import { Avatar, Box, Button, Fade, Paper, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetResumeByUserIdQuery } from "../../../../api/resumesApi";
import { COLORS } from "../../../../style/ColorTheme";
import type { CandidateDto } from "../../../../types/common";
import type { ResumeResponse } from "../../../../types/resume";
import type { RootState } from "../../../../store/store";

type InfoRowProps = {
  icon: ReactNode;
  value?: string | number | null;
  title?: string;
  sx?: SxProps<Theme>;
};

function InfoRow({ icon, value, title, sx }: InfoRowProps) {
  const displayValue = value === 0 || value ? String(value) : "—";

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      sx={{
        color: COLORS.textSecondary,
        minWidth: 0,
        ...(sx as object)
      }}
      title={title ?? displayValue}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          opacity: 0.8,
          flexShrink: 0
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "inherit",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {displayValue}
      </Typography>
    </Stack>
  );
}

type ExtendedUser = {
  age?: number;
  city?: string;
  country?: string;
};

function buildExperienceLabel(value: unknown): string | undefined {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return undefined;

  const suffix = num === 1 ? "rok" : num <= 4 ? "lata" : "lat";
  return `${num} ${suffix} doświadczenia`;
}

export default function UserHeaderCard() {
  const user = useSelector((state: RootState) => state.user.user);
  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId = typeof rawUserId === "number" ? rawUserId : Number(rawUserId) || null;

  const { data } = useGetResumeByUserIdQuery(userId ?? 0, {
    skip: userId == null
  });

  const resume = data as ResumeResponse | undefined;
  const candidate = resume?.candidate as CandidateDto | undefined;

  const extendedUser = (user ?? {}) as ExtendedUser;

  const firstName = user?.firstname?.trim() ?? "";
  const lastName = user?.lastname?.trim() ?? "";

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "—";
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "U";

  const email = (candidate?.email ?? user?.email ?? "").trim() || undefined;

  const ageRaw = candidate?.age ?? extendedUser.age ?? null;
  const ageNum = ageRaw == null ? NaN : Number(ageRaw);
  const ageLabel = Number.isFinite(ageNum) ? `${ageNum} lat` : undefined;

  const city = (candidate?.address?.city ?? extendedUser.city ?? "").trim();
  const country = (candidate?.address?.country ?? extendedUser.country ?? "").trim();
  const locationLabel = city && country ? `${city}, ${country}` : city || country || undefined;

  const experienceLabel = buildExperienceLabel(resume?.yearsOfExperience);
  const salaryNum = Number(resume?.expectedSalary);
  const salaryLabel = Number.isFinite(salaryNum) && salaryNum > 0 ? `${salaryNum} PLN` : undefined;

  return (
    <Paper
      elevation={0}
      className="section"
      sx={{
        p: { xs: 2, md: 2.5 },
        width: "100%",
        minWidth: 0,
        overflow: "hidden"
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={{ xs: 2, md: 2.5 }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        sx={{ minWidth: 0 }}
      >
        <Stack direction="row" gap={2} alignItems="center" sx={{ minWidth: 0 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: COLORS.surface,
              color: COLORS.black,
              border: `1px solid ${COLORS.borderSoft}`,
              fontWeight: 800,
              fontSize: 24,
              flexShrink: 0
            }}
          >
            {initials}
          </Avatar>

          <Stack gap={1} sx={{ minWidth: 0, flex: 1 }}>
            <Fade in timeout={250}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  minWidth: 0
                }}
                title={`Cześć, ${fullName}`}
              >
                Cześć, {fullName} 👋
              </Typography>
            </Fade>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={{ xs: 0.75, sm: 1.25 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{
                minWidth: 0,
                flexWrap: { sm: "wrap" },
                rowGap: { sm: 0.75 }
              }}
            >
              <InfoRow
                icon={<EmailRoundedIcon fontSize="small" />}
                value={email}
                sx={{ maxWidth: { xs: "100%", sm: 260 } }}
              />
              <InfoRow icon={<BadgeRoundedIcon fontSize="small" />} value={ageLabel} />
              <InfoRow
                icon={<LocationOnRoundedIcon fontSize="small" />}
                value={locationLabel}
                sx={{ maxWidth: { xs: "100%", sm: 220 } }}
              />
              <InfoRow
                icon={<TimelineRoundedIcon fontSize="small" />}
                value={experienceLabel}
                sx={{ maxWidth: { xs: "100%", sm: 240 } }}
              />
              <InfoRow
                icon={<AccountBalanceWalletIcon fontSize="small" />}
                value={salaryLabel}
                sx={{ maxWidth: { xs: "100%", sm: 160 } }}
              />
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          gap={1}
          sx={{
            flexShrink: 0,
            alignSelf: { xs: "stretch", md: "auto" },
            minWidth: 0
          }}
        >
          <Button
            component={Link}
            to="/candidate/resume"
            variant="contained"
            sx={{ flex: { xs: 1, md: "unset" }, minWidth: 0 }}
          >
            Zobacz CV
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}