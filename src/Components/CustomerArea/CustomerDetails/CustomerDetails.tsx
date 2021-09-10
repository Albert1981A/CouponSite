import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
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

    const classes = useStyles();
    const prop1 = { ..._props.customer }

    async function deleteCustomer(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete customer id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.admin + "customers/" + id);
                store.dispatch(customersDeletedAction(id)); // updating AppState (global state)
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_OCCURRED_WHILE_DELETING_CUSTOMER);
                notify.error(err);
            }
        }
    }

    return (
        <div className="CustomerDetails">
			
            <Card className={classes.root}>

                <NavLink className="navLink" to={"/customer-card-details/" + prop1.id} exact>

                    <CardActionArea>

                        <CardMedia
                            className={classes.media}
                            image={`${process.env.PUBLIC_URL}/assets/images/customer/customer.png`}
                            title="Company details"
                        />

                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h2">
                                Customer ID: {prop1.id}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" component="p">
                                First name: {prop1.firstName} <br />
                                Last name: {prop1.lastName} <br />
                                Email:  &nbsp; {prop1.email}
                            </Typography>

                        </CardContent>

                    </CardActionArea>

                </NavLink>

                <CardActions>
                    <p>Operations:</p>
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary">
                            <NavLink className="link" to={"/update-customer-details/" + prop1.id}>
                                Update Customer
                            </NavLink>
                        </Button>

                        <Button onClick={() => deleteCustomer(prop1.id)}>Delete Customer</Button>
                    </ButtonGroup>
                </CardActions>

            </Card>
            
        </div>
    );
}

export default CustomerDetails;
