import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../../../store/store";
import { useGetResumeByUserIdQuery } from "../../../../api/resumesApi";
import type { DonutProps } from "../../../../types/donut";
import { COLORS } from "../../../../style/ColorTheme";

type QueryError = { status?: number };

type CompletionField = {
  ok: boolean;
  label: string;
};

const ALL_FIELDS: CompletionField[] = [
  { ok: false, label: "Imię" },
  { ok: false, label: "Nazwisko" },
  { ok: false, label: "Email" },
  { ok: false, label: "Miasto" },
  { ok: false, label: "Doświadczenie (lata)" },
  { ok: false, label: "Języki" },
  { ok: false, label: "Doświadczenie zawodowe" },
  { ok: false, label: "Wykształcenie" }
];

function Donut({
                 main,
                 total = 100,
                 size = 120,
                 thickness = 14,
                 color,
                 track,
                 center
               }: DonutProps) {
  const radius = (size - thickness) / 2;
  const circumference = Math.PI * 2 * radius;

  const clamped = Math.max(0, Math.min(main, total));
  const dashLength = total > 0 ? (clamped / total) * circumference : 0;

  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track ?? COLORS.border}
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color ?? COLORS.accent}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dashLength} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
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

function getPercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

export default function ProfileComplectionCard() {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  const rawUserId = useSelector((state: RootState) => state.user.id);
  const userId = typeof rawUserId === "number" ? rawUserId : Number(rawUserId) || null;

  const { data: resume, isLoading, isError, error } = useGetResumeByUserIdQuery(
    userId ?? 0,
    { skip: userId == null }
  );

  const isNotFound = isError && (error as QueryError | undefined)?.status === 404;
  const noResume = userId == null || isNotFound;

  const fields: CompletionField[] = noResume
    ? ALL_FIELDS
    : [
      { ok: Boolean(resume?.candidate?.firstname), label: "Imię" },
      { ok: Boolean(resume?.candidate?.lastname), label: "Nazwisko" },
      { ok: Boolean(resume?.candidate?.email), label: "Email" },
      { ok: Boolean(resume?.candidate?.address?.city), label: "Miasto" },
      {
        ok:
          typeof resume?.yearsOfExperience === "number" &&
          resume.yearsOfExperience > 0,
        label: "Doświadczenie (lata)"
      },
      {
        ok:
          Array.isArray(resume?.languageLevels) &&
          resume.languageLevels.length > 0,
        label: "Języki"
      },
      {
        ok:
          Array.isArray(resume?.jobExperiences) &&
          resume.jobExperiences.length > 0,
        label: "Doświadczenie zawodowe"
      },
      {
        ok:
          Array.isArray(resume?.educations) &&
          resume.educations.length > 0,
        label: "Wykształcenie"
      }
    ];

  const completedCount = fields.filter((f) => f.ok).length;
  const percent = noResume ? 0 : getPercent(completedCount, fields.length);

  const missingLabels = fields.filter((f) => !f.ok).map((f) => f.label);
  const labelsToShow = noResume ? ALL_FIELDS.map((f) => f.label) : missingLabels;

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
          main={isLoading ? 0 : percent}
          total={100}
          size={donutSize}
          thickness={donutThickness}
          track={COLORS.border}
          color={COLORS.accent}
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
                {isLoading ? "…" : `${percent}%`}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
                Uzupełnienie
              </Typography>
            </Stack>
          }
        />

        <Stack
          spacing={0.75}
          sx={{
            minWidth: 0,
            flex: 1,
            width: "100%",
            alignItems: { xs: "center", sm: "flex-start" }
          }}
        >
          <Typography sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
            Uzupełnienie profilu
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: COLORS.textSecondary,
              textAlign: { xs: "center", sm: "left" }
            }}
          >
            {noResume
              ? "Brak danych CV. Utwórz swoje CV, aby uzupełnić profil."
              : "Uzupełnij brakujące dane, aby zwiększyć szanse na dopasowane oferty."}
          </Typography>

          <Stack
            direction="row"
            gap={1}
            sx={{
              mt: 1,
              flexWrap: "wrap",
              minWidth: 0,
              justifyContent: { xs: "center", sm: "flex-start" }
            }}
          >
            {labelsToShow.map((label) => (
              <Chip
                key={label}
                size="small"
                label={label}
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  borderColor: COLORS.borderSoft,
                  maxWidth: "100%",
                  "& .MuiChip-label": {
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                }}
              />
            ))}
          </Stack>

          <Button
            component={Link}
            to="/candidate/resume"
            variant="contained"
            fullWidth={isSmDown}
            sx={{
              mt: 1,
              alignSelf: { xs: "stretch", sm: "flex-start" }
            }}
          >
            Uzupełnij teraz
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}