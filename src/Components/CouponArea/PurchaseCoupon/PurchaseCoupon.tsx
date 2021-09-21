import { Box, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import store from "../../../Redux/Store";
import notify, { ErrMsg } from "../../../Service/Notification";
import "./PurchaseCoupon.css";

interface RouteParam {
    id: string;
}

interface PurchaseCouponProps extends RouteComponentProps<RouteParam> { }

function PurchaseCoupon(props: PurchaseCouponProps): JSX.Element {

    const history = useHistory(); //Redirect function
    const id = +props.match.params.id;
    const [coupon, setCoupon] = useState(
        store.getState().couponsState.coupons.find((c) => c.id === id)
    );
    
    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (store.getState().authState.user.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
            history.push("/home");
        }

        // unsubscribe = store.subscribe(() => {
        //     setCoupon(store.getState().couponsState.coupons.find((c) => c.id === id))
        // })

        // return () => {
        //     unsubscribe();
        //     console.log('Bye');
        // };
    });

    return (
        <div className="PurchaseCoupon">
            <Typography className="head" variant="h5" noWrap>
                <Box fontWeight="fontWeightMedium">Purchase Coupon</Box>
            </Typography>
        </div>
    );
}

export default PurchaseCoupon;
