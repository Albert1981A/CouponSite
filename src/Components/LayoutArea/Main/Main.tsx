import { Box, Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";
import { allCouponsDownloadedAction, couponsDownloadedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import CompanyCard from "../../CompanyArea/CompanyCard/CompanyCard";
import EmptyView from "../../SharedArea/EmptyView/EmptyView";
import Routing from "../Routing/Routing";
import "./Main.css";

function Main(props: {}): JSX.Element {

    const history = useHistory();

    const [allCoupons, setAllCoupons] = useState(
        store.getState().couponsState.allCoupons
    );

    useEffect(() => {
        async function asyncFunction() {
            if (allCoupons.length === 0) {
                try {
                    const response = await axios.get<CouponsModel[]>(globals.urls.client + "get-coupons");
                    console.log(response.data);
                    if (response.data.length !== 0) {
                        store.dispatch(allCouponsDownloadedAction(response.data)); // updating AppState (global state)
                        setAllCoupons(store.getState().couponsState.allCoupons); // updating the local state
                        console.log(store.getState().couponsState.allCoupons);
                    }
                } catch (err: any) {
                    notify.error(ErrMsg.ERROR_GETTING_COUPONS);
                    notify.error(err);
                }
            }
        }

        asyncFunction();

        let subscription: Unsubscribe;

        subscription = store.subscribe(() => {
            setAllCoupons(store.getState().couponsState.allCoupons);
        });

        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setAllCoupons(store.getState().couponsState.allCoupons);
                });
            }
            unsubscribe();
        };

    });


    function handleClick2(): void {
        history.push("/coupon-list");
    }

    return (

        <div className="Main">
            
            <div className="head2">

                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">Main Page &nbsp; &nbsp;</Box>
                </Typography>

                {/* <div className="topButtonsGroup">
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                        <Button color="primary" onClick={handleClick2}>
                            Coupon list
                        </Button>
                    </ButtonGroup>
                </div> */}
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
                    {allCoupons.length === 0 && <EmptyView msg="No Coupon downloaded!" />}
                    {allCoupons.length !== 0 && allCoupons.map(c =>
                        <Grid item key={c.id} xs={12} sm={6} md={4}>
                            <CompanyCard key={c.id} coupon={c} />
                        </Grid>
                    )}
                </Grid>
            </div>

        </div>
    );
}

export default Main;
