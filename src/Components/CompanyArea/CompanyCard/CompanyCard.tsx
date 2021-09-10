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
import { ButtonGroup } from "@material-ui/core";
import CouponModel from "../../../Models/CouponModel";
import CompanyModel from "../../../Models/CompanyModel";
import { DateRangeRounded } from "@material-ui/icons";
import moment from 'moment'
import axios from "axios";
import globals from "../../../Service/Globals";
import { couponsDeletedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import tokenAxios from "../../../Service/InterceptorAxios";
import { NavLink } from "react-router-dom";
import notify, { ErrMsg } from "../../../Service/Notification";

interface CardProps {
    coupon: CouponModel;
}

const useStyles = makeStyles({
    root: {
        width: 300,
    },
    media: {
        height: 110,
    },
});

function CompanyCard(_props: CardProps): JSX.Element {

    const classes = useStyles();
    const prop1 = { ..._props.coupon }
    const startDate = moment(prop1.startDate).format('D/M/YYYY');
    const endDate = moment(prop1.endDate).format('D/M/YYYY');

    async function deleteCoupon(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete coupon id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.company + "coupons/" + id);
                store.dispatch(couponsDeletedAction(id)); // updating AppState (global state)
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_OCCURRED_WHILE_GETTING_COUPONS);
                notify.error(err);
            }
        }
    }

    return (
        <div className="CompanyCard">
            <Card className={classes.root}>

                <NavLink className="navLink" to={"/company-coupon-details/" + prop1.id} exact>

                    <CardActionArea>

                        <CardMedia
                            className={classes.media}
                            image={`${process.env.PUBLIC_URL}/assets/images/` + prop1.image}
                            title="Company Coupon"
                        />


                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h2">
                                Company ID: {prop1.companyID} <br />
                                {prop1.title}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" component="p">
                                Coupon Id:  &nbsp; {prop1.id} <br />
                                Category: <br /> {prop1.category} <br />
                                Description: &nbsp; {prop1.description} <br />
                                Amount: &nbsp; {prop1.amount} <br />
                                Start-Date: &nbsp; {startDate} <br />
                                End-Date: &nbsp; {endDate} <br />
                                Price: &nbsp; {prop1.price}
                            </Typography>

                        </CardContent>

                    </CardActionArea>

                </NavLink>

                {store.getState().authState.user.clientType === 'COMPANY' &&
                    <CardActions>
                        <p>Operations:</p>
                        <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                            <Button color="primary">
                                <NavLink className="link" to={"/update-company-coupon/" + prop1.id}>
                                    Update
                                </NavLink>
                            </Button>

                            <Button onClick={() => deleteCoupon(prop1.id)}>Delete</Button>
                        </ButtonGroup>
                    </CardActions>
                }

            </Card>
        </div>
    );
}

export default CompanyCard;
