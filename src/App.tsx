import {useState} from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from "./pages/mainPage/MainPage.tsx";
import theme from "./style/ColorTheme.ts"
import {ThemeProvider} from "@mui/material";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Privacy from "./pages/privacyPolicy/Privacy.tsx";
import Contact from "./pages/contact/Contact.tsx";
import ContactFormProps from "./pages/contact/ContactForm.tsx";
import ScrollTopButton from "./components/ScrollTopButton";

function App() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <ScrollTopButton/>
                <Header/>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/privacy" element={<Privacy/>}/>
                    <Route path="/contact" element={<Contact handleOpen={handleOpen}/>}/>
                </Routes>
                <ContactFormProps open={open} handleClose={handleClose}/>
                <Footer/>
            </BrowserRouter>
        </ThemeProvider>

    )
}

export default App;