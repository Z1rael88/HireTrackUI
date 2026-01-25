import { Avatar, Box, Chip, Divider, Stack, Typography } from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AddIcon from "@mui/icons-material/Add";
import { alpha } from "@mui/material/styles";

import { COLORS } from "../../style/ColorTheme";
import type { Props } from "../../types/profileMenu.ts";
import { MenuLogout, MenuTile, getUserInitials } from "./ProfileMenuParts";

export default function ProfileMenuHR({
                                        user,
                                        onOpenHrJobs,
                                        onCreateJob,
                                        onLogout,
                                        onClose
                                      }: Props) {
  const initials = getUserInitials(user);

  const handleCreate = () => {
    (onCreateJob ?? onOpenHrJobs)?.();
    onClose();
  };

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

            <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ mt: 0.75, flexWrap: "wrap" }}>
              {user.company && (
                <Chip
                  size="small"
                  label={user.company}
                  sx={{
                    fontWeight: 700,
                    bgcolor: alpha(COLORS.black, 0.04),
                    border: `1px solid ${COLORS.borderSoft}`,
                    color: COLORS.textPrimary
                  }}
                />
              )}
              <Chip
                size="small"
                label="HR Manager"
                sx={{
                  fontWeight: 700,
                  bgcolor: alpha(COLORS.accent, 0.18),
                  border: `1px solid ${alpha(COLORS.accent, 0.3)}`,
                  color: COLORS.textPrimary
                }}
              />
            </Stack>
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
          icon={AddIcon}
          label="Nowa oferta"
          subtitle="Utwórz ogłoszenie"
          autoFocus
          onClick={handleCreate}
        />
        <MenuTile
          icon={WorkOutlineIcon}
          label="Oferty"
          subtitle="Zarządzaj ogłoszeniami"
          onClick={() => {
            onOpenHrJobs?.();
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