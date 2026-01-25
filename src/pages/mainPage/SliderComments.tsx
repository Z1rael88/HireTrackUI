import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Box, Card, Container, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const views = [
  "HireTrack bardzo ułatwił mi znalezienie pracy – szybko, bez stresu i wśród ofert dopasowanych do moich umiejętności.",
  "Dzięki HireTrack zatrudniliśmy świetnego specjalistę w zaledwie kilka dni. Prosto, sprawnie i skutecznie.",
  "Bardzo intuicyjna platforma – aplikowanie zajęło mi dosłownie chwilę, a odpowiedzi dostałem jeszcze tego samego dnia.",
  "Nie spodziewałem się, że zmiana pracy może być tak prosta. HireTrack to naprawdę świetne narzędzie!",
  "HireTrack skrócił cały proces rekrutacji do minimum. Polecam każdemu, kto ceni swój czas.",
  "Oferty były konkretne i dopasowane – w końcu nie musiałam przeglądać setek ogłoszeń bez sensu."
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 550,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3800,
  arrows: false,
  pauseOnHover: true,
  adaptiveHeight: true,
  cssEase: "cubic-bezier(0.22, 0.61, 0.36, 1)"
};

export default function SliderComments() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Card elevation={0} variant="outlined" className="glass-soft"
            sx={{ textAlign: "center", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, sm: 5, md: 6 } }}>
        <Typography variant="h4" gutterBottom color="primary">
          Co mówią nasi użytkownicy?
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 720, mx: "auto" }}>
          Sprawdź, co nasi użytkownicy mówią o HireTrack. Ich doświadczenia pokazują, jak bardzo możemy pomóc!
        </Typography>

        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            mt: { xs: 3, md: 5 },
            overflow: "hidden",
            "& .slick-dots": { bottom: -28 },
            "& .slick-dots li button:before": { fontSize: 10, opacity: 0.25 },
            "& .slick-dots li.slick-active button:before": { opacity: 0.7 }
          }}
        >
          <Slider {...sliderSettings}>
            {views.map((opinion) => (
              <Box key={opinion} sx={{ px: { xs: 0, sm: 1 } }}>
                <Card
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: { xs: 3, sm: 4, md: 5 },
                    textAlign: "center",
                    maxWidth: 760,
                    mx: "auto",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <FormatQuoteIcon
                    color="primary"
                    sx={{
                      fontSize: 56,
                      position: "absolute",
                      top: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "background.paper",
                      borderRadius: "50%",
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider"
                    }}
                  />

                  <Typography
                    variant="h6"
                    fontStyle="italic"
                    fontWeight={500}
                    sx={{ maxWidth: 640, mx: "auto", mt: 4, lineHeight: 1.6 }}
                  >
                    “{opinion}”
                  </Typography>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Card>
    </Container>
  );
}