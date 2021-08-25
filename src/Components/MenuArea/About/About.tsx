import { Box, colors, createStyles, makeStyles, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import { green, teal } from "@material-ui/core/colors";
import "./About.css";

function About(): JSX.Element {

    

    return (
        <div className="About">
                <Typography className="head" variant="h5" noWrap>
                    <Box fontWeight="fontWeightMedium">About</Box>
                </Typography>
            
        </div>
    );
}

export default About;
