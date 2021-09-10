import { Box, Button, ButtonGroup, Grid, Link, ThemeProvider, Typography, unsupportedProp, useTheme } from "@material-ui/core";
import axios from "axios";
import { count } from "console";
import { Component, useEffect, useRef, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";
import { companiesDownloadedAction } from "../../../Redux/CompaniesState";
import { couponsDownloadedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import EmptyView from "../../SharedArea/EmptyView/EmptyView";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./CompanyCoupons.css";

function CompanyCoupons(props: {}): JSX.Element {

    let unsubscribe: Unsubscribe;
    const history = useHistory();

    const [coupons, setCoupons] = useState(
        store.getState().couponsState.coupons
    );

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        } else if (store.getState().authState.user.clientType !== "COMPANY") {
            notify.error(ErrMsg.ONLY_COMPANY_ALLOWED);
            history.push("/home");
        } else {
            asyncFunction();
            console.log("Hi... Im here 4");
        }
        async function asyncFunction() {
            if (coupons.length === 0) {
                try {
                    console.log("Hi... Im here 1");
                    const response = await tokenAxios.get<CouponsModel[]>(globals.urls.company + "coupons");
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
        <div className="CompanyCoupons">

            <div className="head2">
                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">Company Coupons &nbsp; &nbsp;</Box>
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
                This section shows all the company's coupons.
                You can add and remove coupons and you can also update the existing coupons.
                Please note that a coupon with the same title to an existing coupon should not be added.
                If an existing coupon is updated, it is not possible to update the coupon code. Also, you cannot updated the company code.
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

export default CompanyCoupons;

