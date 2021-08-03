import "./CompanyCard.css";
import React, { Component } from 'react';
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
import CouponModel from "../../../Models/CouponModel";
import CompanyModel from "../../../Models/CompanyModel";
import { DateRangeRounded } from "@material-ui/icons";
import moment from 'moment'

interface CardProps {
    coupon: CouponModel;
}

const useStyles = makeStyles({
    root: {
        // maxWidth: 300,
        width: 300,
    },
    media: {
        height: 110,
    },
});


function CompanyCard(_props: CardProps): JSX.Element {
    
    const classes = useStyles();

    const startDate = moment(_props.coupon.startDate).format('D/M/YYYY');
    const endDate = moment(_props.coupon.endDate).format('D/M/YYYY');

    return (
        <div>
            <Card className={classes.root}>

                <CardActionArea >

                    <CardMedia
                        className={classes.media}
                        //image={_props.coupon.image}
                        image={CompaniesImage}
                        title="Contemplative Reptile"
                    />


                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            Company ID: {_props.coupon.companyID} <br />
                            {_props.coupon.title}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                        Category: &nbsp; {_props.coupon.category} <br />
                            Description: &nbsp; {_props.coupon.description} <br />
                            Amount: &nbsp; {_props.coupon.amount} <br />
                            Start-Date: &nbsp; {startDate} <br />
                            End-Date: &nbsp; {endDate} <br />
                            Price: &nbsp; {_props.coupon.price}
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
        </div>
    );
}


export default CompanyCard;