import { Box, Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { Component, SyntheticEvent, useEffect, useState } from "react";
import { Subscription } from "react-hook-form/dist/utils/Subject";
import { useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CompanyModel from "../../../Models/CompanyModel";
import CustomerModel from "../../../Models/CustomerModel";
import { companiesDownloadedAction } from "../../../Redux/CompaniesState";
import { customersDownloadedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import CompanyDetails from "../../CompanyArea/CompanyDetails/CompanyDetails";
import CustomerDetails from "../../CustomerArea/CustomerDetails/CustomerDetails";
import EmptyView from "../../SharedArea/EmptyView/EmptyView";
import "./AdminSpace.css";

function AdminSpace(props: {}): JSX.Element {

    // let request: string = "Customers";
    // let unsubscribe: Unsubscribe;
    const history = useHistory();

    const [request, setRequest] = useState("");

    const [companies, setCompanies] = useState(
        store.getState().companiesState.companies
    );

    const [customers, setCustomers] = useState(
        store.getState().customersState.customers
    );

    function GetAllCompanies() {
        setRequest("Companies");
    }

    function GetAllCustomers() {
        setRequest("Customers");
    }

    async function asyncCompanyFunction() {
        if (companies.length === 0) {
            try {
                const response = await tokenAxios.get<CompanyModel[]>(globals.urls.admin + "companies");
                console.log(response.data);
                if (response.data.length !== 0) {
                    store.dispatch(companiesDownloadedAction(response.data)); // updating AppState (global state)
                    setCompanies(store.getState().companiesState.companies); // updating the local state
                }
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_OCCURRED_WHILE_GETTING_COMPANIES);
            }
        }
    }

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
                notify.error(ErrMsg.ERROR_OCCURRED_WHILE_GETTING_CUSTOMERS);
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
        
        let subscription1: Unsubscribe;
        let subscription2: Unsubscribe;

        if (request.match("Companies")) {
            asyncCompanyFunction();
            subscription1 = store.subscribe(() => {
                setCompanies(store.getState().companiesState.companies);
            });
        } else if (request.match("Customers")) {
            asyncCustomersFunction();
            subscription2 = store.subscribe(() => {
                setCustomers(store.getState().customersState.customers);
            });
        }
        return () => {
            function unsubscribe() {
                subscription1 = store.subscribe(() => {
                    setCompanies(store.getState().companiesState.companies);
                });
                subscription2 = store.subscribe(() => {
                    setCustomers(store.getState().customersState.customers);
                });
            }
            unsubscribe();
        };
    });

    // useEffect(() => {
    //     return () => {
    //         unsubscribe();
    //         console.log('Bye');
    //     };
    // });

    return (
        <div className="AdminSpace">

            <div className="head2">
                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">Admin Space &nbsp; &nbsp;</Box>
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

            {/* {request === "" &&
                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">PLEASE CHOOSE COMPANIES OR CUSTOMERS: &nbsp; &nbsp;</Box>
                </Typography> 
            } */}

            {request.match("Companies") &&
                <div className="companiesDiv">
                    <Typography variant="h5" noWrap>
                        <Box className="head1" fontWeight="fontWeightMedium">ALL COMPANIES: &nbsp; &nbsp;</Box>
                    </Typography>
                    <Typography paragraph>
                        This section shows all the companies.
                        You can add and remove companies and you can also update the existing companies.
                        Please note that it is not possible to add a company with the same name or email
                        to an existing company.
                        If an existing company is updated, The company id could not be updated.
                        Also, you cannot update the company name.
                    </Typography>

                    <div className="cards Box">
                        <Grid container spacing={4}>
                            {companies.length === 0 && <EmptyView msg="No Coupon downloaded!" />}
                            {console.log(companies.map(c => c))}
                            {companies.length !== 0 && companies.map(c =>
                                <Grid item key={c.id} xs={12} sm={6} md={4}>
                                    <CompanyDetails key={c.id} company={c} />
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </div>
            }

            {request.match("Customers") &&
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
            }



        </div>
    );

}

export default AdminSpace;
