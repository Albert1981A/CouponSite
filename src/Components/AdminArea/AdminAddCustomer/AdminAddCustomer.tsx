import { Button, ButtonGroup, createStyles, makeStyles, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CustomerModel from "../../../Models/CustomerModel";
import { customersAddedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./AdminAddCustomer.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1),
                width: '35ch',
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

function AdminAddCustomer(): JSX.Element {

    const history = useHistory();

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        }
    });

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');

    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(store.getState().authState.user)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CustomerModel>({ mode: "onTouched" });

    async function send(customerToSend: CustomerModel) {
        // console.log(customerToSend);
        if (store.getState().companiesState.companies.find(c => c.email === customerToSend.email)) {
            notify.error(ErrMsg.CUSTOMER_EMAIL_EXIST);
        } else {
            const formData = new FormData();
            formData.append("firstName", customerToSend.firstName);
            formData.append("lastName", customerToSend.lastName);
            formData.append("email", customerToSend.email);
            formData.append("password", customerToSend.password);
            formData.append("imageID", undefined);
            formData.append("image", customerToSend.image.item(0));
            try {
                const response = await tokenAxios.post<CustomerModel>(globals.urls.admin + "customers", formData);
                const added = response.data;
                console.log(added);
                store.dispatch(customersAddedAction(added));
                notify.success(SccMsg.ADDED);
                history.push("/admin-customers")
            } catch (err) {
                notify.error(ErrMsg.ERROR_WHILE_ADDING_CUSTOMER);
                notify.error(err);
            }
        }
    }

    function cancel() {
        history.push('/admin-customers');
    }

    return (
        <div className="AdminAddCustomer Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Add Customer
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(send)}>

                {/* public firstName ? : string */}
                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="firstName"
                    label="First-Name"
                    placeholder="First-Name"
                    multiline
                    variant="outlined"
                    {...register("firstName", {
                        required: { value: true, message: 'Missing first name!' },
                        maxLength: { value: 40, message: 'First name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.firstName?.message}</span>
                <br />

                {/* public lastName ? : string */}
                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="lastName"
                    label="Last-Name"
                    placeholder="Last-Name"
                    multiline
                    variant="outlined"
                    {...register("lastName", {
                        required: { value: true, message: 'Missing last name!' },
                        maxLength: { value: 40, message: 'Last name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.lastName?.message}</span>
                <br />

                {/* public email ? : string NO*/}
                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="email"
                    label="Email"
                    placeholder="Email"
                    multiline
                    variant="outlined"
                    {...register("email", {
                        required: { value: true, message: 'Missing email!' },
                        maxLength: { value: 60, message: 'Email is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' },
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.email?.message}</span>
                <br />

                {/* public password ? : string */}
                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    multiline
                    variant="outlined"
                    {...register("password", {
                        required: { value: true, message: 'Missing last password!' },
                        maxLength: { value: 40, message: 'Password is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.password?.message}</span>
                <br />

                <label className="labelAdd">Image</label>
                <input
                    type="file"
                    id="myFile"
                    name="profile_pic"
                    accept=".jpg, .jpeg, .png"
                    placeholder="Image"
                    {...register("image", {
                        required: { value: true, message: 'Missing image!' },
                    })}
                />

                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" disabled={!isDirty || !isValid} type="submit" value="create">Add Customer</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>

        </div>
    );
}

export default AdminAddCustomer;
