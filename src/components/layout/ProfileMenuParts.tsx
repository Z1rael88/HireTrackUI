import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { alpha } from "@mui/material/styles";

import { COLORS } from "../../style/ColorTheme";
import type { Props, TileProps } from "../../types/profileMenu.ts";

export function getUserInitials(user: Props["user"]) {
  if (user.initials) return user.initials;

  const parts = user.name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

export function MenuTile({ icon: Icon, label, subtitle, onClick, autoFocus }: TileProps) {
  return (
    <ButtonBase
      onClick={onClick}
      focusRipple
      autoFocus={autoFocus}
      sx={{
        flex: "1 1 calc(50% - 8px)",
        minWidth: 0,
        alignSelf: "stretch",
        borderRadius: 3,
        p: 1.25,
        minHeight: 66,
        textAlign: "left",
        border: `1px solid ${COLORS.borderSoft}`,
        backgroundColor: alpha(COLORS.surface, 0.92),
        transition: "background-color .15s ease, border-color .15s ease, transform .12s ease",
        "&:hover": {
          backgroundColor: alpha(COLORS.black, 0.03),
          borderColor: COLORS.border,
          transform: "translateY(-1px)"
        }
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: "100%" }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            border: `1px solid ${COLORS.borderSoft}`,
            backgroundColor: alpha(COLORS.accent, 0.16),
            color: COLORS.textPrimary,
            flexShrink: 0
          }}
        >
          <Icon fontSize="small" />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 15 }} noWrap>
            {label}
          </Typography>

          {subtitle && (
            <Typography variant="body2" sx={{ color: COLORS.textSecondary, mt: 0.25 }} noWrap>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </ButtonBase>
  );
}

export function MenuLogout({ onClick }: { onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        borderRadius: 999,
        border: `1px solid ${COLORS.borderSoft}`,
        py: 1.1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        backgroundColor: alpha(COLORS.surface, 0.92),
        transition: "background-color .15s ease, border-color .15s ease",
        "&:hover": {
          backgroundColor: alpha(COLORS.black, 0.03),
          borderColor: COLORS.border
        }
      }}
    >
      <LogoutIcon fontSize="small" />
      <Typography sx={{ fontWeight: 700 }}>Wyloguj się</Typography>
    </ButtonBase>
  );
}