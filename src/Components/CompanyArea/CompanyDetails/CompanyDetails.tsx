import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CompanyModel from "../../../Models/CompanyModel";
import { companiesDeletedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg } from "../../../Service/Notification";
import "./CompanyDetails.css";

interface CompanyProps {
    company: CompanyModel;
}

const useStyles = makeStyles({
    root: {
        width: 300,
    },
    media: {
        height: 110,
    },
});

function CompanyDetails(_props: CompanyProps): JSX.Element {

    const history = useHistory();
    const classes = useStyles();
    const prop1 = { ..._props.company }

    const [company, setCompany] = useState(
        store.getState().companiesState.companies.find((c) => c.id === _props.company.id)
    );

    useEffect(() => {
        let subscription: Unsubscribe;

        subscription = store.subscribe(() => {
            setCompany(store.getState().companiesState.companies.find((c) => c.id === _props.company.id));
        });

        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setCompany(store.getState().companiesState.companies.find((c) => c.id === _props.company.id));
                });
            }
            unsubscribe();
        };
    });

    async function deleteCompany(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete company id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.admin + "companies/" + id);
                store.dispatch(companiesDeletedAction(id)); // updating AppState (global state)
            } catch (err) {
                notify.error(ErrMsg.ERROR_DELETING_COMPANY);
                notify.error(err);
            }
        }
    }

    function toUpdate() {
        history.push("/update-company-details/" + company.id);
    }

    return (
        <div className="CompanyDetails">

            <Card className={classes.root}>

                <NavLink className="navLink" to={"/company-card-details/" + company.id} exact>

                    <CardActionArea>

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
                                Email: <br /> {company.email}
                            </Typography>

                        </CardContent>

                    </CardActionArea>

                </NavLink>

                <CardActions>
                    <p>Operations:</p> <br />
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={toUpdate}>
                            {/* <NavLink className="link" to={"/update-company-details/" + prop1.id}>
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

export default CompanyDetails;
