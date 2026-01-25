import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

const toneUi = {
  good: { dot: "success.main", bg: "success.light" },
  warn: { dot: "warning.main", bg: "warning.light" },
  bad: { dot: "error.main", bg: "error.light" }
} as const;

type ToneKey = keyof typeof toneUi;

type Props = {
  strengths: string[];
  risks: string[];
  quickInsights: Array<{ label: string; tone: ToneKey }>;
};

function SectionCard({
                       title,
                       icon,
                       children
                     }: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper elevation={0} className="section" sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        sx={{ mb: 1.25 }}
      >
        {icon}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 900, color: "common.black" }}
        >
          {title}
        </Typography>
      </Stack>

      {children}
    </Paper>
  );
}

function InsightRow({
                      text,
                      tone,
                      emphasize
                    }: {
  text: string;
  tone: ToneKey;
  emphasize?: boolean;
}) {
  const ui = toneUi[tone];

  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="flex-start"
      sx={{ p: 1.05, borderRadius: 2, bgcolor: ui.bg }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: 999,
          bgcolor: ui.dot,
          mt: "6px"
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: emphasize ? 900 : 800,
          color: "common.black"
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

const fallbackList = (items: string[]) => (items.length ? items : ["—"]);

export default function ResumeInsightsCards({
                                              strengths,
                                              risks,
                                              quickInsights
                                            }: Props) {
  const strengthsList = fallbackList(strengths);
  const risksList = fallbackList(risks);

  const quickList = quickInsights.length
    ? quickInsights
    : [{ label: "—", tone: "warn" as const }];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: 1.5
      }}
    >
      <SectionCard
        title="Mocne strony"
        icon={<ThumbUpRoundedIcon sx={{ color: "success.main" }} />}
      >
        <Stack gap={0.9}>
          {strengthsList.map((text, index) => (
            <InsightRow
              key={`strength-${index}`}
              text={text}
              tone="good"
            />
          ))}
        </Stack>
      </SectionCard>

      <SectionCard
        title="Ryzyka"
        icon={<ReportProblemRoundedIcon sx={{ color: "warning.main" }} />}
      >
        <Stack gap={0.9}>
          {risksList.map((text, index) => (
            <InsightRow
              key={`risk-${index}`}
              text={text}
              tone="warn"
            />
          ))}
        </Stack>
      </SectionCard>

      <SectionCard
        title="Szybkie obserwacje"
        icon={<BoltRoundedIcon sx={{ color: "warning.main" }} />}
      >
        <Stack gap={0.9}>
          {quickList.map((item, index) => {
            const label = item.label?.trim() || "—";
            const tone = label === "—" ? "warn" : item.tone;

            return (
              <InsightRow
                key={`quick-${index}`}
                text={label}
                tone={tone}
                emphasize={label !== "—"}
              />
            );
          })}
        </Stack>
      </SectionCard>
    </Box>
  );
}