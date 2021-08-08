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
    }),
);

function AddCoupon(): JSX.Element {

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');

    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CouponLoadModel>({ mode: "onTouched" });
    const history = useHistory(); //Redirect function

    // useEffect(() => {
    //     // if we don't have a user object - we are not logged in and we are not allowed in.
    //     if (!store.getState().authState.user) {
    //         // notify.error(ErrMsg.PLS_LOGIN);
    //         notify.error("you need to login first");
    //         history.push("/login");
    //     }
    // });

    async function send(coupon: CouponLoadModel) {
        console.log(coupon);
        try {
            const formData = new FormData();
            formData.append("companyID", coupon.companyID.toString());
            formData.append("category", coupon.category.toString());
            formData.append("title", coupon.title);
            formData.append("description", coupon.description);
            formData.append("startDate", coupon.startDate.toString());
            formData.append("endDate", coupon.endDate.toString());
            formData.append("amount", coupon.amount.toString());
            formData.append("price", coupon.price.toString());
            formData.append("image", coupon.image);
            console.log(formData);
            const response = await axios.post<CouponModel>(globals.urls.company + "coupons", formData);
            const added = response.data;
            store.dispatch(couponsAddedAction(added));
            notify.success(SccMsg.ADDED);
            alert("Cat has been added");
            history.push("/cats-2")
        } catch (err) {
            notify.error(err);
        }
    }

    // The first commit of Material-UI
    //'2014-08-18T21:11:54'
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
                        maxLength: { value: 40, message: 'Last name is limit upto 40 Characters' }
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
                        required: { value: true, message: 'Missing description' }
                        // ,pattern: { value: /^\S+@\S+$/i, message: 'Invalid Email' }
                    })}
                />
                <br />
                <span>{errors.description?.message}</span>
                <br />

                {/* public startDate ? : Date; */}
                {/* <TextField
                    id="outlined-textarea-4"
                    type="date"
                    name="startDate"
                    label="Start Date"
                    placeholder="Start Date"
                    multiline
                    variant="outlined"
                    {...register("startDate", {
                        required: { value: true, message: 'Missing start date' },
                        // minLength: { value: 4, message: 'Password should contains at least 4 Characters' },
                        // maxLength: { value: 12, message: 'Password should contains up to 12 Characters' },
                    })}
                /> */}
                
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                </MuiPickersUtilsProvider>
                <br />
                <span>{errors.startDate?.message}</span>
                <br /> 

                {/* public endDate ? : Date; */}
                {/* <TextField
                    id="outlined-textarea-5"
                    type="date"
                    name="endDate"
                    label="End Date"
                    placeholder="End Date"
                    multiline
                    variant="outlined"
                    {...register("endDate", {
                        required: { value: true, message: 'Missing end date' },
                    })}
                /> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifyContent="space-around">
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
                </MuiPickersUtilsProvider>
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
                        required: { value: true, message: 'Missing amount' }
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
                        required: { value: true, message: 'Missing price' },
                        min: { value: 0, message: "Weight must be grater than zero" }
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
                    {...register("image", {
                        required: { value: true, message: 'Missing image' },
                        min: { value: 0, message: "Weight must be grater than zero" }
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