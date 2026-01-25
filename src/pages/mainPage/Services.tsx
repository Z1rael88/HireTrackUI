import { motion } from "framer-motion";
import { Box, Card, Container, Divider, Typography } from "@mui/material";

export default function Services() {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "start"
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h4">O nas</Typography>
            <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
              W HireTrack odgrywamy kluczową rolę w kształtowaniu Twojej kariery, pomagając znaleźć idealne miejsce
              pracy. Nasza platforma łączy kandydatów z najlepszymi firmami i rekruterami, sprawiając, że proces
              rekrutacji staje się prostszy.
            </Typography>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h4">Nasza misja</Typography>
            <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
              Wspieramy kandydatów w procesie rekrutacji, dostarczając inteligentne narzędzia do wyszukiwania ofert
              pracy i kontaktu z pracodawcami. Pomagamy firmom znaleźć najlepszych specjalistów w oparciu o
              zaawansowane algorytmy dopasowania.
            </Typography>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" gutterBottom>
            Usługi w HireTrack
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 900, mx: "auto", mb: { xs: 4, md: 5 } }}>
            Oferujemy nowoczesne narzędzia dla kandydatów i pracodawców, usprawniając proces rekrutacji.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(320px, 520px) auto minmax(320px, 520px)" },
            gap: { xs: 3, md: 4 },
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            maxWidth: 1180
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <Card variant="outlined" sx={{ overflow: "hidden" }}>
              <Box
                component="img"
                src="/images/tailored-job.png"
                alt="Tailored Job Searches"
                sx={{ display: "block", width: "100%", height: { xs: 220, sm: 280, md: 320 }, objectFit: "cover" }}
              />
            </Card>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              1
            </Typography>
            <Divider orientation="vertical" flexItem
                     sx={{ height: 100, borderColor: "divider", borderRightWidth: 2 }} />
          </Box>

          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h6" gutterBottom>
              Dostosowane wyszukiwanie ofert pracy
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Znajdź pracę idealnie dopasowaną do Twoich umiejętności i celów zawodowych. Dzięki naszym inteligentnym
              rekomendacjom otrzymasz oferty, które najlepiej odpowiadają Twojemu doświadczeniu i preferencjom. Nie
              trać czasu na przeglądanie setek ogłoszeń – skorzystaj z naszej pomocy i aplikuj na stanowiska, które
              naprawdę Cię interesują!
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Typography variant="h6" gutterBottom>
              Rozwiązania dla pracodawców
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Nasza platforma dostarcza nowoczesne narzędzia rekrutacyjne, które ułatwiają firmom znalezienie i
              zatrudnienie najlepszych talentów. Dzięki inteligentnym rekomendacjom i automatyzacji procesów
              rekrutacyjnych szybko dotrzesz do kandydatów idealnie dopasowanych do Twoich potrzeb. Zyskaj przewagę na
              rynku pracy i buduj zespół, który przyczyni się do sukcesu Twojej firmy!
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              2
            </Typography>
            <Divider orientation="vertical" flexItem
                     sx={{ height: 100, borderColor: "divider", borderRightWidth: 2 }} />
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <Card variant="outlined" sx={{ overflow: "hidden" }}>
              <Box
                component="img"
                src="/images/employer-solutions.png"
                alt="Employer Solutions"
                sx={{ display: "block", width: "100%", height: { xs: 220, sm: 280, md: 320 }, objectFit: "cover" }}
              />
            </Card>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8 }}
          >
            <Card variant="outlined" sx={{ overflow: "hidden" }}>
              <Box
                component="img"
                src="/images/candidate-support.png"
                alt="Candidate Support Services"
                sx={{ display: "block", width: "100%", height: { xs: 220, sm: 280, md: 320 }, objectFit: "cover" }}
              />
            </Card>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              3
            </Typography>
            <Divider orientation="vertical" flexItem
                     sx={{ height: 100, borderColor: "divider", borderRightWidth: 2 }} />
          </Box>

          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h6" gutterBottom>
              Usługi wsparcia dla kandydatów
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Zapewniamy kompleksowe wsparcie na każdym etapie rekrutacji – od przygotowania profesjonalnego CV, przez
              skuteczne strategie aplikowania, aż po przygotowanie do rozmów kwalifikacyjnych. Dzięki naszym narzędziom
              i wskazówkom zwiększysz swoje szanse na znalezienie wymarzonej pracy!
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}