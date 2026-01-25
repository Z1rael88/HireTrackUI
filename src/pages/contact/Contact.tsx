import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import RoomIcon from "@mui/icons-material/Room";
import { Box, Button, Container, Link, Paper, Stack, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: "90vh" }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ textAlign: "center" }}
      >
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Skontaktuj się z nami!
        </Typography>
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          mb: 5,
          position: "relative"
        }}
      >
        <Box
          component="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2447.6530334962117!2d21.031625977123362!3d52.15881937196874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47193291027e15a1%3A0x57a820cc1900e8b!2sStok%C5%82osy%203%2C%2002-787%20Warszawa!5e0!3m2!1spl!2spl!4v1742385275340!5m2!1spl!2spl"
          sx={{ display: "block", width: "100%", height: 350, border: 0 }}
          allowFullScreen
          loading="lazy"
        />

        <Box
          className="glass"
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: 999,
            overflow: "hidden"
          }}
        >
          <Button
            href="https://maps.app.goo.gl/UP6ZVZtVbPGJmrx29"
            target="_blank"
            rel="noreferrer"
            variant="contained"
            startIcon={<RoomIcon />}
            sx={{ borderRadius: 999, px: 3, py: 1.25, boxShadow: "none" }}
          >
            Otwórz w Google Maps
          </Button>
        </Box>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} gap={2} alignItems="stretch" sx={{ mb: 6 }}>
        <Paper elevation={0} className="section" sx={{ p: 3, borderRadius: 3, textAlign: "center", flex: 1 }}>
          <LocationOnIcon sx={{ fontSize: 40, mb: 1.5 }} color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Adres
          </Typography>
          <Typography color="text.secondary">Stokłosy 3, 02-787 Warszawa</Typography>
        </Paper>

        <Paper elevation={0} className="section" sx={{ p: 3, borderRadius: 3, textAlign: "center", flex: 1 }}>
          <MailOutlineIcon sx={{ fontSize: 40, mb: 1.5 }} color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            E-mail
          </Typography>
          <Link href="mailto:kontakt.hiretrack@gmail.com" underline="hover" color="text.secondary"
                sx={{ fontWeight: 600 }}>
            kontakt.hiretrack@gmail.com
          </Link>
        </Paper>

        <Paper elevation={0} className="section" sx={{ p: 3, borderRadius: 3, textAlign: "center", flex: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 40, mb: 1.5 }} color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Godziny pracy
          </Typography>
          <Typography color="text.secondary">Pon-Pt: 10:00 - 16:00</Typography>
        </Paper>
      </Stack>
    </Container>
  );
}