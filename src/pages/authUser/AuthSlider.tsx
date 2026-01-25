import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { alpha } from "@mui/material/styles";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

import SignIn from "../../components/authUserForms/SignIn";
import SignUp from "../../components/authUserForms/SignUp";
import type { RootState } from "../../store/store";
import { COLORS } from "../../style/ColorTheme";

export default function AuthSlider() {
  const isAuth = useSelector((state: RootState) => state.user.isAuth);
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    if (isAuth) navigate("/", { replace: true });
  }, [isAuth, navigate]);

  return (
    <Container
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 2, sm: 3, md: 6 }
      }}
    >
      <Box
        sx={{
          width: "min(1200px, 100%)",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          border: `1px solid ${alpha(COLORS.black, 0.18)}`,
          backgroundImage: "url(/images/backgroundAuth.png)",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            minHeight: { xs: "auto", md: 700 }
          }}
        >
          <Box
            sx={{
              position: "relative",
              p: { xs: 2, sm: 3 },
              backgroundColor: alpha(COLORS.surface, 0.92),
              backdropFilter: "blur(10px)",
              borderRight: { xs: "none", md: `1px solid ${alpha(COLORS.black, 0.18)}` },
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Box
              component={motion.div}
              key={isSignIn ? "signin" : "signup"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: 420,
                  borderRadius: 4,
                  p: { xs: 2, sm: 2.5 },
                  backgroundColor: alpha(COLORS.surface, 0.9),
                  border: `1px solid ${alpha(COLORS.black, 0.14)}`
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, textAlign: "center" }}>
                  {isSignIn ? "Zaloguj się" : "Utwórz nowe konto"}
                </Typography>

                {isSignIn ? (
                  <SignIn />
                ) : (
                  <SignUp
                    onSuccess={() => {
                      toast.success("Rejestracja udana. Zaloguj się.");
                      setIsSignIn(true);
                    }}
                  />
                )}

                <Button
                  variant="text"
                  onClick={() => setIsSignIn((v) => !v)}
                  sx={{ mt: 2, width: "100%", fontWeight: 800, display: { xs: "inline-flex", md: "none" } }}
                >
                  {isSignIn ? "Nie masz konta? Zarejestruj się" : "Masz konto? Zaloguj się"}
                </Button>
              </Paper>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: "block", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: COLORS.white,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 3, sm: 4, md: 0 },
              background: `linear-gradient(180deg, ${alpha(COLORS.black, 0.55)} 0%, ${alpha(
                COLORS.black,
                0.78
              )} 100%)`
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
              <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 34 }, fontWeight: 900, mb: 1.5 }}>
                {isSignIn ? "Cześć! Miło Cię widzieć!" : "Witamy ponownie!"}
              </Typography>

              <Typography sx={{ opacity: 0.9, mb: 3, fontSize: { xs: 14.5, sm: 15.5, md: 16 } }}>
                {isSignIn
                  ? "Wprowadź swoje dane osobowe i rozpocznij podróż z nami!"
                  : "Aby pozostać z nami w kontakcie, zaloguj się za pomocą swoich danych osobowych."}
              </Typography>

              <Button
                variant="outlined"
                onClick={() => setIsSignIn((v) => !v)}
                sx={{
                  fontWeight: 900,
                  px: 3,
                  py: 1.1,
                  color: COLORS.white,
                  borderColor: alpha(COLORS.white, 0.65),
                  backgroundColor: alpha(COLORS.white, 0.06),
                  "&:hover": { borderColor: COLORS.white, backgroundColor: alpha(COLORS.white, 0.12) },
                  display: { xs: "none", md: "inline-flex" }
                }}
              >
                {isSignIn ? "ZAREJESTRUJ SIĘ" : "ZALOGUJ SIĘ"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}