import { Box, Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { SyntheticEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CustomerModel from "../../../Models/CustomerModel";
import { customersDownloadedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import CustomerDetails from "../../CustomerArea/CustomerDetails/CustomerDetails";
import EmptyView from "../../SharedArea/EmptyView/EmptyView";
import "./AdminCustomers.css";

function AdminCustomers(props: {}): JSX.Element {

    const history = useHistory();

    const [customers, setCustomers] = useState(
        store.getState().customersState.customers
    );

    async function asyncCustomersFunction() {
        if (customers.length === 0) {
            try {
                const response = await tokenAxios.get<CustomerModel[]>(globals.urls.admin + "customers");
                if (response.data.length !== 0) {
                    store.dispatch(customersDownloadedAction(response.data)); // updating AppState (global state)
                    setCustomers(store.getState().customersState.customers); // updating the local state
                }
            } catch (err: any) {
                notify.error(ErrMsg.ERROR_GETTING_CUSTOMERS);
                notify.error(err);
            }
        }
    }

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        } else if (store.getState().authState.user.clientType !== "ADMINISTRATOR") {
            notify.error(ErrMsg.ONLY_ADMIN_ALLOWED);
            history.push("/home");
        }

        asyncCustomersFunction();

        let subscription: Unsubscribe;
        subscription = store.subscribe(() => {
            setCustomers(store.getState().customersState.customers); // Will let us notify
        });
        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setCustomers(store.getState().customersState.customers); // Will let us notify
                });
            }
            unsubscribe();
        };
        // let unsubscribe: Unsubscribe;
        // unsubscribe = store.subscribe(() => {
        //     setCustomers(store.getState().customersState.customers); // Will let us notify
        // });
        // return () => {
        //     unsubscribe();
        // };
    });

    const [txt, setTxt] = useState<string>("");

    const insertId = (args: SyntheticEvent) => {
        // args        => information about the Event
        // args.target => the tag that raised the Event
        const value = (args.target as HTMLInputElement).value;
        setTxt(value);
    }

    async function getSingleCustomer() {
        if (!customers.find((c) => c.id === parseInt(txt))) {
            notify.error(ErrMsg.NO_COMPANY_BY_THIS_ID);
        } else {
            history.push("/customer-card-details/" + txt);
        }
    }

    function getAllCompanies() {
        history.push("/admin-companies");
    }

    function getAllCustomers() {
        history.push("/admin-customers");
    }

    function addCustomer() {
        history.push("/admin-add-customer");
    }

    return (
        <div className="AdminCustomers">

            <div className="head2">
                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">Admin Customers &nbsp; &nbsp;</Box>
                </Typography>

                <div className="topButtonsGroup">
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={getAllCompanies}>
                            All Companies
                        </Button>

                        <Button color="primary" onClick={getAllCustomers}>
                            All Customers
                        </Button>

                        <Button color="primary" onClick={addCustomer}>
                            Add Customer
                        </Button>

                        <Button color="primary" onClick={getSingleCustomer} value={txt}>
                            Get Single Customer by id:
                        </Button>

                        <input className="inputId" type="text" onChange={insertId} value={txt} />


                    </ButtonGroup>
                </div>
            </div>

            <br />

            <div className="CustomersDiv">
                    <Typography variant="h5" noWrap>
                        <Box className="head1" fontWeight="fontWeightMedium">ALL CUSTOMERS: &nbsp; &nbsp;</Box>
                    </Typography>
                    <Typography paragraph>
                        This section shows all the Customers.
                        You can add and remove Customers and you can also update the existing Customers.
                        Please note that it is not possible to add a Customers with the same email
                        to an existing Customer.
                        If an existing Customer is updated, The Customer id could not be updated.
                    </Typography>

                    <div className="cards Box">
                        <Grid container spacing={4}>
                            {customers.length === 0 && <EmptyView msg="No Coupon downloaded!" />}
                            {console.log(customers.map(c => c))}
                            {customers.length !== 0 && customers.map(c =>
                                <Grid item key={c.id} xs={12} sm={6} md={4}>
                                    <CustomerDetails key={c.id} customer={c} />
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </div>

        </div>
    );
}

export default AdminCustomers;
