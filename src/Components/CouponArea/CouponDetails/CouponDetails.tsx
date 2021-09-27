import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";
import { Component, useEffect, useState } from "react";
import { NavLink, RouteComponentProps, useHistory, useParams } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";
import CouponModel from "../../../Models/CouponModel";
import { couponsAddedAction, couponsDeletedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
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


    async function deleteCoupon(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete coupon id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.company + "coupons/" + id);
                store.dispatch(couponsDeletedAction(id)); // updating AppState (global state)
                history.push("/company-coupons");
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_DELETING_COUPON);
                notify.error(err);
            }
        }
    }

    console.log(coupon);

    async function purchaseCoupon(coupon: CouponModel): Promise<void> {
        if (store.getState().authState.user?.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
        } else if (store.getState().couponsState.coupons.find((c) => c.id === id)) {
            notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
        } else {
            const result = window.confirm("Are you sure you want to add coupon id - " + id + "?");
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
                            image={`${process.env.PUBLIC_URL}/assets/images/` + ofAllCoupon.image}
                            title="Contemplative Reptile"
                        />

                        <CardContent>
                            <Typography className="Typography1" gutterBottom variant="h6" component="h2">
                                Company ID: {ofAllCoupon.companyID} <br />
                                {ofAllCoupon.title}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" component="p">
                                Coupon ID: &nbsp; {ofAllCoupon.id} <br />
                                Category: <br /> {ofAllCoupon.category} <br />
                                Description: &nbsp; {ofAllCoupon.description} <br />
                                Amount: &nbsp; {ofAllCoupon.amount} <br />
                                Start-Date: &nbsp; {moment(ofAllCoupon.startDate).format('D/M/YYYY')} <br />
                                End-Date: &nbsp; {moment(ofAllCoupon.endDate).format('D/M/YYYY')} <br />
                                Price: &nbsp; {ofAllCoupon.price}
                            </Typography>

                        </CardContent>

                    </CardActionArea>
                }

                <CardActions>

                    {store.getState().authState.user?.clientType === 'COMPANY' &&
                        store.getState().couponsState.coupons.find((c) => c.id === coupon.id) &&
                        <div>
                            <p>Operations:</p> <br />
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                                <Button color="primary" onClick={yourSpace}>
                                    {/* <NavLink className="linkTo" to={routeTo}>
                                        Your Space
                                    </NavLink> */}
                                    Your Space
                                </Button>

                                <Button color="primary" onClick={toMain}>
                                    {/* <NavLink className="linkTo" to={routeTo}>
                                        Your Space
                                    </NavLink> */}
                                    To Main
                                </Button>

                                <Button color="primary" onClick={toUpdate}>
                                    {/* <NavLink className="link" to={"/update-company-coupon/" + ofAllCoupon.id}>
                                        Update
                                    </NavLink> */}
                                    Update
                                </Button>

                                <Button onClick={() => deleteCoupon(ofAllCoupon.id)}>
                                    Delete
                                </Button>

                            </ButtonGroup>
                        </div>
                    }

                    {store.getState().authState.user?.clientType !== 'COMPANY' &&
                        <div>
                            <p>Operations:</p> <br />
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                                <Button color="primary" onClick={yourSpace}>
                                    {/* <NavLink className="linkTo" to={routeTo}>
                                        Your Space
                                    </NavLink> */}
                                    Your Space
                                </Button>

                                <Button color="primary" onClick={toMain}>
                                    {/* <NavLink className="linkTo" to={routeTo}>
                                        Your Space
                                    </NavLink> */}
                                    To Main
                                </Button>

                                <Button onClick={() => purchaseCoupon(ofAllCoupon)}>
                                    Purchase
                                </Button>

                            </ButtonGroup>
                        </div>
                    }

                </CardActions>

            </Card>

        </div>
    );
}

export default CouponDetails;