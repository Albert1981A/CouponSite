import "./CompanyCard.css";
import React, { Component, useEffect, useState } from 'react';
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
import { allCouponsDeletedAction, couponsAddedAction, couponsDeletedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import tokenAxios from "../../../Service/InterceptorAxios";
import { NavLink, useHistory } from "react-router-dom";
import notify, { ErrMsg } from "../../../Service/Notification";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";

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
    const history = useHistory();
    const [user, setUser] = useState(
        store.getState().authState.user
    );

    const [coupon, setCoupon] = useState(
        store.getState().couponsState.allCoupons.find(c => c.id === _props.coupon.id)
    );

    useEffect(() => {
        let subscription: Unsubscribe;

        subscription = store.subscribe(() => {
            setCoupon(store.getState().couponsState.allCoupons.find(c => c.id === _props.coupon.id));
        });

        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setCoupon(store.getState().couponsState.allCoupons.find(c => c.id === _props.coupon.id));
                });
            }
            unsubscribe();
        };
    });


    async function deleteCoupon(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete coupon id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.company + "coupons/" + id);
                store.dispatch(couponsDeletedAction(id)); // updating AppState (global state)
                store.dispatch(allCouponsDeletedAction(id));
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_GETTING_COUPONS);
                notify.error(err);
            }
        }
    }

    async function purchaseCoupon(coupon: CouponModel): Promise<void> {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (store.getState().authState.user?.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
        } else if (store.getState().couponsState.coupons.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
        } else {
            const result = window.confirm("Are you sure you want to add coupon id - " + prop1.id + "?");
            if (result) {
                try {
                    const response = await tokenAxios.post<CouponsModel>(globals.urls.customer + "coupons", coupon);
                    store.dispatch(couponsAddedAction(response.data)); // updating AppState (global state)
                    history.push("/customer-coupons");
                } catch (err) {
                    // alert(err.message);
                    notify.error(ErrMsg.ERROR_DELETING_COUPON);
                    notify.error(err);
                }
            }
        }
    }

    function navTo() {
        if (store.getState().authState.user?.clientType === "COMPANY" && !store.getState().couponsState.coupons?.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.NOT_YOUR_COUPON);
        } else if (store.getState().authState.user?.clientType === "CUSTOMER" && store.getState().couponsState.coupons?.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
            history.push("/company-coupon-details/" + prop1.id)
        } else {
            history.push("/company-coupon-details/" + prop1.id)
        }
        // history.push("/company-coupon-details/" + prop1.id)
    }

    return (
        <div className="CompanyCard">
            <Card className={classes.root}>

                {/* <NavLink className="navLink" to={"/company-coupon-details/" + prop1.id} exact> */}

                <CardActionArea onClick={navTo}>

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

                {/* </NavLink> */}

                <CardActions>

                    {!user &&
                        <div>
                            <p>Operations:</p>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                                <Button onClick={() => purchaseCoupon(prop1)}>Purchase</Button>
                            </ButtonGroup>
                        </div>
                    }

                    {(user?.clientType === 'COMPANY') &&
                        store.getState().couponsState.coupons.find((c) => c.id === prop1.id) &&
                        <div>
                            <p>Operations:</p>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                                <Button color="primary">
                                    <NavLink className="link" to={"/update-company-coupon/" + prop1.id}>
                                        Update
                                    </NavLink>
                                </Button>

                                <Button onClick={() => deleteCoupon(prop1.id)}>Delete</Button>

                            </ButtonGroup>
                        </div>
                    }

                    {(user?.clientType === 'CUSTOMER') &&
                        !store.getState().couponsState.coupons.find((c) => c.id === prop1.id) &&
                        <div>
                            <p>Operations:</p>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                                <Button onClick={() => purchaseCoupon(prop1)}>Purchase</Button>
                            </ButtonGroup>
                        </div>
                    }

                </CardActions>
            </Card>
        </div>
    );
}

export default CompanyCard;
