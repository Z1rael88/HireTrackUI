import {useState, useEffect} from "react";
import {Fab, Box} from "@mui/material";
import {KeyboardArrowUp} from "@mui/icons-material";
import {motion} from "framer-motion";

const ScrollTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 100);
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                zIndex: 1000
            }}
        >
            {isVisible && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    transition={{duration: 0.3}}
                >
                    <Fab color="primary" size="medium" onClick={scrollToTop}>
                        <KeyboardArrowUp/>
                    </Fab>
                </motion.div>
            )}
        </Box>
    );
};

export default ScrollTopButton;
