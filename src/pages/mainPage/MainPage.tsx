import {Box} from "@mui/material";
import React from "react";
import Banner from "./Banner.tsx";
import Services from "./Services.tsx";
import SliderComments from "./SliderComments.tsx";
import Benefits from "./Benefits.tsx";

const MainPage: React.FC = () => {
    return (
        <Box>
            <Banner/>
            <Services/>
            <SliderComments/>
            <Benefits/>
        </Box>
    )
};
export default MainPage;