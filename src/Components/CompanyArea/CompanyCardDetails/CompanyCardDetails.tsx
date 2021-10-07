import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, PaperProps, Typography } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { NavLink, RouteComponentProps, useHistory, useParams } from "react-router-dom";
import { companiesDeletedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
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

    const [openDelete, setOpenDelete] = React.useState(false);

    const handleDeleteClickOpen = () => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (store.getState().authState.user?.clientType !== "ADMINISTRATOR") {
            notify.error(ErrMsg.ONLY_ADMIN_ALLOWED);
        } else if (!store.getState().companiesState.companies.find((c) => c.id === id)) {
            notify.error(ErrMsg.NO_COMPANY_BY_THIS_ID);
        } else {
            setOpenDelete(true);
        }
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    async function deleteCompany(id: number): Promise<void> {
        setOpenDelete(false);
        // const result = window.confirm("Are you sure you want to delete company id - " + id + "?");
        // if (result) {
        try {
            const response = await tokenAxios.delete<any>(globals.urls.admin + "companies/" + id);
            store.dispatch(companiesDeletedAction(id)); // updating AppState (global state)
            history.push("/admin-companies");
            notify.success(SccMsg.DELETED);
        } catch (err: any) {
            notify.error(ErrMsg.ERROR_DELETING_COMPANY);
            notify.error(err);
        }
        // }
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


                <CardActions>
                    <p>Operations:</p> <br />
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={goBack}>
                            Back
                        </Button>

                        <Button color="primary" onClick={goToUpdate}>
                            Update
                        </Button>

                        {/* <Button onClick={() => deleteCompany(company.id)}> */}
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
                                    Delete company
                                </Typography>
                            </DialogTitle>

                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete company id - {company.id} ?
                                </DialogContentText>
                            </DialogContent>

                            <DialogActions>
                                <Button autoFocus className="dialogOk" variant="contained" color="secondary" onClick={handleDeleteClose}>
                                    Cancel
                                </Button>
                                <Button className="dialogOk" variant="contained" color="primary" onClick={() => deleteCompany(company.id)}>Delete</Button>
                            </DialogActions>

                        </Dialog>

                    </ButtonGroup>
                </CardActions>

            </Card>

        </div>
    );
}

export default CompanyCardDetails;
