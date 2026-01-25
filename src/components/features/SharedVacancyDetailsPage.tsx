import { useSelector } from "react-redux";
import { Box, Container } from "@mui/material";

import type { RootState } from "../../store/store";
import { Roles } from "../../types/enums";

import HrSidebar from "../../pages/hrManager/HrSidebar";
import HrVacancyDetailsPage from "../../pages/hrManager/vacancies/HrVacancyDetailsPage";
import PublicVacancyDetailsPage from "../../pages/hrManager/vacancies/PublicVacancyDetailsPage";
import { COLORS } from "../../style/ColorTheme";

export default function SharedVacancyDetailsPage() {
  const { isAuth, role } = useSelector((state: RootState) => state.user);
  const isHr = isAuth && role === Roles.HrManager;

  if (!isHr) return <PublicVacancyDetailsPage />;

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

          <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
            <HrVacancyDetailsPage />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}