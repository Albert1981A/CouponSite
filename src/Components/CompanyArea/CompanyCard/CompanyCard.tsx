import "./CompanyCard.css";
import React, { Component, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, PaperProps } from "@material-ui/core";
import CouponModel from "../../../Models/CouponModel";
import CompanyModel from "../../../Models/CompanyModel";
import { DateRangeRounded } from "@material-ui/icons";
import moment from 'moment'
import axios from "axios";
import globals from "../../../Service/Globals";
import { allCouponsDeletedAction, couponsAddedAction, couponsDeletedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import tokenAxios from "../../../Service/InterceptorAxios";
import { NavLink, useHistory } from "react-router-dom";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";
import Draggable from "react-draggable";

interface CardProps {
    coupon: CouponModel;
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

function CompanyCard(_props: CardProps): JSX.Element {

    const classes = useStyles();
    const prop1 = { ..._props.coupon }
    const startDate = moment(prop1.startDate).format('D/M/YYYY');
    const endDate = moment(prop1.endDate).format('D/M/YYYY');
    const history = useHistory();
    const [user, setUser] = useState(
        store.getState().authState.user
    );

    const [coupon, setCoupon] = useState(
        store.getState().couponsState.allCoupons.find(c => c.id === _props.coupon.id)
    );

    // const [ company, setCompany ] = useState<CompanyModel>( null );

    // async function asyncCompanyFunction() {
    //     if (company === null) {
    //         try {
    //             const response = await tokenAxios.get<CompanyModel>(globals.urls.admin + "companies/" + prop1.companyID);
    //             console.log(response.data);
    //             if (response.data !== null) {
    //                 // store.dispatch(companiesDownloadedAction(response.data)); 
    //                 setCompany(response.data); 
    //             }
    //         } catch (err: any) {
    //             notify.error(ErrMsg.ERROR_GETTING_COMPANIES);
    //             notify.error(err);
    //         }
    //     }
    // }

    useEffect(() => {
        let subscription: Unsubscribe;

        subscription = store.subscribe(() => {
            setCoupon(store.getState().couponsState.allCoupons.find(c => c.id === _props.coupon.id));
        });

        return () => {
            function unsubscribe() {
                subscription = store.subscribe(() => {
                    setCoupon(store.getState().couponsState.allCoupons.find(c => c.id === _props.coupon.id));
                });
            }
            unsubscribe();
        };
    });

    const [openDelete, setOpenDelete] = React.useState(false);

    const handleDeleteClickOpen = () => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (store.getState().authState.user?.clientType !== "COMPANY") {
            notify.error(ErrMsg.ONLY_COMPANY_ALLOWED);
        } else if (!store.getState().couponsState.coupons.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.COMPANY_NOT_OWN_THIS_COUPON);
        } else {
            setOpenDelete(true);
        }
    };

    const handleDeleteClose = () => {
        setOpenDelete(false);
    };

    async function deleteCoupon(id: number): Promise<void> {
        setOpenDelete(false);
        // const result = window.confirm("Are you sure you want to delete coupon id - " + id + "?");
        // if (result) {
        try {
            const response = await tokenAxios.delete<any>(globals.urls.company + "coupons/" + id);
            store.dispatch(couponsDeletedAction(id));
            store.dispatch(allCouponsDeletedAction(id));
            notify.success(SccMsg.DELETED);
        } catch (err: any) {
            notify.error(ErrMsg.ERROR_GETTING_COUPONS);
            notify.error(err);
        }
        // }
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        } else if (store.getState().authState.user?.clientType !== "CUSTOMER") {
            notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
        } else if (store.getState().couponsState.coupons.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function purchaseCoupon(coupon: CouponModel): Promise<void> {
        setOpen(false);
        // if (!store.getState().authState.user) {
        //     notify.error(ErrMsg.PLS_LOGIN);
        //     history.push("/login")
        // } else if (store.getState().authState.user?.clientType !== "CUSTOMER") {
        //     notify.error(ErrMsg.ONLY_CUSTOMER_ALLOWED);
        // } else if (store.getState().couponsState.coupons.find((c) => c.id === prop1.id)) {
        //     notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
        // } else {
        try {
            const response = await tokenAxios.post<CouponsModel>(globals.urls.customer + "coupons", coupon);
            console.log(response.data);
            store.dispatch(couponsAddedAction(response.data));
            notify.success(SccMsg.PURCHASE_SUCCESS);
            history.push("/customer-coupons");
        } catch (err: any) {
            notify.error(ErrMsg.ERROR_PURCHASING_COUPON);
            notify.error(err);
        }
        // }
    }

    function navTo() {
        if (store.getState().authState.user?.clientType === "COMPANY" && !store.getState().couponsState.coupons?.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.NOT_YOUR_COUPON);
        } else if (store.getState().authState.user?.clientType === "CUSTOMER" && store.getState().couponsState.coupons?.find((c) => c.id === prop1.id)) {
            notify.error(ErrMsg.ALREADY_OWN_THIS_COUPON);
            history.push("/company-coupon-details/" + prop1.id)
        } else {
            history.push("/company-coupon-details/" + prop1.id)
        }
    }

    return (
        <div className="CompanyCard">
            <Card className={classes.root}>

                <CardActionArea onClick={navTo}>

                    <CardMedia
                        className={classes.media}
                        // image={`${process.env.PUBLIC_URL}/assets/images/` + prop1.image}
                        image={globals.urls.company + "images/company-id/" + prop1.companyID}
                        title="Company Coupon"
                    />

                    <CardContent>
                        <Typography className="Typography1" gutterBottom variant="h6" component="h2">
                            Company ID: <span className="spanGetDetails">{prop1.companyID}</span> <br />
                        </Typography>

                        <Typography variant="body2" color="textSecondary" component="p">
                            Coupon Id:  &nbsp; <span className="spanGetDetails">{prop1.id}</span> <br />
                            Title: &nbsp; <span className="spanGetDetails">{prop1.title}</span> <br />
                            Description: &nbsp; <span className="spanGetDetails">{prop1.description}</span> <br />
                            Amount: &nbsp; <span className="spanGetDetails">{prop1.amount}</span> <br />
                            Start-Date: &nbsp; <span className="spanGetDetails">{startDate}</span> <br />
                            End-Date: &nbsp; <span className="spanGetDetails">{endDate}</span> <br />
                            Price: &nbsp; <span className="spanGetDetails">{prop1.price}</span> <br />
                            Category: <br /> <span className="spanGetDetails">{prop1.category}</span>
                        </Typography>

                    </CardContent>

                </CardActionArea>


                <CardActions>

                    {!user &&
                        <div>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                                {/* <Button onClick={() => purchaseCoupon(prop1)}>Purchase</Button> */}
                                <Button onClick={handleClickOpen}>Purchase</Button>
                            </ButtonGroup>
                        </div>
                    }

                    {(user?.clientType === 'COMPANY') &&
                        store.getState().couponsState.coupons.find((c) => c.id === prop1.id) &&
                        <div>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">

                                <Button color="primary">
                                    <NavLink className="link" to={"/update-company-coupon/" + prop1.id}>
                                        Update
                                    </NavLink>
                                </Button>

                                {/* <Button onClick={() => deleteCoupon(prop1.id)}>Delete</Button> */}
                                <Button onClick={handleDeleteClickOpen}>Delete</Button>

                                <Dialog
                                    open={openDelete}
                                    onClose={handleDeleteClose}
                                    PaperComponent={PaperComponent}
                                    aria-labelledby="draggable-dialog-title"
                                >
                                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                                        <Typography className="dialogTitle" gutterBottom variant="h6" component="h2">
                                            Delete coupon
                                        </Typography>
                                    </DialogTitle>

                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to delete coupon id - {prop1.id} ?
                                        </DialogContentText>
                                    </DialogContent>

                                    <DialogActions>
                                        <Button autoFocus className="dialogOk" variant="contained" color="secondary" onClick={handleDeleteClose}>
                                            Cancel
                                        </Button>
                                        <Button className="dialogOk" variant="contained" color="primary" onClick={() => deleteCoupon(prop1.id)}>Delete</Button>
                                    </DialogActions>

                                </Dialog>

                            </ButtonGroup>
                        </div>
                    }

                    {(user?.clientType === 'CUSTOMER') &&
                        !store.getState().couponsState.coupons.find((c) => c.id === prop1.id) &&
                        <div>
                            <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                                {/* <Button onClick={() => purchaseCoupon(prop1)}>Purchase</Button> */}
                                <Button onClick={handleClickOpen}>Purchase</Button>
                            </ButtonGroup>

                            <Dialog
                                open={open}
                                onClose={handleClose}
                                PaperComponent={PaperComponent}
                                aria-labelledby="draggable-dialog-title"
                            >
                                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                                    <Typography className="dialogTitle" gutterBottom variant="h6" component="h2">
                                        Purchase coupon
                                    </Typography>
                                </DialogTitle>

                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you want to add coupon id - {prop1.id} ?
                                    </DialogContentText>
                                </DialogContent>

                                <DialogActions>
                                    <Button autoFocus className="dialogOk" variant="contained" color="secondary" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button className="dialogOk" variant="contained" color="primary" onClick={() => purchaseCoupon(prop1)}>Purchase</Button>
                                </DialogActions>

                            </Dialog>
                        </div>
                    }

                </CardActions>
            </Card>
        </div>
    );
}

export default CompanyCard;
