import { type ReactElement } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";

import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import GppBadRoundedIcon from "@mui/icons-material/GppBadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import {
  clampPercent,
  initials,
  type FilterKey,
  type ResumeStatUi,
  type ViewMode
} from "../../../../utils/HrVacancyStatisticsUtils";

type FrequentRisk = { label: string; count: number };

export type FitMeta = {
  label: "Wysokie" | "Średnie" | "Niskie";
  ringColor: "success.main" | "warning.main" | "error.main";
  icon: ReactElement;
};

type Props = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  filter: FilterKey;
  setFilter: (key: FilterKey) => void;

  query: string;
  setQuery: (value: string) => void;

  riskFilter: string | null;
  setRiskFilter: (value: string | null) => void;

  frequentRisks: FrequentRisk[];

  filtered: ResumeStatUi[];
  statsTotal: number;

  selectedResumeId: number;
  setSelectedResumeId: (id: number) => void;

  getFitMeta: (percent: number) => FitMeta;
};

const pillSx = { borderRadius: 999 } as const;

const monoChipSx = (active: boolean) =>
  ({
    ...pillSx,
    bgcolor: active ? "grey.900" : "grey.100",
    color: active ? "common.white" : "grey.900",
    fontWeight: 950
  }) as const;

const subtleChipSx = {
  ...pillSx,
  bgcolor: "grey.100",
  color: "grey.900"
} as const;

const fitChipSx = (ringColor: FitMeta["ringColor"]) =>
  ({
    ...subtleChipSx,
    fontWeight: 950,
    "& .MuiChip-icon": { color: ringColor }
  }) as const;

const selectedBorderSx = (selected: boolean) =>
  ({
    border: "1px solid",
    borderColor: selected ? "grey.900" : "divider"
  }) as const;

export default function AllCandidatesSection({
                                               viewMode,
                                               setViewMode,
                                               filter,
                                               setFilter,
                                               query,
                                               setQuery,
                                               riskFilter,
                                               setRiskFilter,
                                               frequentRisks,
                                               filtered,
                                               statsTotal,
                                               selectedResumeId,
                                               setSelectedResumeId,
                                               getFitMeta
                                             }: Props) {
  const toggleRisk = (label: string) => {
    setRiskFilter(riskFilter === label ? null : label);
  };

  return (
    <Paper elevation={0} className="glass" sx={{ p: { xs: 2, md: 2.25 } }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.75 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "grey.900", opacity: 0.9 }} />
        <Typography sx={{ fontWeight: 950 }}>Kandydaci</Typography>
        <Typography variant="caption" color="text.secondary">
          filtrowanie, ryzyka i widoki
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} gap={1} alignItems={{ xs: "stretch", md: "center" }}>
        <Stack direction="row" gap={0.75} flexWrap="wrap" alignItems="center">
          <Chip clickable onClick={() => setFilter("all")} label="Wszyscy" sx={monoChipSx(filter === "all")} />
          <Chip clickable onClick={() => setFilter("high")} label="≥70%" sx={monoChipSx(filter === "high")} />
          <Chip clickable onClick={() => setFilter("mid")} label="50–69%" sx={monoChipSx(filter === "mid")} />
          <Chip clickable onClick={() => setFilter("low")} label="<50%" sx={monoChipSx(filter === "low")} />
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
          <Stack direction="row" gap={0.75} alignItems="center">
            <Chip
              clickable
              icon={<ViewModuleRoundedIcon fontSize="small" />}
              label="Karty"
              onClick={() => setViewMode("cards")}
              sx={monoChipSx(viewMode === "cards")}
            />
            <Chip
              clickable
              icon={<BubbleChartRoundedIcon fontSize="small" />}
              label="Bąbelki"
              onClick={() => setViewMode("bubbles")}
              sx={monoChipSx(viewMode === "bubbles")}
            />
          </Stack>

          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj: kandydat, technologia, ryzyko…"
            size="small"
            sx={{
              width: { xs: "100%", md: 420 },
              "& .MuiOutlinedInput-root": pillSx
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={1}
        alignItems={{ xs: "flex-start", md: "center" }}
        sx={{ mt: 1.25 }}
      >
        <Stack direction="row" gap={0.75} alignItems="center" flexWrap="wrap">
          <Chip
            size="small"
            icon={<GppBadRoundedIcon fontSize="small" />}
            label="Szybkie filtry ryzyka"
            sx={{ ...subtleChipSx, fontWeight: 900 }}
          />

          {frequentRisks.map((risk) => {
            const isActive = riskFilter === risk.label;

            return (
              <Chip
                key={risk.label}
                clickable
                onClick={() => toggleRisk(risk.label)}
                size="small"
                icon={<WarningAmberRoundedIcon fontSize="small" />}
                label={`${risk.label} • ${risk.count}`}
                sx={{
                  ...monoChipSx(isActive),
                  "& .MuiChip-icon": { color: "warning.main" }
                }}
              />
            );
          })}

          {riskFilter ? (
            <Chip
              clickable
              size="small"
              label="Wyczyść"
              onClick={() => setRiskFilter(null)}
              sx={monoChipSx(true)}
            />
          ) : null}
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="flex-end">
          <Typography variant="body2" sx={{ color: "grey.700" }}>
            Wyświetlono: {filtered.length} / {statsTotal}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Kliknij kandydata — podgląd po prawej (bez nawigacji).
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      {viewMode === "cards" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))"
            },
            gap: 1.25
          }}
        >
          {filtered.map((candidate) => {
            const meta = getFitMeta(candidate.fit);
            const isSelected = candidate.resumeId === selectedResumeId;

            return (
              <Paper
                key={candidate.resumeId}
                elevation={0}
                onClick={() => setSelectedResumeId(candidate.resumeId)}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  cursor: "pointer",
                  transition: "box-shadow .14s ease, border-color .14s ease",
                  "&:hover": { boxShadow: "0 14px 30px rgba(0,0,0,0.10)" },
                  ...selectedBorderSx(isSelected)
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                  <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Box sx={{ position: "relative", width: 44, height: 44 }}>
                      <CircularProgress
                        variant="determinate"
                        value={clampPercent(candidate.fit)}
                        size={44}
                        thickness={5}
                        sx={{ color: meta.ringColor }}
                      />
                      <Avatar
                        sx={{
                          position: "absolute",
                          inset: 4,
                          width: 36,
                          height: 36,
                          bgcolor: "grey.100",
                          color: "grey.900",
                          fontWeight: 950,
                          border: "1px solid rgba(0,0,0,0.10)"
                        }}
                      >
                        {initials(candidate.name)}
                      </Avatar>
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 950, lineHeight: 1.2 }} noWrap>
                        {candidate.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {candidate.email}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    size="small"
                    icon={meta.icon}
                    label={`${clampPercent(candidate.fit)}%`}
                    sx={{ ...fitChipSx(meta.ringColor), height: 24 }}
                  />
                </Stack>

                <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 1.1 }}>
                  {candidate.highlights.slice(0, 3).map((highlight) => (
                    <Chip key={highlight} size="small" label={highlight} sx={{ ...subtleChipSx, fontWeight: 850 }} />
                  ))}

                  {candidate.risks.slice(0, 2).map((risk) => (
                    <Chip
                      key={risk}
                      size="small"
                      icon={<WarningAmberRoundedIcon fontSize="small" />}
                      label={risk}
                      sx={{
                        ...subtleChipSx,
                        fontWeight: 900,
                        "& .MuiChip-icon": { color: "warning.main" }
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))"
            },
            gap: 1.25
          }}
        >
          {filtered.map((candidate) => {
            const meta = getFitMeta(candidate.fit);
            const isSelected = candidate.resumeId === selectedResumeId;

            return (
              <Tooltip
                key={candidate.resumeId}
                placement="top"
                arrow
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography sx={{ fontWeight: 900 }}>{candidate.name}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      {candidate.email}
                    </Typography>
                    <Divider sx={{ my: 0.75, borderColor: "rgba(255,255,255,0.22)" }} />
                    <Typography variant="caption" sx={{ display: "block", opacity: 0.95 }}>
                      Mocne strony: {candidate.highlights.slice(0, 3).join(", ") || "—"}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", opacity: 0.95 }}>
                      Ryzyka: {candidate.risks.slice(0, 2).join(", ") || "—"}
                    </Typography>
                  </Box>
                }
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.1,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    transition: "box-shadow .14s ease, border-color .14s ease, transform .14s ease",
                    "&:hover": { boxShadow: "0 14px 30px rgba(0,0,0,0.10)", transform: "translateY(-1px)" },
                    ...selectedBorderSx(isSelected)
                  }}
                >
                  <ButtonBase
                    onClick={() => setSelectedResumeId(candidate.resumeId)}
                    sx={{ width: "100%", borderRadius: 12, textAlign: "left" }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ position: "relative", width: 58, height: 58, mx: "auto" }}>
                        <CircularProgress
                          variant="determinate"
                          value={clampPercent(candidate.fit)}
                          size={58}
                          thickness={5}
                          sx={{ color: meta.ringColor }}
                        />
                        <Avatar
                          sx={{
                            position: "absolute",
                            inset: 6,
                            width: 46,
                            height: 46,
                            bgcolor: "grey.100",
                            color: "grey.900",
                            fontWeight: 950,
                            border: "1px solid rgba(0,0,0,0.10)"
                          }}
                        >
                          {initials(candidate.name)}
                        </Avatar>
                      </Box>

                      <Typography
                        sx={{
                          mt: 1,
                          fontWeight: 950,
                          fontSize: 12.5,
                          textAlign: "center",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        title={candidate.name}
                      >
                        {candidate.name}
                      </Typography>

                      <Stack direction="row" justifyContent="center" sx={{ mt: 0.6 }}>
                        <Chip
                          size="small"
                          icon={meta.icon}
                          label={`${clampPercent(candidate.fit)}%`}
                          sx={{ ...fitChipSx(meta.ringColor), height: 22 }}
                        />
                      </Stack>
                    </Box>
                  </ButtonBase>
                </Paper>
              </Tooltip>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}