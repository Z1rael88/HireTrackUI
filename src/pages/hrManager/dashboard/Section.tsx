import type { PropsWithChildren, ReactNode } from "react";
import { alpha } from "@mui/material/styles";
import { Button, Paper, Stack, Typography } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Link } from "react-router-dom";

import { COLORS } from "../../../style/ColorTheme";

type SectionProps = PropsWithChildren<{
  title: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
}>;

export default function Section({ title, actionLabel, actionTo, children, icon, rightSlot }: SectionProps) {
  const showActionButton = Boolean(actionLabel && actionTo);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        border: `1px solid ${COLORS.borderSoft}`,
        bgcolor: alpha(COLORS.surface, 0.94),
        color: COLORS.textPrimary,
        boxShadow: "0 6px 18px rgba(17,19,24,0.06)",
        backdropFilter: "blur(10px)"
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1.25}
        sx={{ mb: 1.25, minWidth: 0 }}
      >
        <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0, flex: "1 1 auto" }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 900, color: COLORS.textPrimary }} noWrap>
            {title}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1} sx={{ flex: "0 0 auto" }}>
          {rightSlot}

          {showActionButton && (
            <Button
              component={Link}
              to={actionTo!}
              size="small"
              variant="outlined"
              endIcon={<OpenInNewRoundedIcon />}
              sx={{
                fontWeight: 800,
                px: 1.5,
                borderColor: COLORS.borderSoft,
                color: COLORS.textPrimary,
                backgroundColor: alpha(COLORS.surface, 0.6),
                "&:hover": {
                  borderColor: COLORS.border,
                  backgroundColor: alpha(COLORS.black, 0.03)
                }
              }}
            >
              {actionLabel}
            </Button>
          )}
        </Stack>
      </Stack>

      {children}
    </Paper>
  );
}