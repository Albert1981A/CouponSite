import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CustomerModel from "../../../Models/CustomerModel";
import { customersDeletedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import "./CustomerDetails.css";

interface CustomerProps {
    customer: CustomerModel;
}

const useStyles = makeStyles({
    root: {
        width: 300,
    },
    media: {
        height: 110,
    },
});

function CustomerDetails(_props: CustomerProps): JSX.Element {

    const history = useHistory();
    const classes = useStyles();
    const prop1 = { ..._props.customer }

    const [customer, setCustomer] = useState(
        store.getState().customersState.customers.find((c) => c.id === _props.customer.id)
    );

    useEffect(() => {
        let subscription: Unsubscribe;

        subscription = store.subscribe(() => {
            setCustomer(store.getState().customersState.customers.find((c) => c.id === _props.customer.id));
        });

        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setCustomer(store.getState().customersState.customers.find((c) => c.id === _props.customer.id));
                });
            }
            unsubscribe();
        };
    });

    async function deleteCustomer(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete customer id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.admin + "customers/" + id);
                store.dispatch(customersDeletedAction(id)); 
            } catch (err) {
                notify.error(ErrMsg.ERROR_DELETING_CUSTOMER);
                notify.error(err);
            }
        }
    }

    function toUpdate() {
        history.push("/update-customer-details/" + customer.id);
    }

    return (
        <div className="CustomerDetails">
			
            <Card className={classes.root}>

                <NavLink className="navLink" to={"/customer-card-details/" + customer.id} exact>

                    <CardActionArea>

                        <CardMedia
                            className={classes.media}
                            image={`${process.env.PUBLIC_URL}/assets/images/customer/customer.png`}
                            title="Customer details"
                        />

                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h2">
                                Customer ID: {customer.id}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" component="p">
                                First name: {customer.firstName} <br />
                                Last name: {customer.lastName} <br />
                                Email:  &nbsp; {customer.email}
                            </Typography>

                        </CardContent>

                    </CardActionArea>

                </NavLink>

                <CardActions>
                    <p>Operations:</p>
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={toUpdate}>
                            {/* <NavLink className="link" to={"/update-customer-details/" + prop1.id}>
                                Update
                            </NavLink> */}
                            Update
                        </Button>

                        <Button onClick={() => deleteCustomer(customer.id)}>
                            Delete
                        </Button>
                        
                    </ButtonGroup>
                </CardActions>

            </Card>
            
        </div>
    );
}

export default CustomerDetails;
