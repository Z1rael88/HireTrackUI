import { Box, Link, Typography } from "@mui/material";
import { COLORS } from "../../style/ColorTheme";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2.5,
        textAlign: "center",
        backgroundColor: COLORS.black,
        color: COLORS.white
      }}
    >
      <Typography variant="body2" sx={{ opacity: 0.85 }}>
        © {year} HireTrack |{" "}
        <Link href={"/privacy"} color="inherit" underline="always" sx={{ opacity: 0.9 }}>
          Polityka prywatności
        </Link>
      </Typography>
    </Box>
  );
}