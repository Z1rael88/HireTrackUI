import { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store.ts";

import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./style/ColorTheme";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ScrollTopButton from "./components/features/ScrollTopButton";
import ContactFab from "./components/features/ContactFab";

import MainPage from "./pages/mainPage/MainPage";
import Privacy from "./pages/privacyPolicy/Privacy";
import Contact from "./pages/contact/Contact";
import AuthSlider from "./pages/authUser/AuthSlider";

import CandidateLayout from "./pages/candidate/CandidateLayout";
import CandidateDashboardPage from "./pages/candidate/dashboard/CandidateDashboardPage";
import OffersPage from "./pages/candidate/offers/OffersPage";
import ResumePage from "./pages/candidate/resume/ResumePage";
import OfferDetailsPage from "./pages/candidate/offers/OfferDetailsPage";
import AppliedOffersPage from "./pages/candidate/applied/AppliedOffersPage";

import HrLayout from "./pages/hrManager/HrLayout.tsx";
import HrDashboardPage from "./pages/hrManager/dashboard/HrDashboardPage";
import HrVacanciesPage from "./pages/hrManager/vacancies/HrVacanciesPage";
import HrCreateVacancyPage from "./pages/hrManager/vacancies/create/HrCreateVacancyPage";
import HrRecruitmentPage from "./pages/hrManager/recruitment/HrRecruitmentPage.tsx";
import HrVacanciesArchivePage from "./pages/hrManager/vacancies/HrVacanciesArchivePage";
import HrEditVacancyPage from "./pages/hrManager/vacancies/HrEditVacancyPage.tsx";
import HrVacancyCandidatePage from "./pages/hrManager/vacancies/HrVacancyCandidatePage.tsx";

import { Roles } from "./types/enums.ts";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SharedVacancyDetailsPage from "./components/features/SharedVacancyDetailsPage.tsx";
import HrResumeStatisticsPage from "./pages/hrManager/statistics/resumeStatistics/HrResumeStatisticsPage.tsx";
import HrVacancyStatisticsPage from "./pages/hrManager/statistics/vacancyStatistics/HrVacancyStatisticsPage.tsx";
import HrStatisticsPage from "./pages/hrManager/statistics/HrStatisticsPage.tsx";

function RoleGuard({ role, children }: { role: Roles; children: ReactNode }) {
  const { isAuth, role: userRole } = useSelector((s: RootState) => s.user);
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/authUser" state={{ mode: "login", redirect: location.pathname }} replace />;
  }
  if (userRole !== role) {
    return <Navigate to={userRole === Roles.HrManager ? "/hr" : "/candidate"} replace />;
  }
  return <>{children}</>;
}

function HomeGate() {
  const { isAuth, role } = useSelector((s: RootState) => s.user);
  if (!isAuth) return <MainPage />;
  return <Navigate to={role === Roles.HrManager ? "/hr" : "/candidate"} replace />;
}

function AuthFormGate() {
  const { isAuth, role } = useSelector((s: RootState) => s.user);
  if (isAuth) return <Navigate to={role === Roles.HrManager ? "/hr" : "/candidate"} replace />;
  return <AuthSlider />;
}

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <ScrollTopButton />
          <Header />

          <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Routes>
              <Route path="/" element={<HomeGate />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/authUser" element={<AuthFormGate />} />
              <Route path="/hr/vacancies/:id" element={<SharedVacancyDetailsPage />} />
              <Route
                path="/candidate/*"
                element={
                  <RoleGuard role={Roles.Candidate}>
                    <CandidateLayout />
                  </RoleGuard>
                }
              >
                <Route index element={<CandidateDashboardPage />} />
                <Route path="offers" element={<OffersPage />} />
                <Route path="offers/:id" element={<OfferDetailsPage />} />
                <Route path="resume" element={<ResumePage />} />
                <Route path="applied" element={<AppliedOffersPage />} />
                <Route path="*" element={<Navigate to="/candidate" replace />} />
              </Route>
              <Route
                path="/hr/*"
                element={
                  <RoleGuard role={Roles.HrManager}>
                    <HrLayout />
                  </RoleGuard>
                }
              >
                <Route index element={<HrDashboardPage />} />
                <Route path="vacancies" element={<HrVacanciesPage />} />
                <Route path="vacancies/:vacancyId/candidates/:resumeId" element={<HrVacancyCandidatePage />} />
                <Route path="vacancies/new" element={<HrCreateVacancyPage />} />
                <Route path="vacancies/archive" element={<HrVacanciesArchivePage />} />
                <Route path="vacancies/:vacancyId/edit" element={<HrEditVacancyPage />} />
                <Route path="recruitment" element={<HrRecruitmentPage />} />
                <Route path="statistics" element={<HrStatisticsPage />} />
                <Route path="statistics/vacancy/:vacancyId/resume/:resumeId" element={<HrResumeStatisticsPage />} />
                <Route path="statistics/vacancy/:vacancyId" element={<HrVacancyStatisticsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ContactFab />
          </Box>

          <Footer />
        </Box>
      </BrowserRouter>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar toastClassName="custom-toast" />
    </ThemeProvider>
  );
}