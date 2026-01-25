import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";

import { COLORS } from "../../../../style/ColorTheme";

export type ResumePreview = {
  fullName: string;
  email?: string | null;
  location?: string | null;
  yearsOfExperience?: number | null;
  expectedSalary?: number | null;
};

type OfferApplyDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;
  cvName: string;
  resumePreview: ResumePreview | null;
};

export default function OfferApplyDialog({
                                           open,
                                           title,
                                           onClose,
                                           onSubmit,
                                           isSubmitting,
                                           cvName,
                                           resumePreview
                                         }: OfferApplyDialogProps) {
  const showExperience = (resumePreview?.yearsOfExperience ?? 0) > 0;
  const showSalary = (resumePreview?.expectedSalary ?? 0) > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: { xs: "calc(100% - 24px)", sm: "calc(100% - 32px)" },
            m: { xs: 1.5, sm: 2 }
          }
        }
      }}
    >
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.75, sm: 2 },
          borderBottom: `1px solid ${COLORS.divider}`,
          minWidth: 0
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 850,
            fontSize: { xs: 16, sm: 18 },
            minWidth: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: { xs: 2, sm: 1 },
            wordBreak: "break-word"
          }}
        >
          Aplikuj — {title}
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          borderColor: COLORS.divider,
          minWidth: 0,
          overflowY: "auto",
          flex: 1
        }}
      >
        <Stack gap={{ xs: 1.5, sm: 2 }} sx={{ minWidth: 0 }}>
          {resumePreview ? (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: 3,
                backgroundColor: alpha(COLORS.black, 0.03),
                minWidth: 0,
                overflow: "hidden"
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                gap={{ xs: 0.75, sm: 1 }}
                sx={{ minWidth: 0 }}
              >
                <Stack direction="row" gap={1} alignItems="center" sx={{ minWidth: 0 }}>
                  <PersonRoundedIcon fontSize="small" sx={{ color: COLORS.accent, flexShrink: 0 }} />
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 800, minWidth: 0 }}
                  >
                    {resumePreview.fullName}
                  </Typography>
                </Stack>

                {resumePreview.email ? (
                  <Typography variant="body2" noWrap sx={{ color: COLORS.textSecondary, minWidth: 0 }}>
                    {resumePreview.email}
                  </Typography>
                ) : null}
              </Stack>

              <Divider sx={{ my: 1, borderColor: COLORS.divider }} />

              <Stack direction="row" flexWrap="wrap" rowGap={0.75} columnGap={2} sx={{ minWidth: 0 }}>
                {resumePreview.location ? (
                  <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <PlaceRoundedIcon fontSize="small" sx={{ color: COLORS.accent, flexShrink: 0 }} />
                    <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                      {resumePreview.location}
                    </Typography>
                  </Stack>
                ) : null}

                {showExperience ? (
                  <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <WorkOutlineRoundedIcon fontSize="small" sx={{ color: COLORS.accent, flexShrink: 0 }} />
                    <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                      {resumePreview.yearsOfExperience} lat doświadczenia
                    </Typography>
                  </Stack>
                ) : null}

                {showSalary ? (
                  <Stack direction="row" gap={0.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <MonetizationOnRoundedIcon fontSize="small" sx={{ color: COLORS.accent, flexShrink: 0 }} />
                    <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                      {resumePreview.expectedSalary} PLN
                    </Typography>
                  </Stack>
                ) : null}
              </Stack>
            </Paper>
          ) : null}

          {cvName ? (
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                px: { xs: 1.25, sm: 1.5 },
                py: 1,
                borderRadius: 3,
                backgroundColor: alpha(COLORS.black, 0.04),
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 1,
                minWidth: 0,
                flexWrap: { xs: "wrap", sm: "nowrap" }
              }}
            >
              <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                CV użyte w tej aplikacji
              </Typography>

              <Typography variant="body2" noWrap sx={{ fontWeight: 800, minWidth: 0 }}>
                {cvName}
              </Typography>
            </Paper>
          ) : null}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: 1.25, sm: 1.5 },
          pb: { xs: "calc(12px + env(safe-area-inset-bottom, 0px))", sm: 2 },
          borderTop: `1px solid ${COLORS.divider}`,
          gap: 1,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          justifyContent: "space-between"
        }}
      >
        <Button onClick={onClose} sx={{ minHeight: 40 }}>
          Anuluj
        </Button>

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting}
          startIcon={<SendRoundedIcon />}
          sx={{ minWidth: { xs: "100%", sm: 180 }, minHeight: 44, fontWeight: 800 }}
        >
          {isSubmitting ? "Wysyłanie…" : "Wyślij aplikację"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}