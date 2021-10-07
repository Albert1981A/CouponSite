import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, PaperProps, Typography } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { NavLink, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CustomerModel from "../../../Models/CustomerModel";
import { customersDeletedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
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

function CustomerDetails(_props: CustomerProps): JSX.Element {

    const history = useHistory();
    const classes = useStyles();
    const prop1 = { ..._props.customer }

    const [customer, setCustomer] = useState(
        store.getState().customersState.customers.find((c) => c.id === _props.customer.id)
    );

    // useEffect(() => {
    //     let subscription: Unsubscribe;

    //     subscription = store.subscribe(() => {
    //         setCustomer(store.getState().customersState.customers.find((c) => c.id === _props.customer.id));
    //     });

    //     return () => {
    //         function unsubscribe() {
    //             subscription = store.subscribe(() => {
    //                 setCustomer(store.getState().customersState.customers.find((c) => c.id === _props.customer.id));
    //             });
    //         }
    //         unsubscribe();
    //     };
    // });

    const [openDelete, setOpenDelete] = React.useState(false);

    const handleDeleteClickOpen = () => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (store.getState().authState.user?.clientType !== "ADMINISTRATOR") {
            notify.error(ErrMsg.ONLY_ADMIN_ALLOWED);
        } else if (!store.getState().customersState.customers.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.NO_CUSTOMER_BY_THIS_ID);
        } else {
            setOpenDelete(true);
        }
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    async function deleteCustomer(id: number): Promise<void> {
        setOpenDelete(false);
        // const result = window.confirm("Are you sure you want to delete customer id - " + id + "?");
        // if (result) {
        try {
            const response = await tokenAxios.delete<any>(globals.urls.admin + "customers/" + id);
            store.dispatch(customersDeletedAction(id));
            setCustomer(store.getState().customersState.customers.find((c) => c.id === _props.customer.id));
            notify.success(SccMsg.DELETED);
        } catch (err: any) {
            notify.error(ErrMsg.ERROR_DELETING_CUSTOMER);
            notify.error(err);
        }
        // }
    }

    function toUpdate() {
        history.push("/update-customer-details/" + customer.id);
    }

    function navTo() {
        history.push("/customer-card-details/" + customer.id);
    }

    return (
        <div className="CustomerDetails">

            <Card className={classes.root}>

                {/* <NavLink className="navLink" to={"/customer-card-details/" + customer.id} exact> */}

                    <CardActionArea onClick={navTo}>

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

                {/* </NavLink> */}

                <CardActions>
                    <p>Operations:</p>
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={toUpdate}>
                            Update
                        </Button>

                        {/* <Button onClick={() => deleteCustomer(customer.id)}>Delete</Button> */}
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
                                    Delete customer
                                </Typography>
                            </DialogTitle>

                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete customer id - {customer.id} ?
                                </DialogContentText>
                            </DialogContent>

                            <DialogActions>
                                <Button autoFocus className="dialogOk" variant="contained" color="secondary" onClick={handleDeleteClose}>
                                    Cancel
                                </Button>
                                <Button className="dialogOk" variant="contained" color="primary" onClick={() => deleteCustomer(customer.id)}>Delete</Button>
                            </DialogActions>

                        </Dialog>

                    </ButtonGroup>
                </CardActions>

            </Card>

        </div>
    );
}

export default CustomerDetails;
