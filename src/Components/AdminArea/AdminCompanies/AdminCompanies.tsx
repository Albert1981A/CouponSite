import { Box, Button, ButtonGroup, Grid, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CompanyModel from "../../../Models/CompanyModel";
import { companiesDownloadedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import CompanyDetails from "../../CompanyArea/CompanyDetails/CompanyDetails";
import EmptyView from "../../SharedArea/EmptyView/EmptyView";
import "./AdminCompanies.css";

function AdminCompanies(props: {}): JSX.Element {

    const history = useHistory();

    // const [request, setRequest] = useState("");

    const [companies, setCompanies] = useState(
        store.getState().companiesState.companies
    );

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
                notify.error(ErrMsg.ERROR_GETTING_COMPANIES);
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

        asyncCompanyFunction();
        subscription = store.subscribe(() => {
            setCompanies(store.getState().companiesState.companies);
        });

        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setCompanies(store.getState().companiesState.companies);
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
        <div className="AdminCompanies">

            <div className="head2">
                <Typography variant="h5" noWrap>
                    <Box className="head1" fontWeight="fontWeightMedium">Admin Companies &nbsp; &nbsp;</Box>
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

        </div>
    );
}

export default AdminCompanies;
