import { Box, Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
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

    // const [request, setRequest] = useState("");

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
            } catch (err) {
                // alert(err.message);
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
            notify.error(ErrMsg.ONLY_COMPANY_ALLOWED);
            history.push("/home");
        }

        let subscription: Unsubscribe;

        asyncCustomersFunction();
        subscription = store.subscribe(() => {
            setCustomers(store.getState().customersState.customers);
        });

        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setCustomers(store.getState().customersState.customers);
                });
            }
            unsubscribe();
        };
    });

    function GetAllCompanies() {
        // setRequest("Companies");
        history.push("/admin-companies");
    }

    function GetAllCustomers() {
        // setRequest("Customers");
        history.push("/admin-customers");
    }

    return (
        <div className="AdminCustomers">

            <div className="head2">
                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">Admin Customers &nbsp; &nbsp;</Box>
                </Typography>

                <div className="topButtonsGroup">
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={GetAllCompanies}>
                            All Companies
                        </Button>

                        <Button color="primary" onClick={GetAllCustomers}>
                            All Customers
                        </Button>

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
