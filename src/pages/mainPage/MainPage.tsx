import {Typography, Container, Box, Button, Divider} from "@mui/material";
import {motion} from "framer-motion";
import React from "react";

const MainPage: React.FC = () => {

    return (
        <Box>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "400px",
                    backgroundImage: "url('/banner.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                />
                <motion.div
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1}}
                    style={{position: "relative", zIndex: 1}}
                >
                    <Typography variant="h3"
                                sx={{
                                    color: "primary.main",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                                }}>
                        Znajdź swoją wymarzoną pracę
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 2,
                            backgroundColor: "secondary.main",
                            color: "primary.ContrastText",
                            "&:hover": {backgroundColor: "text.primary"},
                        }}
                    >
                        Zacznij tworzenie CV
                    </Button>
                </motion.div>
            </Box>
            <Container sx={{
                py: 5,
            }}>
                <Box display="flex" flexDirection={{xs: "column", md: "row"}} alignItems="center" gap={4}>
                    <motion.div
                        initial={{opacity: 0, x: -50}}
                        whileInView={{opacity: 1, x: 0}}
                        transition={{duration: 1}}
                    >
                        <Typography variant="h4" fontWeight="bold">
                            O nas
                        </Typography>
                        <Typography sx={{mt: 2, color: "gray"}}>
                            W HireTrack odgrywamy kluczową rolę w kształtowaniu Twojej kariery,
                            pomagając znaleźć idealne miejsce pracy. Nasza platforma łączy kandydatów
                            z najlepszymi firmami i rekruterami, sprawiając, że proces rekrutacji staje
                            się prostszy.
                        </Typography>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, x: 50}}
                        whileInView={{opacity: 1, x: 0}}
                        transition={{duration: 1}}
                    >
                        <Typography variant="h4" fontWeight="bold">
                            Nasza misja
                        </Typography>
                        <Typography sx={{mt: 2, color: "gray"}}>
                            Wspieramy kandydatów w procesie rekrutacji, dostarczając
                            inteligentne narzędzia do wyszukiwania ofert pracy i kontaktu z pracodawcami.
                            Pomagamy firmom znaleźć najlepszych specjalistów w oparciu o zaawansowane
                            algorytmy dopasowania.
                        </Typography>
                    </motion.div>
                </Box>
            </Container>
            <Container sx={{py: 8, textAlign: "center"}}>
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <Typography variant="h4" fontWeight="bold" color="primary.textContrast" gutterBottom>
                        Usługi w HireTrack
                    </Typography>
                    <Typography variant="body1" maxWidth="900px" marginX="auto" mb={5}>
                        Oferujemy nowoczesne narzędzia dla kandydatów i pracodawców, usprawniając proces rekrutacji.
                    </Typography>
                </motion.div>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        gap: 4,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <motion.div
                        initial={{opacity: 0, x: -50}}
                        whileInView={{opacity: 1, x: 0}}
                        transition={{duration: 1}}
                    >
                        <Box>
                            <img src="/tailored-job.png" alt="Tailored Job Searches"
                                 style={{width: "100%", borderRadius: "12px"}}/>
                        </Box>
                    </motion.div>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Typography variant="h6" sx={{fontWeight: "bold", color: "primary.ContrastText", mb: 1}}>
                            1
                        </Typography>
                        <Divider orientation="vertical" flexItem
                                 sx={{height: "100px", width: "2px", backgroundColor: "secondary.main"}}/>
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary.ContrastText" gutterBottom>
                            Dostosowane wyszukiwanie ofert pracy
                        </Typography>
                        <Typography variant="body1" textAlign="left">
                            Znajdź pracę idealnie dopasowaną do Twoich umiejętności i celów zawodowych.
                            Dzięki naszym inteligentnym rekomendacjom otrzymasz oferty,
                            które najlepiej odpowiadają Twojemu doświadczeniu i preferencjom.
                            Nie trać czasu na przeglądanie setek ogłoszeń – skorzystaj z naszej
                            pomocy i aplikuj na stanowiska, które naprawdę Cię interesują!
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary.ContrastText" gutterBottom>
                            Rozwiązania dla pracodawców
                        </Typography>
                        <Typography variant="body1" textAlign="right">
                            Nasza platforma dostarcza nowoczesne narzędzia rekrutacyjne, które
                            ułatwiają firmom znalezienie i zatrudnienie najlepszych talentów.
                            Dzięki inteligentnym rekomendacjom i automatyzacji procesów rekrutacyjnych
                            szybko dotrzesz do kandydatów idealnie dopasowanych do Twoich potrzeb.
                            Zyskaj przewagę na rynku pracy i buduj zespół, który przyczyni się do
                            sukcesu Twojej firmy!
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Typography variant="h6" sx={{fontWeight: "bold", color: "primary.ContrastText", mb: 1}}>
                            2
                        </Typography>
                        <Divider orientation="vertical" flexItem
                                 sx={{height: "100px", width: "2px", backgroundColor: "secondary.main"}}/>
                    </Box>
                    <motion.div
                        initial={{opacity: 0, x: 50}}
                        whileInView={{opacity: 1, x: 0}}
                        transition={{duration: 1}}
                    >
                        <Box>
                            <img src="/employer-solutions.png" alt="Employer Solutions"
                                 style={{width: "100%", borderRadius: "12px"}}/>
                        </Box>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, x: -50}}
                        whileInView={{opacity: 1, x: 0}}
                        transition={{duration: 1}}
                    >
                        <Box>
                            <img src="/candidate-support.png" alt="Candidate Support Services"
                                 style={{width: "100%", borderRadius: "12px"}}/>
                        </Box>
                    </motion.div>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Typography variant="h6" sx={{fontWeight: "bold", color: "primary.ContrastText", mb: 1}}>
                            3
                        </Typography>
                        <Divider orientation="vertical" flexItem
                                 sx={{height: "100px", width: "2px", backgroundColor: "secondary.main"}}/>
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" color="primary.ContrastText" gutterBottom>
                            Usługi wsparcia dla kandydatów
                        </Typography>
                        <Typography variant="body1" textAlign="left">
                            Zapewniamy kompleksowe wsparcie na każdym etapie rekrutacji – od
                            przygotowania profesjonalnego CV, przez skuteczne strategie aplikowania,
                            aż po przygotowanie do rozmów kwalifikacyjnych. Dzięki naszym narzędziom
                            i wskazówkom zwiększysz swoje szanse na znalezienie wymarzonej pracy!
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
};
export default MainPage;