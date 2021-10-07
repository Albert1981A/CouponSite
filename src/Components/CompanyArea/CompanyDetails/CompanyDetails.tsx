import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, Paper, PaperProps, Typography } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { NavLink, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CompanyModel from "../../../Models/CompanyModel";
import { companiesDeletedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
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

function CompanyDetails(_props: CompanyProps): JSX.Element {

    const history = useHistory();
    const classes = useStyles();
    const prop1 = { ..._props.company }

    const [company, setCompany] = useState(
        store.getState().companiesState.companies.find((c) => c.id === _props.company.id)
    );

    // useEffect(() => {
    //     let subscription: Unsubscribe;

    //     subscription = store.subscribe(() => {
    //         setCompany(store.getState().companiesState.companies.find((c) => c.id === _props.company.id));
    //     });

    //     return () => {
    //         function unsubscribe() {
    //             subscription = store.subscribe(() => {
    //                 setCompany(store.getState().companiesState.companies.find((c) => c.id === _props.company.id));
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
            notify.error(ErrMsg.ONLY_COMPANY_ALLOWED);
        } else if (!store.getState().companiesState.companies.find((c) => c.id === prop1.id)) {
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
            store.dispatch(companiesDeletedAction(id));
            setCompany(store.getState().companiesState.companies.find((c) => c.id === _props.company.id));
            notify.success(SccMsg.DELETED);
        } catch (err: any) {
            notify.error(ErrMsg.ERROR_DELETING_COMPANY);
            notify.error(err);
        }
        // }
    }

    function toUpdate() {
        history.push("/update-company-details/" + company.id);
    }

    function navTo() {
        history.push("/company-card-details/" + company.id);
    }

    return (
        <div className="CompanyDetails">

            <Card className={classes.root}>

                {/* <NavLink className="navLink" to={"/company-card-details/" + company.id} exact> */}

                    <CardActionArea onClick={navTo}>

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

                {/* </NavLink> */}

                <CardActions>
                    <p>Operations:</p> <br />
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                        <Button color="primary" onClick={toUpdate}>
                            Update
                        </Button>

                        {/* <Button onClick={() => deleteCompany(company.id)}>Delete</Button> */}
                        <Button onClick={handleDeleteClickOpen}>Delete</Button>

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

export default CompanyDetails;
