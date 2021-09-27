import { Box, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import CouponsModel from "../../../Models/CouponModel";
import { couponsAddedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import "./PurchaseCoupon.css";

interface RouteParam {
    id: string;
}

interface PurchaseCouponProps extends RouteComponentProps<RouteParam> { }

function PurchaseCoupon(props: PurchaseCouponProps): JSX.Element {

    
    const history = useHistory();
    const id = +props.match.params.id;
    
    const [user, setUser] = useState(
        store.getState().authState.user
    );

    const [ofAllCoupon, setOfAllCoupon] = useState(
        store.getState().couponsState.allCoupons.find((c) => c.id === id)
    );
    
    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (user.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
            history.push("/home");
        }
    });

    async function purchaseCoupon(coupon: CouponsModel) {
        const result = window.confirm("Are you sure you want to add coupon id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.post<CouponsModel>(globals.urls.customer + "coupons", coupon);
                store.dispatch(couponsAddedAction(response.data)); // updating AppState (global state)
                history.push("/company-coupons");
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_DELETING_COUPON);
                notify.error(err);
            }
        }
    }

    return (
        <div className="PurchaseCoupon">
            <Typography className="head" variant="h5" noWrap>
                <Box fontWeight="fontWeightMedium">Purchase Coupon</Box>
            </Typography>
        </div>
    );
}

export default PurchaseCoupon;
