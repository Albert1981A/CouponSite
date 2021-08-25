import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import moment from "moment";
import { Component, useEffect, useState } from "react";
import { NavLink, RouteComponentProps, useHistory, useParams } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { couponsDeletedAction } from "../../../Redux/CouponsState";
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

    const params = useParams<RouteParams>();
    console.log("first: " + params.id);
    const id = + props.match.params.id
    console.log("second: " +id);
    const history = useHistory();
    
    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        }
    })

    console.log(id);
    const [coupon, setCompany] = useState(
        store.getState().couponsState.coupons.find((c) => c.id === id)
    );

    

    const classes = useStyles();
    console.log("start Date: " + coupon.startDate);
    console.log("start Date: " + moment(coupon.startDate).format('D/M/YYYY'));
    const startDate = moment(coupon.startDate).format('D/M/YYYY');
    const endDate = moment(coupon.endDate).format('D/M/YYYY');
    const clientType = store.getState().authState.user.clientType;

    let routeTo: string = null;

    if (clientType === "COMPANY") {
        routeTo = "/company-coupons";
    } else if (clientType === "CUSTOMER") {
        routeTo = "/customer-coupons";
    }

    async function deleteCoupon(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete cat id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.company + "coupons/" + id);
                store.dispatch(couponsDeletedAction(id)); // updating AppState (global state)
            } catch (err) {
                alert(err.message);
            }
        }
    }

    console.log(coupon);


    return (
        <div className="CouponDetails">
            <Card className={classes.root}>

                <CardActionArea>

                    <CardMedia
                        className={classes.media}
                        image={`${process.env.PUBLIC_URL}/assets/images/` + coupon.image}
                        title="Contemplative Reptile"
                    />


                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            Company ID: {coupon.companyID} <br />
                            {coupon.title}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            Category: <br /> {coupon.category} <br />
                            Description: &nbsp; {coupon.description} <br />
                            Amount: &nbsp; {coupon.amount} <br />
                            Start-Date: &nbsp; {coupon.startDate} <br />
                            End-Date: &nbsp; {coupon.endDate} <br />
                            Price: &nbsp; {coupon.price}
                        </Typography>

                    </CardContent>

                </CardActionArea>

                <CardActions>
                    <p>Operations:</p>
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <NavLink className="link" to={routeTo}>
                            <Button color="primary">
                                Go Back
                            </Button>
                        </NavLink>

                        <Button onClick={() => deleteCoupon(coupon.id)}>Delete</Button>
                    </ButtonGroup>
                </CardActions>

            </Card>

        </div>
    );


}

export default CouponDetails;