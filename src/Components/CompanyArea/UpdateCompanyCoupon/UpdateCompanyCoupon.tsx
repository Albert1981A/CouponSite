import { Button, ButtonGroup, createStyles, FormControl, InputLabel, makeStyles, Select, Step, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponLoadModel from "../../../Models/CouponLoadModel";
import CouponModel from "../../../Models/CouponModel";
import { companiesUpdatedAction } from "../../../Redux/CompaniesState";
import { couponsUpdatedAction } from "../../../Redux/CouponsState";
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

interface updateCouponDetailsProps extends RouteComponentProps<RouteParam> { }

function UpdateCompanyCoupon(props: updateCouponDetailsProps): JSX.Element {

    let unsubscribe: Unsubscribe;

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(store.getState().authState.user)
    // const [coupons, setCoupons] = useState(store.getState().couponsState.coupons);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CouponModel>({
        mode: "onChange"
    });

    const history = useHistory(); //Redirect function
    const id = +props.match.params.id;
    const [coupon, setCoupon] = useState(
        store.getState().couponsState.coupons.find((c) => c.id === id)
    );

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        }
        unsubscribe = store.subscribe(() => {
            setCoupon(store.getState().couponsState.coupons.find((c) => c.id === id))
            return unsubscribe;
        })
    });

    async function send(coupon: CouponModel) {
        console.log(coupon);
        try {
            const response = await tokenAxios.put<CouponModel>(globals.urls.company + "coupons", coupon);
            const added = response.data;
            console.log(added.amount);
            store.dispatch(couponsUpdatedAction(added)); //With Redux
            notify.success(SccMsg.UPDATE_COUPON)
            history.push('/company-coupons')
        }
        catch (err) {
            // console.log(err.message);
            notify.error(ErrMsg.UPDATE_COUPON);
            notify.error(err);
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

    const [couponId, setCouponId] = useState(coupon.id);
    const [companyId, setCompanyId] = useState(coupon.companyID);
    const [category, setCategory] = useState(coupon.category);
    const [title, setTitle] = useState(coupon.title);
    const [description, setDescription] = useState(coupon.description);
    const [startDate, setStartDate] = useState(getDate(coupon.startDate));
    const [endDate, setEndDate] = useState(getDate(coupon.endDate));
    const [amount, setAmount] = useState(coupon.amount);
    const [price, setPrice] = useState(coupon.price);
    const [image, setImage] = useState(coupon.image);



    return (
        <div className="UpdateCompanyCoupon Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Update Company Coupon
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} onSubmit={handleSubmit(send)}>
                
                {/* <label>Coupon Id</label>
                <br />
                <input type="number" name="id"
                    value={coupon.id}
                    {...register("id")} />
                <br /> */}

                {/* public companyID ? : number; */}
                <TextField
                    id="outlined-textarea-1"
                    type="number"
                    name="id"
                    label="id"
                    placeholder="id"
                    multiline
                    variant="outlined"
                    // value={coupon.id}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setCouponId(coupon.id);
                        }}
                    value={couponId}
                    {...register("id", {
                        required: { value: true, message: 'Missing company id' }
                    })}
                />
                <br />
                <span>{errors.companyID?.message}</span>
                <br />

                {/* <label>Company Id</label>
                <br />
                <input type="number" name="companyID"
                    value={coupon.companyID}
                    {...register("companyID")} />
                <br /> */}

                {/* public companyID ? : number; */}
                <TextField
                    id="outlined-textarea-1"
                    type="number"
                    name="company id"
                    label="Company ID"
                    placeholder="Company ID"
                    multiline
                    variant="outlined"
                    // value={coupon.companyID}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setCompanyId(coupon.companyID);
                        }}
                    value={companyId}
                    {...register("companyID", {
                        required: { value: true, message: 'Missing company id' }
                    })}
                />
                <br />
                <span>{errors.companyID?.message}</span>
                <br />

                {/* <label>Category</label>
                <br />
                <input type="category" name="category"
                    value={coupon.category}
                    {...register("category")} />
                <br /> */}

                {/* public category ? : string; */}
                <FormControl className={classes.formControl}
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
                            const target = e.target as HTMLInputElement;
                            setCategory(coupon.category);
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
                <br />

                {/* <label>Title</label>
                <br />
                <input type="text" name="title"
                    value={coupon.title}
                    {...register("title", {
                        required: true,
                        minLength: 2
                    })} />
                <br /> */}

                {/* public title ? : string; */}
                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="title"
                    label="Title"
                    placeholder="Title"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.title}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setTitle(coupon.title);
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
                <br />

                {/* <label>Description</label>
                <br />
                <input type="text" name="description"
                    defaultValue={coupon.description}
                    {...register("description", {
                        required: true,
                        minLength: 10
                    })} />
                <br /> */}

                {/* public description ? : string; */}
                <TextField
                    id="outlined-textarea-3"
                    type="text"
                    name="description"
                    label="Description"
                    placeholder="Description"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.description}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setDescription(coupon.description);
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
                <br />

                {/* <label>Start Date</label>
                <br />
                <input type="date" name="startDate"
                    // defaultValue={coupon.start_date}
                    defaultValue={getDate(coupon.startDate)}
                    {...register("startDate", {
                        required: true,
                    })} />
                <br /> */}

                {/* public startDate ? : Date; */}
                <TextField
                    id="date"
                    label="Start Date"
                    type="date"
                    name="startDate"
                    // defaultValue={getDate(coupon.startDate)}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setStartDate(getDate(coupon.startDate));
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
                <br />

                {/* <label>End Date</label>
                <br />
                <input type="date" name="endDate"
                    defaultValue={getDate(coupon.endDate)}
                    {...register("endDate", {
                        required: true,
                    })} />
                <br /> */}

                {/* public endDate ? : Date; */}
                <TextField
                    id="date"
                    label="End Date"
                    type="date"
                    name="endDate"
                    // defaultValue={getDate(coupon.endDate)}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setEndDate(getDate(coupon.endDate));
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
                <br />

                {/* <label>Amount</label>
                <br />
                <input type="number" name="amount"
                    defaultValue={coupon.amount}
                    {...register("amount", {
                        required: true,
                    })} />
                <br /> */}

                {/* public amount ? : number; */}
                <TextField
                    id="outlined-textarea-6"
                    type="number"
                    name="amount"
                    label="Amount"
                    placeholder="Amount"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.amount}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setAmount(coupon.amount);
                        }}
                    defaultValue={amount}
                    {...register("amount", {
                        required: { value: true, message: 'Missing amount!' },
                        min: { value: 1, message: "Price must be grater than zero!" }
                    })}
                />
                <br />
                <span>{errors.amount?.message}</span>
                <br />

                {/* <label>Price</label>
                <br />
                <input type="double" name="price" step="0.01"
                    defaultValue={coupon.price}
                    {...register("price", {
                        required: true,
                    })} />
                <br /> */}

                {/* public price ? : number; */}
                <TextField
                    id="outlined-textarea-7"
                    type="number"
                    name="price"
                    label="Price"
                    placeholder="Price"
                    multiline
                    variant="outlined"
                    // defaultValue={coupon.price}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setPrice(coupon.price);
                        }}
                    defaultValue={price}
                    {...register("price", {
                        required: { value: true, message: 'Missing price!' },
                        min: { value: 1, message: "Price must be grater than zero!" }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br />

                {/* <label>Image</label>
                <br />
                <input type="text" name="image"
                    defaultValue={coupon.image}
                    {...register("image", {
                        required: true,
                    })} />
                <br /> */}

                {/* public image ? : string; */}
                <TextField
                    id="outlined-textarea-8"
                    type="text"
                    name="image"
                    label="Image"
                    placeholder="Image"
                    multiline
                    variant="outlined"
                    // value={coupon.image}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setImage(coupon.image);
                        }}
                    value={image}
                    {...register("image", {
                        required: { value: true, message: 'Missing image!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span>{errors.price?.message}</span>
                <br />

                {/* <input type="submit" disabled={!isDirty || !isValid} value="Update" /> */}
                {/* <Button variant="contained" type="submit" disabled={!isDirty || !isValid} color="primary" value="Update" >
                    Update
                </Button> */}

                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" type="submit" disabled={!isDirty || !isValid} value="Update">Update</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>
        </div>
    );
}

export default UpdateCompanyCoupon;
