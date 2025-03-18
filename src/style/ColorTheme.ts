import {createTheme} from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#ffffff",
            contrastText: "#000000",
        },
        secondary: {
            main: "#FFD700",
        },
        background: {
            default: "#1a1a1a",
        },
        text: {
            primary: "#FFC107",
            secondary: "#f8f9fa",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default theme;
