import { Avatar, Box, Chip, Divider, Stack, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import { alpha } from "@mui/material/styles";
import { COLORS } from "../../style/ColorTheme";
import type { Props } from "../../types/profileMenu.ts";
import { MenuLogout, MenuTile, getUserInitials } from "./ProfileMenuParts";

export default function ProfileMenuCandidate({
                                               user,
                                               onOpenProfile,
                                               onOpenCV,
                                               onLogout,
                                               onClose
                                             }: Props) {
  const initials = getUserInitials(user);

  return (
    <Box>
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.75,
          backgroundImage: `linear-gradient(180deg, ${alpha(COLORS.accent, 0.18)} 0%, ${alpha(
            COLORS.surface,
            0.92
          )} 90%)`,
          borderBottom: `1px solid ${COLORS.borderSoft}`
        }}
      >
        <Stack alignItems="center" spacing={1.25}>
          <Avatar
            sx={{
              width: 58,
              height: 58,
              fontSize: 18,
              fontWeight: 800,
              bgcolor: alpha(COLORS.accent, 0.22),
              color: COLORS.textPrimary,
              border: `1px solid ${alpha(COLORS.accent, 0.35)}`
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ textAlign: "center", maxWidth: "100%", overflow: "hidden" }}>
            <Typography sx={{ fontWeight: 900 }} noWrap>
              {user.name}
            </Typography>

            {user.email && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            )}

            <Chip
              size="small"
              label="Kandydat"
              sx={{
                mt: 0.75,
                fontWeight: 700,
                bgcolor: alpha(COLORS.accent, 0.18),
                border: `1px solid ${alpha(COLORS.accent, 0.3)}`,
                color: COLORS.textPrimary
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 0.75, sm: 1 },
          p: 1
        }}
      >
        <MenuTile
          icon={PersonOutlineIcon}
          label="Profil"
          subtitle="Dane i preferencje"
          autoFocus
          onClick={() => {
            onOpenProfile?.();
            onClose();
          }}
        />
        <MenuTile
          icon={DescriptionIcon}
          label="Moje CV"
          subtitle="Podgląd i eksport"
          onClick={() => {
            onOpenCV?.();
            onClose();
          }}
        />
      </Box>

      <Divider />

      <Box sx={{ px: 1, py: 1 }}>
        <MenuLogout
          onClick={() => {
            onLogout?.();
            onClose();
          }}
        />
      </Box>
    </Box>
  );
}