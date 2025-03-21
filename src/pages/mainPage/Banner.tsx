import {Box, Button, Typography} from "@mui/material";
import {motion} from "framer-motion";
import React from "react";

const Banner: React.FC = () => {
    return (
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
                        mt: 4,
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        backgroundColor: "secondary.main",
                        color: "primary.ContrastText",
                        px: 4,
                        py: 2,
                        "&:hover": {backgroundColor: "text.primary"},
                    }}
                >
                    Rozpocznij teraz
                </Button>
            </motion.div>
        </Box>
    )
};

export default Banner;