import DescriptionIcon from "@mui/icons-material/Description";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Card, Container, Typography } from "@mui/material";

const benefits = [
  {
    icon: <SearchIcon color="primary" sx={{ fontSize: 50 }} />,
    title: "Precyzyjne dopasowanie",
    desc: "Szybkie wyszukiwanie ofert zgodnych z Twoimi umiejętnościami."
  },
  {
    icon: <DescriptionIcon color="primary" sx={{ fontSize: 50 }} />,
    title: "Kreator CV",
    desc: "Tworzenie CV w kilka minut, bez stresu i skomplikowanych narzędzi."
  },
  {
    icon: <HandshakeIcon color="primary" sx={{ fontSize: 50 }} />,
    title: "Wsparcie ekspertów",
    desc: "Porady i wskazówki, które zwiększą Twoje szanse na rynku pracy."
  }
];

export default function Benefits() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Dlaczego warto wybrać HireTrack?
      </Typography>

      <Typography color="text.secondary" sx={{ maxWidth: 720, mx: "auto", mb: { xs: 4, md: 5 } }}>
        Nasza platforma oferuje inteligentne rozwiązania, które pomagają zarówno kandydatom, jak i rekruterom.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
          gap: { xs: 2, md: 3 },
          maxWidth: 1180,
          mx: "auto"
        }}
      >
        {benefits.map((feature) => (
          <Card key={feature.title} variant="outlined"
                sx={{ p: { xs: 3, md: 4 }, textAlign: "center", minHeight: 260 }}>
            <Box sx={{ mb: 2.5 }}>{feature.icon}</Box>
            <Typography variant="h6" gutterBottom>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.desc}
            </Typography>
          </Card>
        ))}
      </Box>
    </Container>
  );
}