import {motion} from "framer-motion";
import {
    Container,
    Typography,
    Box,
    Button,
    Link,
    Paper
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RoomIcon from "@mui/icons-material/Room";
import React from "react";

interface ContactFormProps {
    handleOpen: () => void;
}

const Contact: React.FC<ContactFormProps> = ({handleOpen}) => {
    return (
        <Container maxWidth="lg"
                   sx={{
                       py: 6,
                       minHeight: "90.3vh"
                   }}>
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                style={{
                    textAlign: "center",
                }}
            >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Skontaktuj się z nami!
                </Typography>
            </motion.div>
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                style={{
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "40px",
                    position: "relative",
                }}
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2447.6530334962117!2d21.031625977123362!3d52.15881937196874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47193291027e15a1%3A0x57a820cc1900e8b!2sStok%C5%82osy%203%2C%2002-787%20Warszawa!5e0!3m2!1spl!2spl!4v1742385275340!5m2!1spl!2spl"
                    width="100%"
                    height="350"
                    style={{border: 0}}
                    allowFullScreen
                    loading="lazy"
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "white",
                        borderRadius: "25px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    <Button
                        href="https://maps.app.goo.gl/UP6ZVZtVbPGJmrx29"
                        target="_blank"
                        variant="contained"
                        sx={{
                            backgroundColor: "background.default",
                            color: "secondary.main",
                            fontWeight: "bold",
                            px: 3,
                            py: 1.5,
                            borderRadius: "25px",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                                color: "text.primary",
                                backgroundColor: "background.default",
                                transform: "scale(1.03)",
                            },
                        }}
                    >
                        <RoomIcon/>
                        Otwórz w Google Maps
                    </Button>
                </Box>
            </motion.div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: {xs: "column", md: "row"},
                    justifyContent: "space-around",
                    alignItems: "center",
                    textAlign: "center",
                    mb: 6,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: "center",
                        width: "30%",
                        backgroundColor: "background.default",
                        color: "white",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                            transform: "scale(1.03)",
                        },
                    }}
                >
                    <LocationOnIcon
                        sx={{
                            fontSize: 40,
                            mb: 2,
                            color: "secondary.main"
                        }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        Adres
                    </Typography>
                    <Typography>Stokłosy 3, 02-787 Warszawa</Typography>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: "center",
                        width: "30%",
                        backgroundColor: "background.default",
                        color: "white",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                            transform: "scale(1.03)",
                        },
                    }}
                >
                    <MailOutlineIcon
                        sx={{
                            fontSize: 40,
                            mb: 2,
                            color: "secondary.main"
                        }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        E-mail
                    </Typography>
                    <Link href="mailto:kontakt.hiretrack@gmail.com" color="inherit">
                        kontakt.hiretrack@gmail.com
                    </Link>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        textAlign: "center",
                        width: "30%",
                        backgroundColor: "background.default",
                        color: "white",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                            transform: "scale(1.03)",
                        },
                    }}
                >
                    <AccessTimeIcon
                        sx={{
                            fontSize: 40,
                            mb: 2,
                            color: "secondary.main"
                        }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        Godziny pracy
                    </Typography>
                    <Typography>Pon-Pt: 10:00 - 16:00</Typography>
                </Paper>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gap: 5
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: 3,
                        backgroundColor: "secondary.main",
                        color: "primary.contrastText",
                        fontWeight: "bold",
                        ":hover": {backgroundColor: "text.primary"},
                    }}
                    onClick={handleOpen}
                >
                    Wyślij wiadomość
                </Button>
            </Box>
        </Container>
    );
};

export default Contact;
