import { Button, ButtonGroup, createStyles, makeStyles, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CustomerModel from "../../../Models/CustomerModel";
import { customersUpdatedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./UpdateCustomerDetails.css";

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

interface updateCustomerDetailsProps extends RouteComponentProps<RouteParam> { }

function UpdateCustomerDetails(props: updateCustomerDetailsProps): JSX.Element {

    const id = +props.match.params.id;
    const history = useHistory();

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(store.getState().authState.user)

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const [customer, setCustomer] = useState(
        store.getState().customersState.customers.find((c) => c.id === id)
    );

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        } else if (store.getState().authState.user.clientType !== "ADMINISTRATOR") {
            notify.error(ErrMsg.ONLY_ADMIN_ALLOWED);
            history.push("/home");
        }
    });

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CustomerModel>({
        mode: "onTouched"
    });

    async function send(customerToSend: CustomerModel) {
        // customerToSend.id = ((Number)(customerToSend.id));
        // console.log(customerToSend);
        // console.log(customer);
        if (customerToSend.id != customer.id) {
            notify.error(ErrMsg.UNABLE_TO_UPDATE_CUSTOMER_ID);
        } else {
            try {
                const response = await tokenAxios.put<CustomerModel>(globals.urls.admin + "customers", customerToSend);
                const added = response.data;
                // console.log(added);
                store.dispatch(customersUpdatedAction(added));
                setCustomer(store.getState().customersState.customers.find((c) => c.id === id));
                notify.success(SccMsg.UPDATED);
                history.push('/admin-customers');
            }
            catch (err) {
                notify.error(ErrMsg.UNABLE_TO_UPDATE_CUSTOMER);
                notify.error(err);
            }
        }
    }

    function cancel() {
        history.push('/admin-customers');
    }

    return (
        <div className="UpdateCustomerDetails">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Update Customer Details
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} onSubmit={handleSubmit(send)}>

                {/* public id ? : number NO */}
                <label>Customer Id</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-1"
                    type="number"
                    name="id"
                    placeholder="id"
                    value={customer.id}
                    {...register("id", {
                        required: { value: true, message: 'Missing customer id' },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.id?.message}</span>
                <br />

                {/* public firstName ? : string */}
                <label>First Name</label> <br />
                <input
                    id="outlined-textarea-2"
                    type="text"
                    name="firstName"
                    placeholder="First-Name"
                    defaultValue={customer.firstName}
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
                <label>Last Name</label> <br />
                <input
                    id="outlined-textarea-2"
                    type="text"
                    name="lastName"
                    placeholder="Last-Name"
                    defaultValue={customer.lastName}
                    {...register("lastName", {
                        required: { value: true, message: 'Missing last name!' },
                        maxLength: { value: 40, message: 'Last name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.lastName?.message}</span>
                <br />

                {/* public email ? : string */}
                <label>Email</label> <br />
                <input
                    id="outlined-textarea-2"
                    type="text"
                    name="email"
                    placeholder="Email"
                    defaultValue={customer.email}
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
                <label>Password</label> <br />
                <input
                    id="outlined-textarea-2"
                    type="text"
                    name="password"
                    placeholder="Password"
                    defaultValue={customer.password}
                    {...register("password", {
                        required: { value: true, message: 'Missing last name!' },
                        maxLength: { value: 40, message: 'Last name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.password?.message}</span>
                <br />

                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" disabled={!isDirty || !isValid} type="submit" value="Update">Update</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>

        </div>
    );
}

export default UpdateCustomerDetails;
