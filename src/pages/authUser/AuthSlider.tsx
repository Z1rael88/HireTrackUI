import React, {useState} from "react";
import {Box, Button, Typography, Paper, Container} from "@mui/material";
import {motion} from "framer-motion";
import SingIn from "../../components/authUserForms/SingIn.tsx";
import SingUp from "../../components/authUserForms/SingUp.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const AuthSlider: React.FC = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const isAuth = useSelector((state: RootState) => state.user.isAuth);
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuth) {
            navigate("/");
        }
    }, [isAuth, navigate]);
    return (
        <Container sx={{
            height: "90.3vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Box
                sx={{
                    width: "1200px",
                    height: "700px",
                    borderRadius: 3,
                    boxShadow: 6,
                    overflow: "hidden",
                    position: "relative",
                    backgroundImage: `url(/images/backgroundAuth.png)`,
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                }}
            >
                <motion.div
                    animate={{x: isSignIn ? "0%" : "100%"}}
                    transition={{duration: 0.6}}
                    style={{
                        position: "absolute",
                        width: "50%",
                        height: "100%",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fff",
                    }}
                >
                    <Paper elevation={0} sx={{width: "100%", maxWidth: 364, textAlign: "center"}}>
                        <Typography variant="h4" fontWeight="bold" mb={2} color="primary.contrastText">
                            {isSignIn ? "Zaloguj się" : "Utwórz nowe konto"}
                        </Typography>
                        {isSignIn ? <SingIn/> : <SingUp/>}
                    </Paper>
                </motion.div>
                <motion.div
                    animate={{x: isSignIn ? "0%" : "-100%"}}
                    transition={{duration: 0.6}}
                    style={{
                        position: "absolute",
                        right: 0,
                        width: "50%",
                        height: "100%",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            px: 4,
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" mb={2}>
                            {isSignIn ? "Cześć! Miło Cię widzieć!" : "Witamy ponownie!"}
                        </Typography>
                        <Typography mb={3}>
                            {isSignIn
                                ? "Wprowadź swoje dane osobowe i rozpocznij podróż z nami!"
                                : "Aby pozostać z nami w kontakcie, zaloguj się za pomocą swoich danych osobowych"}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => setIsSignIn(!isSignIn)}
                        >
                            {isSignIn ? "ZAREJESTRUJ SIĘ" : "ZALOGUJ SIĘ"}
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Container>
    );
};

export default AuthSlider;
