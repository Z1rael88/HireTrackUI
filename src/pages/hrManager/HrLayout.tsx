import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import ArchiveIcon from "@mui/icons-material/Archive";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import AnalyticsIcon from "@mui/icons-material/Analytics";

import HrSidebar from "./HrSidebar";
import { COLORS } from "../../style/ColorTheme";

const BOTTOM_NAV_HEIGHT = 72;

function isActivePath(currentPath: string, targetPath: string) {
  if (targetPath === "/hr") {
    return currentPath === "/hr" || currentPath === "/hr/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

type BottomItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const bottomItems: BottomItem[] = [
  { to: "/hr", label: "Dashboard", icon: <DashboardRoundedIcon /> },
  { to: "/hr/vacancies", label: "Oferty", icon: <WorkRoundedIcon /> },
  { to: "/hr/vacancies/archive", label: "Archiwum", icon: <ArchiveIcon /> },
  { to: "/hr/recruitment", label: "Proces", icon: <InsightsRoundedIcon /> },
  { to: "/hr/statistics", label: "Stats", icon: <AnalyticsIcon /> }
];

export default function HrLayout() {
  const { pathname } = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: COLORS.bg, color: "text.primary" }}>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 1.5, sm: 2, md: 3 }
        }}
      >
        <Box sx={{ display: "flex", gap: { xs: 2, md: 3 } }}>
          <Box sx={{ flexShrink: 0, display: { xs: "none", md: "block" } }}>
            <HrSidebar />
          </Box>

          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              pb: { xs: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`, md: 0 }
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Container>

      <Paper
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          height: BOTTOM_NAV_HEIGHT,
          borderTop: `1px solid ${COLORS.borderSoft}`,
          bgcolor: alpha(COLORS.surface, 0.96)
        }}
      >
        <Stack
          direction="row"
          alignItems="stretch"
          sx={{ height: "100%" }}
        >
          {bottomItems.map((item) => {
            const active = isActivePath(pathname, item.to);

            return (
              <Box
                key={item.to}
                component={Link}
                to={item.to}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  textDecoration: "none",
                  color: active ? COLORS.textPrimary : COLORS.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={0.25}
                  sx={{
                    width: "100%",
                    py: 1,
                    borderRadius: 2,
                    mx: 0.5,
                    bgcolor: active ? alpha(COLORS.accent, 0.12) : "transparent"
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      color: active ? "warning.main" : COLORS.textSecondary
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: active ? 800 : 700,
                      lineHeight: 1,
                      textAlign: "center",
                      px: 0.5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {item.label}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
}