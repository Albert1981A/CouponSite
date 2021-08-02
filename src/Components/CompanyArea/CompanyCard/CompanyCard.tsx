import "./CompanyCard.css";
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CompaniesImage from "../../../Assets/images/companies.jpg";
import { ButtonGroup } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        maxWidth: 250,
    },
    media: {
        height: 110,
    },
});

function CompanyCard(): JSX.Element {
    const classes = useStyles();

    return (
        <Card className={classes.root}>

            <CardActionArea >

                <CardMedia
                    className={classes.media}
                    image={CompaniesImage}
                    title="Contemplative Reptile"
                />

                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Company name
                    </Typography>

                    <Typography variant="body2" color="textSecondary" component="p">
                        Company title
                    </Typography>
                </CardContent>

            </CardActionArea>

            <CardActions>
                <p>Operations:</p>
                <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                    <Button>Update</Button>
                    <Button>Delete</Button>
                </ButtonGroup>
            </CardActions>

        </Card>
    );
}

export default CompanyCard;