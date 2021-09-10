import { Button, createStyles, FormControl, Grid, Input, InputLabel, makeStyles, Select, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CouponLoadModel from "../../../Models/CouponLoadModel";
import CouponModel from "../../../Models/CouponModel";
import { couponsAddedAction } from "../../../Redux/CouponsState";
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '25ch',
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

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');

    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(store.getState().authState.user)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CouponLoadModel>({ mode: "onTouched" });
    const history = useHistory(); 

    async function send(coupon: CouponLoadModel) {
        console.log(coupon);
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
            // const response = await tokenAxios.post<CouponModel>(globals.urls.company + "coupons", coupon);

            // Sending request with no token
            const response = await tokenAxios.post<CouponModel>(globals.urls.company + "coupons", coupon);
            const added = response.data;
            console.log(added);
            store.dispatch(couponsAddedAction(added));
            notify.success(SccMsg.ADDED);
            history.push("/company-coupons")
        } catch (err) {
            notify.error(err);
        }
    }

    const [selectedDate1, setSelectedDate1] = React.useState<Date | null>(
        new Date(),
    );
    const [selectedDate2, setSelectedDate2] = React.useState<Date | null>(
        new Date(),
    );

    const handleDateChange1 = (date1: Date | null) => {
        setSelectedDate1(date1);
    };

    const handleDateChange2 = (date2: Date | null) => {
        setSelectedDate2(date2);
    };

    const [coupons, setCoupons] = useState(store.getState().couponsState.coupons);

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        }
        const unsubscribe = store.subscribe(() => {
            setCoupons(store.getState().couponsState.coupons)
            return unsubscribe;
        })
    });

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
                <TextField
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
                <br />

                {/* public category ? : string; */}
                <FormControl className={classes.formControl} {...register("category", { required: { value: true, message: 'Missing Category' } })}>
                    <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
                    <Select
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
                        maxLength: { value: 400, message: 'Title is limit upto 400 Characters!' },
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
                    id="date"
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
                    id="date"
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
                        min: { value: 1, message: "Weight must be grater than zero!" }
                    })}
                />
                <br />
                <span>{errors.amount?.message}</span>
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
                        min: { value: 1, message: "Weight must be grater than zero!" }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br />

                {/* public image ? : string; */}
                <TextField
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
                <br />

                {/* <input type="submit" disabled={!isDirty || !isValid} value="Register" /> */}
                <Button variant="contained" type="submit" color="primary" value="Register" >Register</Button>
                <br />

            </form>

        </div>
    );
}

export default AddCoupon;