import { Box, colors, createStyles, makeStyles, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import { green, teal } from "@material-ui/core/colors";
import "./About.css";

function About(): JSX.Element {



    return (
        <div className="About">

            <div className="head2">
                <Typography className="head" variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">About</Box>
                </Typography>
            </div>
            
            <br />

            <Typography paragraph>
                Hello, my name is Albert Abuav and this is my final project in java full stack developer studies. <br />
                You can enter the site as an admin, company or customer. <br />
                As a company you can add and remove coupons and you can also update the existing coupons. <br />
                As a customer you can purchase coupons. <br />
                As an admin you can add, update and delete customers and companies. <br />
                Hope you enjoy your tour in my site. <br />
            </Typography>

        </div>
    );
}

export default About;
