import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, PaperProps, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { Component, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { NavLink, RouteComponentProps, useHistory, useParams } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";
import CouponModel from "../../../Models/CouponModel";
import { allCouponsDeletedAction, couponsAddedAction, couponsDeletedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./CouponDetails.css";

interface RouteParams {
    id: string;
}

interface CouponDetailsProps extends RouteComponentProps<RouteParams> { }

const useStyles = makeStyles({
    root: {
        width: 300,
    },
    media: {
        height: 110,
    },
});

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

function CouponDetails(props: CouponDetailsProps): JSX.Element {

    const classes = useStyles();
    const params = useParams<RouteParams>();
    console.log("first: " + params.id);
    const id = + props.match.params.id
    console.log("second: " + id);
    const history = useHistory();

    let routeTo: string = null;
    if (store.getState().authState.user?.clientType === "COMPANY") {
        routeTo = "/company-coupons";
    } else if (store.getState().authState.user?.clientType === "CUSTOMER") {
        routeTo = "/customer-coupons";
    } else if (store.getState().authState.user?.clientType === "ADMINISTRATOR") {
        routeTo = "/admin-space";
    }

    if (!store.getState().authState.user) {
        notify.error(ErrMsg.PLS_LOGIN);
        history.push("/login")
    }

    const [coupon, setCoupon] = useState(
        store.getState().couponsState.coupons.find((c) => c.id === id)
    );

    const [ofAllCoupon, setOfAllCoupon] = useState(
        store.getState().couponsState.allCoupons.find((c) => c.id === id)
    );

    useEffect(() => {
        if (store.getState().authState.user?.clientType === "CUSTOMER") {
            setOfAllCoupon(store.getState().couponsState.allCoupons.find((c) => c.id === id));
        } else if (store.getState().authState.user) {
            setCoupon(store.getState().couponsState.coupons.find((c) => c.id === id));
        }

        // let subscription: Unsubscribe;
        // let subscription2: Unsubscribe;

        // subscription = store.subscribe(() => {
        //     setOfAllCoupon(store.getState().couponsState.allCoupons.find((c) => c.id === id));
        // });

        // subscription2 = store.subscribe(() => {
        //     setCoupon(store.getState().couponsState.coupons.find((c) => c.id === id));
        // });

        // return () => {
        //     function unsubscribe() {
        //         subscription = store.subscribe(() => {
        //             setOfAllCoupon(store.getState().couponsState.allCoupons.find((c) => c.id === id));
        //         });

        //         subscription2 = store.subscribe(() => {
        //             setCoupon(store.getState().couponsState.coupons.find((c) => c.id === id));
        //         });
        //     }
        //     unsubscribe();
        // };
    })

    // console.log("start Date: " + coupon.startDate);
    // console.log("start Date: " + moment(coupon.startDate).format('D/M/YYYY'));
    // const startDate = moment(coupon.startDate).format('D/M/YYYY');
    // const endDate = moment(coupon.endDate).format('D/M/YYYY');

    const [openDelete, setOpenDelete] = React.useState(false);

    const handleDeleteClickOpen = () => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (store.getState().authState.user?.clientType !== "COMPANY") {
            notify.error(ErrMsg.ONLY_COMPANY_ALLOWED);
        } else if (!store.getState().couponsState.coupons.find((c) => c.id === coupon.id)) {
            notify.error(ErrMsg.COMPANY_NOT_OWN_THIS_COUPON);
        } else {
            setOpenDelete(true);
        }
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    async function deleteCoupon(id: number): Promise<void> {
        setOpenDelete(false);
        // const result = window.confirm("Are you sure you want to delete coupon id - " + id + "?");
        // if (result) {
        try {
            const response = await tokenAxios.delete<any>(globals.urls.company + "coupons/" + id);
            store.dispatch(couponsDeletedAction(id));
            store.dispatch(allCouponsDeletedAction(id));
            notify.success(SccMsg.DELETED);
            history.push("/company-coupons");
        } catch (err: any) {
            notify.error(ErrMsg.ERROR_DELETING_COUPON);
            notify.error(err);
        }
        // }
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        if (store.getState().authState.user?.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
        } else if (store.getState().couponsState.coupons.find((c) => c.id === id)) {
            notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function purchaseCoupon(couponToSend: CouponModel): Promise<void> {
        console.log(couponToSend);
        setOpen(false);
        // if (store.getState().authState.user?.clientType !== "CUSTOMER") {
        //     notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
        // } else if (store.getState().couponsState.coupons.find((c) => c.id === id)) {
        //     notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
        // } else {
        try {
            const response = await tokenAxios.post<CouponsModel>(globals.urls.customer + "coupons", couponToSend);
            store.dispatch(couponsAddedAction(response.data));
            notify.success(SccMsg.PURCHASE_SUCCESS);
            history.push("/customer-coupons");
        } catch (err: any) {
            notify.error(ErrMsg.ERROR_PURCHASING_COUPON);
            notify.error(err);
        }
        // }
    }

    function yourSpace() {
        history.push(routeTo);
    }

    function toMain() {
        history.push("/home");
    }

    function toUpdate() {
        history.push("/update-company-coupon/" + ofAllCoupon.id);
    }

    return (
        <div className="CouponDetails">
            <Card className={classes.root}>

                {store.getState().authState.user &&
                    <CardActionArea>

                        <CardMedia
                            className={classes.media}
                            // image={`${process.env.PUBLIC_URL}/assets/images/` + ofAllCoupon.image}
                            image={ globals.urls.company + "images/company-id/" + ofAllCoupon.companyID }
                            title="Contemplative Reptile"
                        />

                        <CardContent>
                            <Typography className="Typography1" gutterBottom variant="h6" component="h2">
                                Company ID: <span className="spanGetDetails">{ofAllCoupon.companyID}</span> <br />
                            </Typography>

                            <Typography variant="body2" color="textSecondary" component="p">
                                Coupon ID: &nbsp; <span className="spanGetDetails">{ofAllCoupon.id}</span> <br />
                                Title: &nbsp; <span className="spanGetDetails">{ofAllCoupon.title}</span> <br />
                                Description: &nbsp; <span className="spanGetDetails">{ofAllCoupon.description}</span> <br />
                                Amount: &nbsp; <span className="spanGetDetails">{ofAllCoupon.amount}</span> <br />
                                Start-Date: &nbsp; <span className="spanGetDetails">{moment(ofAllCoupon.startDate).format('D/M/YYYY')}</span> <br />
                                End-Date: &nbsp; <span className="spanGetDetails">{moment(ofAllCoupon.endDate).format('D/M/YYYY')}</span> <br />
                                Price: &nbsp; <span className="spanGetDetails">{ofAllCoupon.price}</span> <br />
                                Category: <br /> <span className="spanGetDetails">{ofAllCoupon.category}</span>
                            </Typography>

                        </CardContent>

                    </CardActionArea>
                }

                <CardActions>

                    {store.getState().authState.user?.clientType === 'COMPANY' &&
                        store.getState().couponsState.coupons.find((c) => c.id === coupon.id) &&
                        <div>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                                <Button color="primary" onClick={yourSpace}>
                                    Your Space
                                </Button>

                                <Button color="primary" onClick={toMain}>
                                    To Main
                                </Button>

                                <Button color="primary" onClick={toUpdate}>
                                    Update
                                </Button>

                                {/* <Button onClick={() => deleteCoupon(ofAllCoupon.id)}>Delete</Button> */}
                                <Button onClick={handleDeleteClickOpen}>
                                    Delete
                                </Button>

                                <Dialog
                                    open={openDelete}
                                    onClose={handleDeleteClose}
                                    PaperComponent={PaperComponent}
                                    aria-labelledby="draggable-dialog-title"
                                >
                                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                                        <Typography className="dialogTitle" gutterBottom variant="h6" component="h2">
                                            Delete coupon
                                        </Typography>
                                    </DialogTitle>

                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to delete coupon id - {coupon.id} ?
                                        </DialogContentText>
                                    </DialogContent>

                                    <DialogActions>
                                        <Button autoFocus className="dialogOk" variant="contained" color="secondary" onClick={handleDeleteClose}>
                                            Cancel
                                        </Button>
                                        <Button className="dialogOk" variant="contained" color="primary" onClick={() => deleteCoupon(coupon.id)}>Delete</Button>
                                    </DialogActions>

                                </Dialog>
                            </ButtonGroup>
                        </div>
                    }

                    {store.getState().authState.user?.clientType !== 'COMPANY' &&
                        <div>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                                <Button color="primary" onClick={yourSpace}>
                                    Your Space
                                </Button>

                                <Button color="primary" onClick={toMain}>
                                    To Main
                                </Button>

                                {/* <Button onClick={() => purchaseCoupon(ofAllCoupon)}>Purchase</Button> */}
                                <Button onClick={handleClickOpen}>
                                    Purchase
                                </Button>

                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    PaperComponent={PaperComponent}
                                    aria-labelledby="draggable-dialog-title"
                                >
                                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                                        <Typography className="dialogTitle" gutterBottom variant="h6" component="h2">
                                            Purchase coupon
                                        </Typography>
                                    </DialogTitle>

                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to add coupon id - {id} ?
                                        </DialogContentText>
                                    </DialogContent>

                                    <DialogActions>
                                        <Button autoFocus className="dialogOk" variant="contained" color="secondary" onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button className="dialogOk" variant="contained" color="primary" onClick={() => purchaseCoupon(ofAllCoupon)}>Purchase</Button>
                                    </DialogActions>

                                </Dialog>
                            </ButtonGroup>
                        </div>
                    }

                </CardActions>

            </Card>

        </div>
    );
}

export default CouponDetails;