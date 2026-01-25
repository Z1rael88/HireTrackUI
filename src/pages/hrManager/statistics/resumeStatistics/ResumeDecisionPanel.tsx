import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import { SECONDARY_TEXT } from "../../../../utils/offers";

type RequirementItem = { label: string; scorePercent: number; note: string };

type Props = {
  hasFit: boolean;
  fit: number;
  meta: { label: string };

  inviteSent: boolean;
  canInvite: boolean;
  isSendingInvite: boolean;
  openInviteModal: () => void;

  candidateEmail: string;
  copyToClipboard: (value: string, label: string) => Promise<void>;

  weakestRequirements: RequirementItem[];
};

type ToneKey = "neutral" | "success" | "warning" | "error";

const clampPercent = (value: number) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

const getTone = (hasFit: boolean, fitPercent: number): ToneKey => {
  if (!hasFit) return "neutral";
  if (fitPercent >= 70) return "success";
  if (fitPercent >= 50) return "warning";
  return "error";
};

const toneConfig = {
  success: { Icon: CheckCircleRoundedIcon, colorKey: "success.main" },
  warning: { Icon: WarningAmberRoundedIcon, colorKey: "warning.main" },
  error: { Icon: CancelRoundedIcon, colorKey: "error.main" },
  neutral: { Icon: HelpOutlineRoundedIcon, colorKey: "text.secondary" }
} as const;

export default function ResumeDecisionPanel({
                                              hasFit,
                                              fit,
                                              meta,
                                              inviteSent,
                                              canInvite,
                                              isSendingInvite,
                                              openInviteModal,
                                              candidateEmail,
                                              copyToClipboard,
                                              weakestRequirements
                                            }: Props) {
  const theme = useTheme();

  const fitPercent = hasFit ? clampPercent(fit) : 0;
  const tone = getTone(hasFit, fitPercent);

  const cfg = toneConfig[tone];
  const Icon = cfg.Icon;

  const accentColor = (() => {
    if (tone === "success") return theme.palette.success.main;
    if (tone === "warning") return theme.palette.warning.main;
    if (tone === "error") return theme.palette.error.main;
    return theme.palette.text.secondary;
  })();

  return (
    <Paper
      elevation={0}
      className="glass"
      sx={{
        p: 2,
        position: "sticky",
        top: { xs: 72, md: 88 }
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
      >
        <Stack>
          <Typography sx={{ fontWeight: 900 }}>Decyzja</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Dopasowanie + szybka akcja.
          </Typography>
        </Stack>

        <Chip
          size="small"
          icon={<Icon fontSize="small" />}
          label={meta.label}
          sx={{
            borderRadius: 999,
            bgcolor: "grey.100",
            fontWeight: 800,
            "& .MuiChip-icon": { color: cfg.colorKey }
          }}
        />
      </Stack>

      <Divider sx={{ my: 1.25 }} />

      <Stack direction="row" gap={1.25} alignItems="center">
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={fitPercent}
            size={80}
            thickness={5}
            sx={{ color: accentColor }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Stack alignItems="center" sx={{ lineHeight: 1 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                {hasFit ? `${fitPercent}%` : "—"}
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              position: "absolute",
              inset: -6,
              borderRadius: 999,
              border: "2px solid",
              borderColor: alpha(theme.palette.common.black, 0.08)
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 900, lineHeight: 1.15 }}>
            Wynik dopasowania
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Na podstawie danych z systemu
          </Typography>

          <LinearProgress
            variant="determinate"
            value={fitPercent}
            sx={{
              mt: 1,
              height: 8,
              borderRadius: 999,
              bgcolor: alpha(theme.palette.common.black, 0.06),
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                backgroundColor: hasFit ? accentColor : alpha(theme.palette.common.black, 0.18)
              }
            }}
          />
        </Box>
      </Stack>

      <Divider sx={{ my: 1.25 }} />

      <Button
        fullWidth
        variant="contained"
        color="warning"
        onClick={openInviteModal}
        disabled={!canInvite}
        startIcon={<SendRoundedIcon />}
      >
        {inviteSent ? "Kandydat został zaproszony na rozmowę" : "Zaproś na rozmowę"}
      </Button>

      <Paper elevation={0} className="section" sx={{ mt: 1.25, p: 1.25 }}>
        <Typography variant="caption" color="text.secondary">
          Szybkie kontakty
        </Typography>

        <Stack gap={0.75} sx={{ mt: 0.75 }}>
          <Stack direction="row" alignItems="center" gap={0.75}>
            <MailOutlineRoundedIcon fontSize="small" />

            <Typography
              variant="body2"
              sx={{
                color: SECONDARY_TEXT,
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {candidateEmail || "—"}
            </Typography>

            {candidateEmail ? (
              <Tooltip title="Kopiuj e-mail">
                <Button
                  size="small"
                  variant="text"
                  color="inherit"
                  onClick={() => copyToClipboard(candidateEmail, "E-mail")}
                  sx={{ minWidth: 36, borderRadius: 999 }}
                >
                  <ContentCopyRoundedIcon fontSize="small" />
                </Button>
              </Tooltip>
            ) : null}
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} className="glass-soft" sx={{ mt: 1.25, p: 1.25 }}>
        <Stack direction="row" alignItems="center" gap={0.75}>
          <Typography sx={{ fontWeight: 900 }}>Priorytety rozmowy</Typography>
          <Tooltip title="Najsłabsze elementy dopasowania (warto krótko potwierdzić).">
            <HelpOutlineRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </Tooltip>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Najsłabsze elementy dopasowania
        </Typography>

        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
          {weakestRequirements.length ? (
            weakestRequirements.map((item) => (
              <Chip
                key={item.label}
                size="small"
                label={`${item.label} • ${clampPercent(item.scorePercent)}%`}
                color="warning"
                variant="outlined"
                sx={{ borderRadius: 999, fontWeight: 800 }}
              />
            ))
          ) : (
            <Chip
              size="small"
              label="—"
              sx={{
                borderRadius: 999,
                bgcolor: "grey.100",
                fontWeight: 800
              }}
            />
          )}
        </Stack>
      </Paper>

      {isSendingInvite ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Wysyłanie…
        </Typography>
      ) : null}
    </Paper>
  );
}