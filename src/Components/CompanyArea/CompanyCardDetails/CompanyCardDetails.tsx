import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { NavLink, RouteComponentProps, useHistory, useParams } from "react-router-dom";
import { companiesDeletedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import "./CompanyCardDetails.css";

interface RouteParams {
    id: string;
}

interface CompanyCardDetailsProps extends RouteComponentProps<RouteParams> { }

const useStyles = makeStyles({
    root: {
        width: 300,
    },
    media: {
        height: 110,
    },
});

function CompanyCardDetails(props: CompanyCardDetailsProps): JSX.Element {

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
    const [company, setCompany] = useState(
        store.getState().companiesState.companies.find((c) => c.id === id)
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

    async function deleteCompany(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete company id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.admin + "companies/" + id);
                store.dispatch(companiesDeletedAction(id)); // updating AppState (global state)
                history.push("/admin-companies");
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_DELETING_COMPANY);
                notify.error(err);
            }
        }
    }

    function goBack() {
        history.goBack();
    }

    function goToUpdate() {
        history.push("/update-company-details/" + company.id);
    }

    return (
        <div className="CompanyCardDetails">

            <Card className={classes.root}>

                {/* <NavLink className="navLink" to={"/company-card-details/" + company.id} exact> */}

                <CardActionArea className="navLink3">

                    <CardMedia
                        className={classes.media}
                        image={`${process.env.PUBLIC_URL}/assets/images/` + company.name + '.jpg'}
                        title="Company details"
                    />


                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            Name: {company.name} <br />
                            ID: {company.id}
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            Email:  &nbsp; {company.email}
                        </Typography>

                    </CardContent>

                </CardActionArea>

                {/* </NavLink> */}

                <CardActions>
                    <p>Operations:</p> <br />
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={goBack}>
                            {/* <NavLink className="link" to={routeTo}>
                                Go Back
                            </NavLink> */}
                            Back
                        </Button>

                        <Button color="primary" onClick={goToUpdate}>
                            {/* <NavLink className="link" to={"/update-company-details/" + company.id}>
                                Update
                            </NavLink> */}
                            Update
                        </Button>

                        <Button onClick={() => deleteCompany(company.id)}>
                            Delete
                        </Button>

                    </ButtonGroup>
                </CardActions>

            </Card>

        </div>
    );
}

export default CompanyCardDetails;
