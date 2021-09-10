import { Box, Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { Component, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";
import { couponsDownloadedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import CompanyCard from "../../CompanyArea/CompanyCard/CompanyCard";
import EmptyView from "../../SharedArea/EmptyView/EmptyView";
import "./CustomerCoupons.css";

function CustomerCoupons(props: {}): JSX.Element {

    let unsubscribe: Unsubscribe;
    const history = useHistory();

    const [coupons, setCoupons] = useState(
        store.getState().couponsState.coupons
    );

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        } else if (store.getState().authState.user.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_COMPANY_ALLOWED);
            history.push("/home");
        } else {
            asyncFunction();
            console.log("Hi... Im here 4");
        }
        async function asyncFunction() {
            if (coupons.length == 0) {
                try {
                    console.log("Hi... Im here 1");
                    const response = await tokenAxios.get<CouponsModel[]>(globals.urls.customer + "coupons");
                    if (response.data.length !== 0) {
                        store.dispatch(couponsDownloadedAction(response.data)); // updating AppState (global state)
                        setCoupons(store.getState().couponsState.coupons); // updating the local state
                        console.log("Hi... Im here 2");
                    }
                } catch (err) {
                    // alert(err.message);
                    notify.error(ErrMsg.ERROR_OCCURRED_WHILE_GETTING_COUPONS);
                    notify.error(err);
                }
            }
        }

        unsubscribe = store.subscribe(() => {
            setCoupons(store.getState().couponsState.coupons); // Will let us notify
        })

        return () => {
            unsubscribe();
            console.log('Bye');
        };
    });

    function handleClick1(): void {
        history.push("/add-coupon");
    }

    function handleClick2(): void {
        history.push("/coupon-list");
    }

    return (
        <div className="CustomerCoupons">

            <div className="head2">
                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">Customer Coupons &nbsp; &nbsp;</Box>
                </Typography>

                <div className="topButtonsGroup">
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={handleClick1}>
                            Add Coupon
                        </Button>

                        <Button color="primary" onClick={handleClick2}>
                            Coupon list
                        </Button>

                    </ButtonGroup>
                </div>
            </div>

            <br />

            <Typography paragraph>
                This section shows all the customer's coupons.
                Here You can purchase coupons add them to your shopping list.
                Please note that:
                You cannot purchase the same coupon more than once and The coupon cannot be purchased if its quantity is 0.
                Also, The coupon cannot be purchased if its expiration date has already been reached.
            </Typography>

            <div className="cards Box">
                <Grid container spacing={4}>
                    {coupons.length === 0 && <EmptyView msg="No Coupon downloaded!" />}
                    {coupons.length !== 0 && coupons.map(c =>
                        <Grid item key={c.id} xs={12} sm={6} md={4}>
                            <CompanyCard key={c.id} coupon={c} />
                        </Grid>
                    )}
                </Grid>
            </div>

        </div>
    );

}

export default CustomerCoupons;
