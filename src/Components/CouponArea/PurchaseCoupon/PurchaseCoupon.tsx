import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, PaperProps, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import CouponsModel from "../../../Models/CouponModel";
import { couponsAddedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import "./PurchaseCoupon.css";
import Draggable from 'react-draggable';
import React from "react";

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

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

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

            <Button variant="outlined" onClick={handleClickOpen}>
                Purchase
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Purchase coupon
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to add coupon id - { id } ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose}>Ok to Purchase</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PurchaseCoupon;
