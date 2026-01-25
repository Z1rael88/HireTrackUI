import { motion } from "framer-motion";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 280, sm: 320, md: 400 },
        backgroundImage: "url(/images/banner.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden"
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.55)" }} />

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ position: "relative", zIndex: 1, px: 2 }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "common.white",
            textShadow: "0 10px 28px rgba(0,0,0,0.45)"
          }}
        >
          Znajdź swoją wymarzoną pracę
        </Typography>

        <Button variant="contained" component={Link} to="/authUser" sx={{ mt: { xs: 2.5, md: 4 } }}>
          Rozpocznij teraz
        </Button>
      </Box>
    </Box>
  );
}