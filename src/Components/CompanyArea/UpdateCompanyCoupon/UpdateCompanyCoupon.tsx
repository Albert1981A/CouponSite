import { Button, ButtonGroup, createStyles, FormControl, Input, InputLabel, makeStyles, Select, Step, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import { InputOutlined, Label, PowerInputOutlined } from "@material-ui/icons";
import axios, { AxiosError } from "axios";
import { promises } from "dns";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponLoadModel from "../../../Models/CouponLoadModel";
import CouponModel from "../../../Models/CouponModel";
import { companiesUpdatedAction } from "../../../Redux/CompaniesState";
import { allCouponsUpdatedAction, couponsUpdatedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./UpdateCompanyCoupon.css";

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
            fontSize: 18,
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
    }),
);

interface RouteParam {
    id: string;
}

interface updateCompanyCouponProps extends RouteComponentProps<RouteParam> { }

function UpdateCompanyCoupon(props: updateCompanyCouponProps): JSX.Element {

    const history = useHistory(); //Redirect function

    if (!store.getState().authState.user) {
        notify.error(ErrMsg.PLS_LOGIN);
        history.push("/login")
    }

    let unsubscribe: Unsubscribe;

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(store.getState().authState.user)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CouponModel>({
        mode: "onTouched"
    });

    const id = +props.match.params.id;
    const [coupon, setCoupon] = useState(
        store.getState().couponsState.coupons.find((c) => c.id === id)
    );

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        }
        // unsubscribe = store.subscribe(() => {
        //     setCoupon(store.getState().couponsState.coupons.find((c) => c.id === id))
        // })

        // return () => {
        //     unsubscribe();
        //     console.log('Bye');
        // };
    });

    async function send(couponToSend2: CouponModel) {
        // console.log(couponToSend2);
        if (store.getState().couponsState.coupons.find(c => c.title === couponToSend2.title) &&
            coupon.title !== couponToSend2.title) {
            notify.error(ErrMsg.TITLE_EXIST);
        } else if (couponToSend2.startDate > couponToSend2.endDate) {
            notify.error(ErrMsg.END_DATE_IS_BEFORE_START_DATE);
        } else {
            try {
                const response = await tokenAxios.put<CouponModel>(globals.urls.company + "coupons", couponToSend2);
                const added = response.data;
                // console.log(added);
                store.dispatch(couponsUpdatedAction(added)); //With Redux
                store.dispatch(allCouponsUpdatedAction(added));
                notify.success(SccMsg.UPDATE_COUPON)
                history.push('/company-coupons')
                // await axios.get('/bad-call');
            }
            catch (err: any) {
                notify.error(ErrMsg.UPDATE_COUPON);
                notify.error(err);
            }
        }
    }

    function cancel() {
        history.push('/company-coupons');
    }

    function getDate(date: Date): string {
        const myDate = new Date(date);
        const year = myDate.getFullYear();
        const month = ("0" + (myDate.getMonth() + 1)).slice(-2);
        const day = ("0" + myDate.getDate()).slice(-2);
        const newDate = year + "-" + month + "-" + day;
        return newDate;
    }

    return (
        <div className="UpdateCompanyCoupon Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Update Company Coupon
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(send)}>

                {/* public coupon id ? : number; */}
                {/* <TextField
                    id="outlined-textarea-1"
                    type="number"
                    name="id"
                    label="id"
                    placeholder="id"
                    multiline
                    variant="outlined"
                    // value={coupon.id}
                    onChange={(e) => {
                        setCouponId(coupon.id);
                        const target = e.target as HTMLInputElement;
                        }}
                    value={couponId}
                    {...register("id", {
                        required: { value: true, message: 'Missing company id' },
                        pattern: { value: /^\d*\.?\d*$/, message: 'Invalid email!' }
                    })}
                />
                <br />
                <span>{errors.companyID?.message}</span>
                <br /> */}

                <label>Coupon Id</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-1"
                    type="number"
                    name="id"
                    placeholder="id"
                    value={coupon.id}
                    {...register("id", {
                        required: { value: true, message: 'Missing company id' },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.id?.message}</span>
                <br />

                {/* public companyID ? : number; */}
                {/* <TextField
                    id="outlined-textarea-1"
                    type="number"
                    name="company id"
                    label="Company ID"
                    placeholder="Company ID"
                    multiline
                    variant="outlined"
                    // value={coupon.companyID}
                    onChange={(e) => {
                        setCompanyId(coupon.companyID);
                        const target = e.target as HTMLInputElement;
                    }}
                    value={companyId}
                    {...register("companyID", {
                        required: { value: true, message: 'Missing company id' },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span>{errors.companyID?.message}</span>
                <br /> */}

                <label>Company Id</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-1"
                    type="number"
                    name="company id"
                    placeholder="Company ID"
                    value={coupon.companyID}
                    {...register("companyID", {
                        required: { value: true, message: 'Missing company id' },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.companyID?.message}</span>
                <br />

                {/* public category ? : string; */}
                {/* <FormControl className={classes.formControl}
                    {...register("category", {
                        required: { value: true, message: 'Missing Category' }
                    })}
                >
                    <InputLabel id="controlled-open-select-label">Category</InputLabel>
                    <Select
                        labelId="category"
                        id="category"
                        // defaultValue={coupon.category}
                        onChange={(e) => {
                            setCategory(coupon.category);
                            const target = e.target as HTMLInputElement;
                        }}
                        defaultValue={category}
                        // onChange={handleChange}
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
                <br /> */}

                <FormControl className={classes.formControl}>
                    <label>Category</label>
                    <select
                        id="category"
                        name="category"
                        defaultValue={coupon.category}
                        {...register("category", {
                            required: { value: true, message: 'Missing Category' }
                        })}
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
                    </select>
                </FormControl>
                <br />
                <span className="errorMessage">{errors.category?.message}</span>
                <br />

                {/* public title ? : string; */}
                {/* <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="title"
                    label="Title"
                    placeholder="Title"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.title}
                    onChange={(e) => {
                        setTitle(coupon.title);
                        const target = e.target as HTMLInputElement;
                    }}
                    defaultValue={title}
                    {...register("title", {
                        required: { value: true, message: 'Missing title!' },
                        maxLength: { value: 40, message: 'Title is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span>{errors.title?.message}</span>
                <br /> */}

                <label>Title</label> <br />
                <input
                    id="outlined-textarea-2"
                    type="text"
                    name="title"
                    placeholder="Title"
                    defaultValue={coupon.title}
                    {...register("title", {
                        required: { value: true, message: 'Missing title!' },
                        maxLength: { value: 40, message: 'Title is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.title?.message}</span>
                <br />

                {/* public description ? : string; */}
                {/* <TextField
                    id="outlined-textarea-3"
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="Description"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.description}
                    onChange={(e) => {
                        setDescription(coupon.description);
                        const target = e.target as HTMLInputElement;
                    }}
                    defaultValue={description}
                    {...register("description", {
                        required: { value: true, message: 'Missing description' },
                        maxLength: { value: 400, message: 'Title is limit upto 400 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                        // ,pattern: { value: /^\S+@\S+$/i, message: 'Invalid Email' }
                    })}
                />
                <br />
                <span>{errors.description?.message}</span>
                <br /> */}

                <label>Description</label> <br />
                <input
                    id="outlined-textarea-3"
                    type="text"
                    name="description"
                    placeholder="Description"
                    defaultValue={coupon.description}
                    {...register("description", {
                        required: { value: true, message: 'Missing description' },
                        maxLength: { value: 400, message: 'Description is limit upto 400 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                        // ,pattern: { value: /^\S+@\S+$/i, message: 'Invalid Email' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.description?.message}</span>
                <br />

                {/* public startDate ? : Date; */}
                {/* <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    name="startDate"
                    // defaultValue={getDate(coupon.startDate)}
                    onChange={(e) => {
                        setStartDate(getDate(coupon.startDate));
                        const target = e.target as HTMLInputElement;
                    }}
                    defaultValue={startDate}
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
                <br /> */}

                <label>Start Date</label> <br />
                <input
                    id="date"
                    type="date"
                    name="startDate"
                    defaultValue={getDate(coupon.startDate)}
                    className={classes.textField}
                    {...register("startDate", {
                        required: { value: true, message: 'Missing start date!' },
                    })}
                />
                <br />
                <span className="errorMessage">{errors.startDate?.message}</span>
                <br />

                {/* public endDate ? : Date; */}
                {/* <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    name="endDate"
                    // defaultValue={getDate(coupon.endDate)}
                    onChange={(e) => {
                        setEndDate(getDate(coupon.endDate));
                        const target = e.target as HTMLInputElement;
                    }}
                    defaultValue={endDate}
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
                <br /> */}

                <label>End Date</label> <br />
                <input
                    id="date"
                    type="date"
                    name="endDate"
                    defaultValue={getDate(coupon.endDate)}
                    className={classes.textField}
                    {...register("endDate", {
                        required: { value: true, message: 'Missing end date!' },
                    })}
                />
                <br />
                <span className="errorMessage">{errors.endDate?.message}</span>
                <br />

                {/* public amount ? : number; */}
                {/* <TextField
                    id="outlined-textarea-6"
                    type="number"
                    name="amount"
                    label="Amount"
                    placeholder="Amount"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.amount}
                    onChange={(e) => {
                        setAmount(coupon.amount);
                        const target = e.target as HTMLInputElement;
                    }}
                    defaultValue={amount}
                    {...register("amount", {
                        required: { value: true, message: 'Missing amount!' },
                        min: { value: 1, message: "Price must be grater than zero!" }
                    })}
                />
                <br />
                <span>{errors.amount?.message}</span>
                <br /> */}

                <label>Amount</label> <br />
                <input
                    id="outlined-textarea-6"
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    defaultValue={coupon.amount}
                    {...register("amount", {
                        required: { value: true, message: 'Missing amount!' },
                        min: { value: 1, message: "Price must be grater than zero!" },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.amount?.message}</span>
                <br />

                {/* public price ? : number; */}
                {/* <TextField
                    id="outlined-textarea-7"
                    type="number"
                    name="price"
                    label="Price"
                    placeholder="Price"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.price}
                    onChange={(e) => {
                        setPrice(coupon.price);
                        const target = e.target as HTMLInputElement;
                    }}
                    defaultValue={price}
                    {...register("price", {
                        required: { value: true, message: 'Missing price!' },
                        min: { value: 1, message: "Price must be grater than zero!" }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br /> */}

                <label>Price</label> <br />
                <input
                    id="outlined-textarea-7"
                    type="number"
                    name="price"
                    step="0.01"
                    placeholder="Price"
                    defaultValue={coupon.price}
                    {...register("price", {
                        required: { value: true, message: 'Missing price!' },
                        min: { value: 1, message: "Price must be grater than zero!" },
                        pattern: { value: /^-?[0-9]\d*\.?\d*$/, message: 'Only numbers!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.price?.message}</span>
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
                    // value={coupon.image}
                    onChange={(e) => {
                        setImage(coupon.image);
                        const target = e.target as HTMLInputElement;
                    }}
                    value={image}
                    {...register("image", {
                        required: { value: true, message: 'Missing image!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br /> */}

                <label>Image</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-8"
                    type="text"
                    name="image"
                    placeholder="Image"
                    value={coupon.image}
                    {...register("image", {
                        required: { value: true, message: 'Missing image!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.price?.message}</span>
                <br />

                {/* <Input type="submit" disabled={!isDirty || !isValid} value="Update" /> */}

                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" disabled={!isDirty || !isValid} type="submit" value="update">Update</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>
        </div>
    );
}

export default UpdateCompanyCoupon;
