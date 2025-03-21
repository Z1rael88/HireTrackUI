import React from "react";
import {Box, Container, Paper, Typography} from "@mui/material";
import Slider from "react-slick";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const views = [
    "HireTrack bardzo ułatwił mi znalezienie pracy – szybko, bez stresu i wśród ofert dopasowanych do " +
    "moich umiejętności.",
    "Dzięki HireTrack zatrudniliśmy świetnego specjalistę w zaledwie kilka dni. Prosto, sprawnie i skutecznie.",
    "Bardzo intuicyjna platforma – aplikowanie zajęło mi dosłownie chwilę, a odpowiedzi dostałem jeszcze " +
    "tego samego dnia.",
    "Nie spodziewałem się, że zmiana pracy może być tak prosta. HireTrack to naprawdę świetne narzędzie!",
    "HireTrack skrócił cały proces rekrutacji do minimum. Polecam każdemu, kto ceni swój czas.",
    "Oferty były konkretne i dopasowane – w końcu nie musiałam przeglądać setek ogłoszeń bez sensu.",
];
const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
};
const SliderComments: React.FC = () => {
    return (
        <Container sx={{
            py: 12,
            textAlign: "center",
            backgroundColor: "background.default",
            p: 6,
            borderRadius: 4,
        }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="secondary.main">
                Co mówią nasi użytkownicy?
            </Typography>
            <Typography maxWidth="700px" margin="auto" color="text.secondary">
                Sprawdź, co nasi użytkownicy mówią o HireTrack. Ich doświadczenia pokazują, jak bardzo możemy pomóc!
            </Typography>

            <Box sx={{
                maxWidth: 900,
                mx: "auto",
                mt: 5,
                position: "relative"
            }}>
                <Slider {...sliderSettings}>
                    {views.map((opinion, index) => (
                        <Box key={index}>
                            <Paper
                                elevation={5}
                                sx={{
                                    p: 6,
                                    borderRadius: 4,
                                    textAlign: "center",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    maxWidth: 700,
                                    mx: "auto",
                                    position: "relative",
                                }}
                            >
                                <FormatQuoteIcon
                                    sx={{
                                        fontSize: 60,
                                        color: "secondary.main",
                                        position: "absolute",
                                        top: 5,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        backgroundColor: "primary.contrastText",
                                        borderRadius: "50%",
                                        p: 1,
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    fontStyle="italic"
                                    fontWeight="500"
                                    color="text.primary"
                                    sx={{maxWidth: "600px", mx: "auto", mt: 3}}
                                >
                                    "{opinion}"
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 1
                                }}>
                                </Box>
                            </Paper>
                        </Box>
                    ))}
                </Slider>
            </Box>
        </Container>
    )
};

export default SliderComments;