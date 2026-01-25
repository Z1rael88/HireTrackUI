import { useEffect, useState } from "react";
import { Fab, Box } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import { motion } from "framer-motion";

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 120);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.22 }}
      sx={(theme) => ({
        position: "fixed",
        right: { xs: 14, sm: 18 },
        bottom: {
          xs: "calc(14px + 72px + env(safe-area-inset-bottom, 0px))",
          sm: 18
        },
        zIndex: theme.zIndex.fab
      })}
    >
      <Fab color="primary" size="medium" onClick={scrollToTop} aria-label="Scroll to top">
        <KeyboardArrowUp />
      </Fab>
    </Box>
  );
};

export default ScrollTopButton;