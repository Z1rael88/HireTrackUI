import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from "./pages/mainPage/MainPage.tsx";
import theme from "./style/ColorTheme.ts"
import {ThemeProvider} from "@mui/material";
import Header from "./pages/mainPage/Header.tsx";
import Footer from "./pages/mainPage/Footer.tsx";
import Privacy from "./pages/privacyPolicy/Privacy.tsx";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" Component={MainPage}/>
                    <Route path="/privacy" Component={Privacy}/>
                </Routes>
                <Footer/>
            </BrowserRouter>
        </ThemeProvider>

    )
}

export default App;