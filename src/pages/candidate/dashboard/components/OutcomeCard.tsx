import { Box, Button, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useGetVacanciesByUserIdQuery } from "../../../../api/vacanciesApi";
import { COLORS } from "../../../../style/ColorTheme";
import type { DonutProps } from "../../../../types/donut";
import { ResumeStatus } from "../../../../types/enums";
import type { RootState } from "../../../../store/store";
import { normalizeResumeStatus } from "../../../../utils/normalizeResumeStatus";

type QueryError = { status?: number };

function Donut({
                 main,
                 secondary = 0,
                 total,
                 size = 120,
                 thickness = 14,
                 color,
                 secondaryColor,
                 track,
                 center
               }: DonutProps) {
  const radius = (size - thickness) / 2;
  const circumference = Math.PI * 2 * radius;

  const clampToTotal = (value: number) => Math.max(0, Math.min(value, total));
  const mainValue = clampToTotal(main);
  const secondaryValue = clampToTotal(secondary);

  const mainDash = total > 0 ? (mainValue / total) * circumference : 0;
  const secondaryDash = total > 0 ? (secondaryValue / total) * circumference : 0;
  const mainRatio = total > 0 ? mainValue / total : 0;

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track ?? COLORS.border}
          strokeWidth={thickness}
          fill="none"
        />

        {total > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color ?? COLORS.accent}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${mainDash} ${circumference}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}

        {total > 0 && secondaryValue > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={secondaryColor ?? COLORS.accentHover}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${secondaryDash} ${circumference}`}
            transform={`rotate(${360 * mainRatio - 90} ${size / 2} ${size / 2})`}
          />
        )}
      </svg>

      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none"
        }}
      >
        {center}
      </Stack>
    </Box>
  );
}

export default function OutcomeCard() {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId =
    typeof rawUserId === "number" ? rawUserId : Number(rawUserId) || null;

  const { data: vacancies = [], isLoading, isError, error } =
    useGetVacanciesByUserIdQuery(userId ?? 0, {
      skip: userId == null
    });

  const isNotFound =
    isError && (error as QueryError | undefined)?.status === 404;

  let acceptedCount = 0;
  let rejectedCount = 0;

  if (!isNotFound && !isError) {
    vacancies.forEach((vacancy) => {
      const status = normalizeResumeStatus(
        (vacancy as { status?: unknown }).status
      );

      if (status === ResumeStatus.Accepted) acceptedCount += 1;
      if (status === ResumeStatus.Rejected) rejectedCount += 1;
    });
  }

  const total = acceptedCount + rejectedCount;
  const acceptedPercent =
    total > 0 ? Math.round((acceptedCount / total) * 100) : 0;

  const donutSize = isSmDown ? 104 : 120;
  const donutThickness = isSmDown ? 12 : 14;

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
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        gap={{ xs: 2, sm: 2.5 }}
        sx={{ minWidth: 0 }}
      >
        <Donut
          main={isLoading || isError ? 0 : acceptedCount}
          secondary={isLoading || isError ? 0 : rejectedCount}
          total={isLoading || isError ? 0 : total}
          size={donutSize}
          thickness={donutThickness}
          color={COLORS.success}
          secondaryColor={COLORS.error}
          track={COLORS.border}
          center={
            <Stack alignItems="center" spacing={0}>
              <Typography
                variant={isSmDown ? "h6" : "h5"}
                sx={{
                  fontWeight: 800,
                  color: COLORS.textPrimary,
                  lineHeight: 1
                }}
              >
                {isLoading ? "…" : `${isError ? 0 : acceptedPercent}%`}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: COLORS.textSecondary }}
              >
                Akceptowane
              </Typography>
            </Stack>
          }
        />

        <Stack
          spacing={0.75}
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            alignItems: { xs: "center", sm: "flex-start" }
          }}
        >
          <Typography sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
            Wyniki aplikacji
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ flexWrap: "wrap", minWidth: 0 }}
          >
            <CheckCircleRoundedIcon
              fontSize="small"
              sx={{ color: COLORS.success }}
            />
            <Typography
              variant="body2"
              sx={{ color: COLORS.textPrimary, fontWeight: 700 }}
            >
              {isLoading ? "…" : isError ? 0 : acceptedCount}
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
              zaakceptowane
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ flexWrap: "wrap", minWidth: 0 }}
          >
            <CancelRoundedIcon fontSize="small" sx={{ color: COLORS.error }} />
            <Typography
              variant="body2"
              sx={{ color: COLORS.textPrimary, fontWeight: 700 }}
            >
              {isLoading ? "…" : isError ? 0 : rejectedCount}
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
              odrzucone
            </Typography>
          </Stack>

          <Button
            component={Link}
            to="/candidate/applied"
            variant="contained"
            fullWidth={isSmDown}
            sx={{
              mt: 0.75,
              alignSelf: { xs: "stretch", sm: "flex-start" }
            }}
          >
            Zobacz aplikacje
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}