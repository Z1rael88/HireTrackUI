import {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store";
import theme from "./style/ColorTheme.ts";
import MainPage from "./pages/mainPage/MainPage.tsx";
import Privacy from "./pages/privacyPolicy/Privacy.tsx";
import Contact from "./pages/contact/Contact.tsx";
import ContactFormProps from "./components/contactForm/ContactForm.tsx";
import ScrollTopButton from "./components/features/ScrollTopButton.tsx";
import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import AuthSlider from "./pages/authUser/AuthSlider.tsx";
import {useRefreshMutation} from "./api/authApiSlice.ts";
import {logout} from "./store/userSlice.ts";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [open, setOpen] = useState(false);
    const isAuth = useSelector((state: RootState) => state.user.isAuth);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loading, setLoading] = useState(true);
    const [triggerRefresh] = useRefreshMutation();
    const dispatch = useDispatch();
    useEffect(() => {
        const tryRefresh = async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                setLoading(false);
                return;
            }
            try {
                await triggerRefresh({refreshToken}).unwrap();
            } catch (err) {
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };

        void tryRefresh();
    }, []);
    if (loading) {
        return
    }
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <ScrollTopButton/>
                <Header/>
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/privacy" element={<Privacy/>}/>
                    <Route path="/contact" element={<Contact handleOpen={handleOpen}/>}/>
                    <Route
                        path="/authUser"
                        element={isAuth ? <Navigate to="/" replace/> : <AuthSlider/>}
                    />
                </Routes>
                <ContactFormProps open={open} handleClose={handleClose}/>
                <Footer/>
            </BrowserRouter>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                toastClassName="custom-toast"
            />
        </ThemeProvider>

    );
}

export default App;