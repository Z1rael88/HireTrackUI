import { MouseEvent, useState } from "react";
import { Avatar, Badge, IconButton, Popover, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";

import ProfileMenuCandidate from "./ProfileMenuCandidate";
import ProfileMenuHR from "./ProfileMenuHR";
import type { ProfileMenu } from "../../types/profileMenu.ts";
import { Roles } from "../../types/enums";
import { COLORS } from "../../style/ColorTheme";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

export default function ProfileMenu(props: ProfileMenu) {
  const { user, size = 34, role } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const isOpen = Boolean(anchorEl);
  const initials = user.initials || getInitials(user.name);
  const tooltipTitle = user.company ? `${user.name} — ${user.company}` : user.name;
  const showHrMenu = role === Roles.HrManager;

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title={tooltipTitle}>
        <IconButton onClick={handleOpen} size="small" sx={{ ml: 1 }}>
          <Badge
            color="secondary"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: COLORS.accent,
                color: COLORS.black,
                boxShadow: "none"
              }
            }}
          >
            <Avatar
              sx={{
                width: size,
                height: size,
                bgcolor: alpha(COLORS.accent, 0.22),
                color: COLORS.textPrimary,
                border: `1px solid ${alpha(COLORS.accent, 0.35)}`,
                fontWeight: 800
              }}
            >
              {initials}
            </Avatar>
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
        disableScrollLock
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 360,
              maxWidth: "calc(100vw - 24px)"
            }
          }
        }}
      >
        {showHrMenu ? (
          <ProfileMenuHR {...props} onClose={handleClose} />
        ) : (
          <ProfileMenuCandidate {...props} onClose={handleClose} />
        )}
      </Popover>
    </>
  );
}
