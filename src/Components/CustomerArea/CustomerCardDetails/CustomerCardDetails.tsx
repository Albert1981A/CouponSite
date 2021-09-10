import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { NavLink, RouteComponentProps, useHistory, useParams } from "react-router-dom";
import { customersDeletedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import "./CustomerCardDetails.css";

interface RouteParams {
    id: string;
}

interface CustomerCardDetailsProps extends RouteComponentProps<RouteParams> { }

const useStyles = makeStyles({
    root: {
        width: 300,
    },
    media: {
        height: 110,
    },
});

function CustomerCardDetails(props: CustomerCardDetailsProps): JSX.Element {

    const params = useParams<RouteParams>();
    // console.log("first: " + params.id);
    const id = + props.match.params.id
    // console.log("second: " + id);
    const history = useHistory();

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        }
    })

    // console.log(id);
    const [customer, setCustomer] = useState(
        store.getState().customersState.customers.find((c) => c.id === id)
    );

    const classes = useStyles();
    const clientType = store.getState().authState.user.clientType;

    let routeTo: string = null;

    if (clientType === "ADMINISTRATOR") {
        routeTo = "/admin-space";
    } else if (clientType === "CUSTOMER") {
        routeTo = "/customer-coupons";
    } else if (clientType === "COMPANY") {
        routeTo = "/company-coupons";
    }

    async function deleteCustomer(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete customer id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.admin + "customers/" + id);
                store.dispatch(customersDeletedAction(id)); // updating AppState (global state)
                history.push(routeTo);
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_OCCURRED_WHILE_DELETING_CUSTOMER);
                notify.error(err);
            }
        }
    }

    return (
        <div className="CustomerCardDetails">

            <Card className={classes.root}>

                {/* <NavLink className="navLink" to={"/customer-card-details/" + customer.id} exact> */}

                <CardActionArea className="navLink2">

                    <CardMedia
                        className={classes.media}
                        image={`${process.env.PUBLIC_URL}/assets/images/customer/customer.png`}
                        title="Company details"
                    />

                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            Customer ID: {customer.id}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            Customer first name: {customer.firstName}
                            Customer last name: {customer.lastName}
                            Customer email:  &nbsp; {customer.email}
                        </Typography>

                    </CardContent>

                </CardActionArea>

                {/* </NavLink> */}

                <CardActions>
                    <p>Operations:</p>
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary">
                            <NavLink className="link" to={routeTo}>
                                Go Back
                            </NavLink>
                        </Button>

                        <Button color="primary">
                            <NavLink className="link" to={"/update-customer-details/" + customer.id}>
                                Update Customer
                            </NavLink>
                        </Button>

                        <Button onClick={() => deleteCustomer(customer.id)}>Delete Customer</Button>
                    </ButtonGroup>
                </CardActions>

            </Card>

        </div>
    );
}

export default CustomerCardDetails;
