import { Box, Button, ButtonGroup, Grid, Select, Typography } from "@material-ui/core";
import React, { SyntheticEvent } from "react";
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

    const [type, setType] = React.useState<string | string>('');
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const [coupons, setCoupons] = useState(
        store.getState().couponsState.coupons
    );

    async function asyncFunction() {
        if (coupons.length == 0) {
            try {
                // console.log("Hi... Im here 1");
                const response = await tokenAxios.get<CouponsModel[]>(globals.urls.customer + "coupons");
                if (response.data.length !== 0) {
                    store.dispatch(couponsDownloadedAction(response.data)); // updating AppState (global state)
                    setCoupons(store.getState().couponsState.coupons); // updating the local state
                    // console.log("Hi... Im here 2");
                }
            } catch (err) {
                notify.error(ErrMsg.ERROR_GETTING_COUPONS);
                notify.error(err);
            }
        }
    }

    async function asyncFunction2() {
        try {
            // console.log("Hi... Im here 1");
            const response = await tokenAxios.get<CouponsModel[]>(globals.urls.customer + "coupons");
            if (response.data.length !== 0) {
                store.dispatch(couponsDownloadedAction(response.data)); // updating AppState (global state)
                setCoupons(store.getState().couponsState.coupons); // updating the local state
                // console.log("Hi... Im here 2");
            }
        } catch (err) {
            notify.error(ErrMsg.ERROR_GETTING_COUPONS);
            notify.error(err);
        }
    }

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        } else if (store.getState().authState.user.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
            history.push("/home");
        } else {
            asyncFunction();
            // console.log("Hi... Im here 4");
        }

        unsubscribe = store.subscribe(() => {
            setCoupons(store.getState().couponsState.coupons);
        })

        return () => {
            unsubscribe();
            console.log('Bye');
        };
    });

    function allCoupons() {
        asyncFunction2();
    }

    const [id, setId] = useState<string>("");

    const insertId = (args: SyntheticEvent) => {
        const value = (args.target as HTMLInputElement).value;
        setId(value);
    }

    async function getSingleCoupon() {
        if (!coupons.find((c) => c.id === parseInt(id))) {
            notify.error(ErrMsg.NO_COUPON_BY_THIS_ID);
        } else {
            history.push("/company-coupon-details/" + id);
        }
    }

    const [maxPrice, setMaxPrice] = useState<string>("");

    const insertPrice = (args: SyntheticEvent) => {
        const value = (args.target as HTMLInputElement).value;
        setMaxPrice(value);
    }

    async function findMaxPrice() {
        if (!coupons.find((c) => c.price < parseInt(maxPrice))) {
            notify.error(ErrMsg.NO_COUPON_BY_THIS_MAX_PRICE);
        } else {
            var rows1: CouponsModel[] = [];
            for (var i = 0; i < coupons.length; i++) {
                if (coupons[i].price < parseInt(maxPrice)) {
                    rows1.push(coupons[i]);
                }
                setCoupons(rows1);
            }
        }
    }

    function purchase(): void {
        history.push("/home");
    }

    function specificCategory(): void {
        if (!coupons.find((c) => c.category === type)) {
            notify.error(ErrMsg.NO_COUPON_BY_THIS_CATEGORY);
        } else {
            var rows: CouponsModel[] = [];
            for (var i = 0; i < coupons.length; i++) {
                if (coupons[i].category === type) {
                    rows.push(coupons[i]);
                }
                setCoupons(rows);
            }
        }
    }

    return (
        <div className="CustomerCoupons">

            <Typography variant="h5" noWrap>
                <Box className="head1" fontWeight="fontWeightMedium">Customer Coupons &nbsp; &nbsp;</Box>
            </Typography>
            <br />

            <div className="head2">

                <div className="topButtonsGroup">
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={purchase}>
                            Purchase Coupon
                        </Button>

                        <Button color="primary" onClick={allCoupons}>
                            All Coupons
                        </Button>

                        <Button color="primary" onClick={specificCategory}>
                            Coupons Of Specific Category
                        </Button>

                        <Select
                            className="selectCategory"
                            labelId="category"
                            id="category"
                            value={type}
                            onChange={handleChange}
                            name="category"
                        >
                            <option value="">None</option>
                            <option value="FOOD_PRODUCTS">Food products</option>
                            <option value="ELECTRICAL_PRODUCTS">Electrical products</option>
                            <option value="HOUSEHOLD_PRODUCTS">Household products</option>
                            <option value="GARDEN_PRODUCTS">Garden products</option>
                            <option value="RESTAURANTS">Restaurants</option>
                            <option value="VACATIONS_ABROAD">Vacations abroad</option>
                            <option value="VACATIONS_IN_ISRAEL">Vacations in israel</option>
                            <option value="ENTRANCES_TO_SITES_AND_MUSEUMS">Entrances to sites and museums</option>
                        </Select>

                        <Button color="primary" onClick={findMaxPrice}>
                            Coupons Of Max price
                        </Button>

                        <input className="inputId" type="text" onChange={insertPrice} value={maxPrice} />

                        <Button color="primary" onClick={getSingleCoupon}>
                            Get Single Coupon by id:
                        </Button>

                        <input className="inputId" type="text" onChange={insertId} value={id} />

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
