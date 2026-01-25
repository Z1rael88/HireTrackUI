import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import { alpha } from "@mui/material/styles";

import { COLORS } from "../../../style/ColorTheme";

type ActionItemProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  to: string;
};

export default function QuickActions() {
  return (
    <Paper elevation={0} className="section" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack gap={2} sx={{ minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
          Szybkie akcje
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={1.5}
          alignItems="stretch"
          sx={{ minWidth: 0 }}
        >
          <ActionItem
            title="Dodaj lub zaktualizuj CV"
            subtitle="Zwiększ dopasowanie ofert"
            icon={<UploadRoundedIcon />}
            to="/candidate/resume"
          />

          <ActionItem
            title="Znajdź dopasowane oferty"
            subtitle="Na podstawie Twojego profilu"
            icon={<SearchRoundedIcon />}
            to="/candidate/offers"
          />

          <ActionItem
            title="Zobacz aplikacje"
            subtitle="Status Twoich zgłoszeń"
            icon={<RateReviewRoundedIcon />}
            to="/candidate/applied"
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

function ActionItem({ title, subtitle, icon, to }: ActionItemProps) {
  return (
    <Box
      sx={{
        flex: { md: 1 },
        p: 1.75,
        borderRadius: 3,
        backgroundColor: alpha(COLORS.black, 0.03),
        border: `1px solid ${COLORS.borderSoft}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(COLORS.accent, 0.22),
            border: `1px solid ${alpha(COLORS.accent, 0.35)}`,
            color: COLORS.textPrimary,
            flexShrink: 0
          }}
        >
          {icon}
        </Box>

        <Stack sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: COLORS.textPrimary,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: COLORS.textSecondary,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {subtitle}
          </Typography>
        </Stack>
      </Stack>

      <Button component={Link} to={to} fullWidth variant="contained" sx={{ mt: 1 }}>
        Przejdź
      </Button>
    </Box>
  );
}