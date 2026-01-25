import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";

import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";

const HEADER_OFFSET = 64;
const MOBILE_NAV_H = 64;

type NavItemConfig = {
  to: string;
  icon: ReactNode;
  label: string;
};

type NavItemProps = NavItemConfig & {
  isActive: boolean;
  compact?: boolean;
};

function NavItem({ to, icon, label, isActive, compact }: NavItemProps) {
  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={isActive}
      sx={{
        position: "relative",
        borderRadius: 2,
        mb: compact ? 0 : 0.5,
        px: compact ? 1.1 : 1.25,
        py: compact ? 1 : 1.1,
        minWidth: 0,
        justifyContent: compact ? "center" : "flex-start",
        flexDirection: compact ? "column" : "row",
        gap: compact ? 0.35 : 0
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: compact ? 0 : 36,
          color: isActive ? "primary.main" : "text.secondary",
          "& svg": { fontSize: 22 }
        }}
      >
        {icon}
      </ListItemIcon>

      {compact ? (
        <Typography variant="caption" sx={{ fontWeight: 700, color: isActive ? "primary.main" : "text.secondary" }}>
          {label}
        </Typography>
      ) : (
        <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: 700 } } }} />
      )}
    </ListItemButton>
  );
}

const navItems: NavItemConfig[] = [
  { to: "/candidate/dashboard", icon: <DashboardRoundedIcon />, label: "Dashboard" },
  { to: "/candidate/offers", icon: <WorkRoundedIcon />, label: "Oferty" },
  { to: "/candidate/applied", icon: <AssignmentTurnedInRoundedIcon />, label: "Aplikowane" },
  { to: "/candidate/resume", icon: <DescriptionRoundedIcon />, label: "Resume" }
];

export default function CandidateSidebar() {
  const { pathname } = useLocation();

  return (
    <>
      <Paper
        elevation={0}
        className="section"
        sx={{
          width: 260,
          display: { xs: "none", md: "flex" },
          position: "sticky",
          top: HEADER_OFFSET,
          height: `calc(100vh - ${HEADER_OFFSET}px)`,
          borderRadius: 3,
          px: 2,
          py: 2
        }}
      >
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <Box sx={{ mb: 1.25 }}>
            <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>Kandydat</Typography>
            <Typography variant="body2" color="text.secondary">
              Panel
            </Typography>
          </Box>

          <List sx={{ px: 0, mt: 1, width: "100%" }}>
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} isActive={pathname === item.to} />
            ))}
          </List>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        className="glass"
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1250,
          borderTop: 1,
          borderColor: "divider"
        }}
      >
        <Box
          sx={{
            height: MOBILE_NAV_H,
            px: 1,
            pb: "env(safe-area-inset-bottom)",
            display: "grid",
            alignItems: "center"
          }}
        >
          <List
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0.5,
              px: 0,
              m: 0
            }}
          >
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} compact isActive={pathname === item.to} />
            ))}
          </List>
        </Box>
      </Paper>
    </>
  );
}