import { Box, Typography } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import Routing from "../Routing/Routing";
import "./Main.css";

function Main(): JSX.Element {
    return (

        <div className="Main">
            <Typography className="head" variant="h5" noWrap>
                <Box fontWeight="fontWeightMedium">Main</Box>
            </Typography>
        </div>
    );
}

export default Main;
