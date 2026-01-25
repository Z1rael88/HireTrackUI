import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import LoginRounded from "@mui/icons-material/LoginRounded";

import type { RootState } from "../../store/store.ts";
import { logout } from "../../store/userSlice";
import { Roles } from "../../types/enums";
import ProfileMenu from "../layout/ProfileMenu";
import { COLORS } from "../../style/ColorTheme";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, user, role: storedRole } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    toast.success("Zostałeś wylogowany!");
    dispatch(logout());
    navigate("/");
  };

  const fullName = `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Użytkownik";
  const role = storedRole === Roles.HrManager ? Roles.HrManager : Roles.Candidate;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: COLORS.black,
        color: COLORS.white,
        boxShadow: "none",
        borderBottom: `1px solid ${alpha(COLORS.white, 0.1)}`
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2, minHeight: { xs: 56, sm: 64 } }}>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            textDecoration: "none",
            fontWeight: 800,
            letterSpacing: 0.2,
            color: COLORS.accent,
            "&:hover": { color: COLORS.accentHover }
          }}
        >
          HireTrack
        </Typography>

        <Box>
          {isAuth ? (
            <ProfileMenu
              role={role}
              user={{ name: fullName, email: user?.email ?? undefined, company: undefined }}
              onNavigate={() => navigate("/contact")}
              onLogout={handleLogout}
              onOpenProfile={() => navigate("/")}
              onOpenCV={() => navigate("/candidate/resume")}
              onOpenSettings={() => navigate("/candidate/settings")}
              onOpenHrJobs={() => navigate("/hr/vacancies")}
              onCreateJob={() => navigate("/hr/vacancies/new")}
            />
          ) : (
            <Button
              variant="outlined"
              startIcon={<LoginRounded />}
              component={Link}
              to="/authUser"
              state={{ mode: "login" }}
              sx={{
                px: 1.75,
                color: COLORS.white,
                borderColor: alpha(COLORS.white, 0.22),
                "&:hover": {
                  borderColor: alpha(COLORS.white, 0.36),
                  backgroundColor: alpha(COLORS.white, 0.06)
                }
              }}
            >
              Zaloguj
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}