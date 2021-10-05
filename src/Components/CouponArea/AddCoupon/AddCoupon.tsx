import { Button, ButtonGroup, createStyles, FormControl, Grid, Input, InputLabel, makeStyles, Select, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CouponLoadModel from "../../../Models/CouponLoadModel";
import CouponModel from "../../../Models/CouponModel";
import { allCouponsAddedAction, couponsAddedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./AddCoupon.css";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import tokenAxios from "../../../Service/InterceptorAxios";
import { useState } from "react";
import { Unsubscribe } from "redux";
import { error } from "console";
import { Message } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '40ch',
            },
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        // container: {
        //     display: 'flex',
        //     flexWrap: 'wrap',
        // },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
    }),
);

function AddCoupon(): JSX.Element {

    console.log(store.getState().authState.user);

    const history = useHistory();
    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');

    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(store.getState().authState.user);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CouponLoadModel>({ mode: "onTouched" });

    async function send(couponToSend: CouponLoadModel) {
        console.log(couponToSend);
        if (store.getState().couponsState.coupons.find(c => c.title === couponToSend.title)) {
            notify.error(ErrMsg.TITLE_EXIST);
        } else if (couponToSend.startDate > couponToSend.endDate) {
            notify.error(ErrMsg.END_DATE_IS_BEFORE_START_DATE);
        } else {
            try {
                // const formData = new FormData();
                // formData.append("companyID", coupon.companyID.toString());
                // formData.append("category", coupon.category.toString());
                // formData.append("title", coupon.title);
                // formData.append("description", coupon.description);
                // formData.append("startDate", coupon.startDate.toString());
                // formData.append("endDate", coupon.endDate.toString());
                // formData.append("amount", coupon.amount.toString());
                // formData.append("price", coupon.price.toString());
                // formData.append("image", coupon.image);
                // console.log(formData);

                // Sending token without interceptor
                // const headers = { "authorization": store.getState().authState.user.token };
                // const response = await axios.post<CouponModel>(globals.urls.company + "coupons", coupon, { headers });

                // Sending token with interceptor
                const response = await tokenAxios.post<CouponModel>(globals.urls.company + "coupons", couponToSend);
                const added = response.data;
                console.log(added);
                store.dispatch(couponsAddedAction(added));
                store.dispatch(allCouponsAddedAction(added));
                notify.success(SccMsg.ADDED);
                history.push("/company-coupons")
            } catch (err) {
                notify.error(ErrMsg.ERROR_WHILE_ADDING_COUPON);
                notify.error(err);
            }
        }
    }

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        }
    });

    function cancel() {
        history.push('/company-coupons');
    }

    return (
        <div className="AddCoupon Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Add Coupon
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(send)}>

                {/* public companyID ? : number; */}
                {/* <TextField
                    id="outlined-textarea-1"
                    type="number"
                    name="company id"
                    label="Company ID"
                    placeholder="Company ID"
                    multiline
                    variant="outlined"
                    value={user.clientId}
                    {...register("companyID", {
                        required: { value: true, message: 'Missing company id' }
                    })}
                />
                <br />
                <span>{errors.companyID?.message}</span>
                <br /> */}

                <label className="labelAdd">Company Id</label>
                <input
                    className="disabledArea1"
                    id="outlined-textarea-1"
                    type="number"
                    name="company id"
                    placeholder="Company ID"
                    value={user.clientId}
                    {...register("companyID", {
                        required: { value: true, message: 'Missing company id' },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span>{errors.companyID?.message}</span>
                <br />

                {/* public category ? : string; */}
                <FormControl className={classes.formControl} {...register("category", { required: { value: true, message: 'Missing Category' } })}>
                    <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
                    <Select
                        className="selectCategory"
                        labelId="category"
                        id="category"
                        value={type}
                        onChange={handleChange}
                        name="category"
                    >
                        <option value="">None</option>
                        <option value="FOOD_PRODUCTS">Food products</option>
                        <option value="ELECTRICAL_PRODUCTS">Electrical products</option>
                        <option value="HOUSEHOLD_PRODUCTS">Household products</option>
                        <option value="GARDEN_PRODUCTS">Garden products</option>
                        <option value="RESTAURANTS">Restaurants</option>
                        <option value="VACATIONS_ABROAD">Vacations abroad</option>
                        <option value="VACATIONS_IN_ISRAEL">Vacations in israel</option>
                        <option value="ENTRANCES_TO_SITES_AND_MUSEUMS">Entrances to sites and museums</option>
                    </Select>
                </FormControl>

                <br />
                <span>{errors.category?.message}</span>
                <br />
                <br />


                {/* public title ? : string; */}
                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="title"
                    label="Title"
                    placeholder="Title"
                    multiline
                    variant="outlined"
                    {...register("title", {
                        required: { value: true, message: 'Missing title' },
                        maxLength: { value: 40, message: 'Title is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span>{errors.title?.message}</span>
                <br />
                <br />

                {/* public description ? : string; */}
                <TextField
                    id="outlined-textarea-3"
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="Description"
                    multiline
                    variant="outlined"
                    {...register("description", {
                        required: { value: true, message: 'Missing description!' },
                        maxLength: { value: 400, message: 'Description is limit upto 400 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                        // ,pattern: { value: /^\S+@\S+$/i, message: 'Invalid Email' }
                    })}
                />
                <br />
                <span>{errors.description?.message}</span>
                <br />

                {/* public startDate ? : Date; */}
                {/* <input type="date" name="startDate" placeholder="Start Date" required {...register("startDate", {
                    required: { value: true, message: 'Missing start date' },
                    // minLength: { value: 4, message: 'Password should contains at least 4 Characters' },
                    // maxLength: { value: 12, message: 'Password should contains up to 12 Characters' },
                })}/> */}
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifyContent="space-around">
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Start Date"
                            value={selectedDate1}
                            onChange={handleDateChange1}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            name="startDate"
                        />
                    </Grid>
                </MuiPickersUtilsProvider> */}
                <TextField
                    id="startDate1"
                    label="Start Date"
                    type="date"
                    name="startDate"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register("startDate", {
                        required: { value: true, message: 'Missing start date!' },
                    })}
                />
                <br />
                <span>{errors.startDate?.message}</span>
                <br />

                {/* public endDate ? : Date; */}
                {/* <input type="date" name="startDate" placeholder="Start Date" required {...register("startDate", {
                    required: { value: true, message: 'Missing start date' },
                    // minLength: { value: 4, message: 'Password should contains at least 4 Characters' },
                    // maxLength: { value: 12, message: 'Password should contains up to 12 Characters' },
                })}/> */}
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifyContent="space-around" >
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline2"
                            label="End Date"
                            value={selectedDate2}
                            onChange={handleDateChange2}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            name="endDate"
                        />
                    </Grid>
                </MuiPickersUtilsProvider> */}
                <TextField
                    id="endDate1"
                    label="End Date"
                    type="date"
                    name="endDate"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...register("endDate", {
                        required: { value: true, message: 'Missing end date!' },
                    })}
                />
                <br />
                <span>{errors.endDate?.message}</span>
                <br />
                <br />

                {/* public amount ? : number; */}
                <TextField
                    id="outlined-textarea-6"
                    type="number"
                    name="amount"
                    label="Amount"
                    placeholder="Amount"
                    multiline
                    variant="outlined"
                    {...register("amount", {
                        required: { value: true, message: 'Missing amount!' },
                        min: { value: 1, message: "Amount must be grater than zero!" },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span>{errors.amount?.message}</span>
                <br />
                <br />

                {/* public price ? : number; */}
                <TextField
                    id="outlined-textarea-7"
                    type="number"
                    name="price"
                    // step="0.01"
                    label="Price"
                    placeholder="Price"
                    multiline
                    variant="outlined"
                    {...register("price", {
                        required: { value: true, message: 'Missing price!' },
                        min: { value: 1, message: "Price must be grater than zero!" },
                        pattern: { value: /^-?[0-9]\d*\.?\d*$/, message: 'Only numbers!' }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br />
                <br />

                {/* public image ? : string; */}
                {/* <TextField
                    id="outlined-textarea-8"
                    type="text"
                    name="image"
                    label="Image"
                    placeholder="Image"
                    multiline
                    variant="outlined"
                    value={user.clientName + ".jpg"}
                    {...register("image", {
                        required: { value: true, message: 'Missing image!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br /> */}

                <label className="labelAdd">Image</label>
                <input
                    className="disabledArea1"
                    id="outlined-textarea-8"
                    type="text"
                    name="image"
                    placeholder="Image"
                    value={user.clientName + ".jpg"}
                    {...register("image", {
                        required: { value: true, message: 'Missing image!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br />
                <br />

                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" disabled={!isDirty || !isValid} type="submit" value="create">Add Coupon</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>

        </div>
    );
}

export default AddCoupon;