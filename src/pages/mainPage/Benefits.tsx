import {Box, Container, Paper, Typography} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import HandshakeIcon from "@mui/icons-material/Handshake";


const benefits = [
    {
        icon: <SearchIcon fontSize="inherit" sx={{fontSize: 50}} color="primary"/>,
        title: "Precyzyjne dopasowanie",
        desc: "Szybkie wyszukiwanie ofert zgodnych z Twoimi umiejętnościami."
    },
    {
        icon: <DescriptionIcon fontSize="inherit" sx={{fontSize: 50}} color="primary"/>,
        title: "Kreator CV",
        desc: "Tworzenie CV w kilka minut, bez stresu i skomplikowanych narzędzi."
    },
    {
        icon: <HandshakeIcon fontSize="inherit" sx={{fontSize: 50}} color="primary"/>,
        title: "Wsparcie ekspertów",
        desc: "Porady i wskazówki, które zwiększą Twoje szanse na rynku pracy."
    },
];
const Benefits: React.FC = () => {
    return (
        <Container
            sx={{
                py: 10,
                textAlign: "center",
            }}
        >
            <Typography variant="h3" fontWeight="bold" color="primary.contrastText" gutterBottom>
                Dlaczego warto wybrać HireTrack?
            </Typography>
            <Typography
                variant="h6"
                color="primary.contrastText"
                maxWidth="700px"
                margin="auto"
                mb={5}
            >
                Nasza platforma oferuje inteligentne rozwiązania, które pomagają zarówno kandydatom, jak i
                rekruterom.
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 4,
                }}
            >
                {benefits.map((feature, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "calc(50% - 16px)",
                                md: "calc(33.33% - 21.33px)",
                            }
                        }}
                    >
                        <Paper
                            sx={{
                                p: 5,
                                borderRadius: 4,
                                textAlign: "center",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                backgroundColor: "background.default",
                                minHeight: 300,
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
                                },
                            }}
                        >
                            <Box sx={{mb: 3}}>{feature.icon}</Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {feature.desc}
                            </Typography>
                        </Paper>
                    </Box>
                ))}
            </Box>
        </Container>
    )
};

export default Benefits;