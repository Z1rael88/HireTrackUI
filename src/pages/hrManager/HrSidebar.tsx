import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ArchiveIcon from "@mui/icons-material/Archive";
import AnalyticsIcon from "@mui/icons-material/Analytics";

import { COLORS } from "../../style/ColorTheme";

type NavItem = {
  to: string;
  icon: ReactNode;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/hr", icon: <DashboardRoundedIcon />, label: "Dashboard" },
  { to: "/hr/vacancies", icon: <WorkRoundedIcon />, label: "Oferty" },
  { to: "/hr/vacancies/archive", icon: <ArchiveIcon />, label: "Archiwum" },
  { to: "/hr/recruitment", icon: <InsightsRoundedIcon />, label: "Proces rekrutacyjny" },
  { to: "/hr/statistics", icon: <AnalyticsIcon />, label: "Statystyka" }
];

const isActivePath = (currentPath: string, targetPath: string) =>
  targetPath === "/hr"
    ? currentPath === "/hr" || currentPath === "/hr/"
    : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);

export default function HrSidebar() {
  const { pathname } = useLocation();

  return (
    <Paper
      elevation={0}
      sx={{
        width: 260,
        display: { xs: "none", md: "flex" },
        position: "sticky",
        top: 64,
        height: "calc(100vh - 64px)",
        bgcolor: alpha(COLORS.surface, 0.94),
        border: `1px solid ${COLORS.borderSoft}`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        px: 1.5,
        py: 2
      }}
    >
      <List sx={{ px: 0, mt: 0, width: "100%" }}>
        {NAV_ITEMS.map(({ to, icon, label }) => {
          const active = isActivePath(pathname, to);

          return (
            <ListItemButton
              key={to}
              component={Link}
              to={to}
              selected={active}
              sx={{
                position: "relative",
                mb: 0.5,
                px: 1.25,
                borderRadius: 1.25,
                "&.Mui-selected": {
                  bgcolor: alpha(COLORS.accent, 0.12),
                  "&::before": {
                    content: "\"\"",
                    position: "absolute",
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    borderRadius: 2,
                    bgcolor: "warning.main"
                  }
                },
                "&:hover": { bgcolor: alpha(COLORS.black, 0.03) }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "warning.main" }}>{icon}</ListItemIcon>

              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    sx: { color: COLORS.textPrimary, fontWeight: 700 }
                  }
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
}