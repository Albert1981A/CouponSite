import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
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

    async function deleteCompany(id: number): Promise<void> {
        const result = window.confirm("Are you sure you want to delete company id - " + id + "?");
        if (result) {
            try {
                const response = await tokenAxios.delete<any>(globals.urls.admin + "companies/" + id);
                store.dispatch(companiesDeletedAction(id)); // updating AppState (global state)
                // history.push("/admin-companies");
            } catch (err) {
                // alert(err.message);
                notify.error(ErrMsg.ERROR_DELETING_COMPANY);
                notify.error(err);
            }
        }
    }

    function toUpdate() {
        history.push("/update-company-details/" + prop1.id);
    }

    return (
        <div className="CompanyDetails">

            <Card className={classes.root}>

                <NavLink className="navLink" to={"/company-card-details/" + prop1.id} exact>

                    <CardActionArea>

                        <CardMedia
                            className={classes.media}
                            image={`${process.env.PUBLIC_URL}/assets/images/` + prop1.name + '.jpg'}
                            title="Company details"
                        />


                        <CardContent>
                            <Typography gutterBottom variant="h6" component="h2">
                                Name: {prop1.name} <br />
                                ID: {prop1.id}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" component="p">
                                Email: <br /> {prop1.email}
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

                        <Button onClick={() => deleteCompany(prop1.id)}>
                            Delete
                        </Button>
                    </ButtonGroup>
                </CardActions>

            </Card>

        </div>
    );
}

export default CompanyDetails;
