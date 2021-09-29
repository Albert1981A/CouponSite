import { Button, ButtonGroup, createStyles, FormHelperText, InputLabel, makeStyles, MenuItem, NativeSelect, Select, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { registerAction } from "../../../Redux/AuthAppState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./Register.css";

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
    }),
);

function Register(): JSX.Element {

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');

    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<UserModel>({ mode: "onTouched" });
    const history = useHistory(); //Redirect function

    useEffect(() => {
        if (store.getState().authState.user) {
            notify.error(ErrMsg.ALREADY_LOGGED_IN);
            history.push("/home");
        }
    });

    async function send(user: UserModel) {
        console.log(user);
        try {
            const response = await axios.post<UserModel>(globals.urls.client + "register", user);
            console.log(response.data);
            store.dispatch(registerAction(response.data));
            notify.success(SccMsg.REGISTER_SUCCESS);

            const clientType = store.getState().authState.user.clientType
            console.log(clientType);
            if (clientType === "COMPANY") {
                history.push("/company-coupons");
            } else if (clientType === "CUSTOMER") {
                history.push("/customer-coupons");
            }
        }
        catch (err) {
            notify.error(err);
        }
    }

    function cancel() {
        history.push('/home');
    }

    return (
        <div className="Register Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Register
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(send)}>
                <TextField
                    id="outlined-textarea-1"
                    type="text"
                    name="clientName"
                    label="Name"
                    placeholder="Name"
                    multiline
                    variant="outlined"
                    {...register("clientName", {
                        required: { value: true, message: 'Missing name' },
                        maxLength: { value: 40, message: 'Name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.clientName?.message}</span>
                <br />

                <TextField
                    id="outlined-textarea-1"
                    type="text"
                    name="clientLastName"
                    label="Customer : Last Name"
                    placeholder="Customer : Last Name"
                    multiline
                    variant="outlined"
                    {...register("clientLastName", {
                        required: { value: false, message: 'Missing name' },
                        maxLength: { value: 40, message: 'Name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.clientLastName?.message}</span>
                <br />

                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="clientEmail"
                    label="Email"
                    placeholder="Email"
                    multiline
                    variant="outlined"
                    {...register("clientEmail", {
                        required: { value: true, message: 'Missing email!' },
                        maxLength: { value: 60, message: 'Email is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' },
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.clientEmail?.message}</span>
                <br />

                <TextField
                    id="outlined-textarea-1"
                    type="text"
                    name="clientPassword"
                    label="Password"
                    placeholder="Password"
                    multiline
                    variant="outlined"
                    {...register("clientPassword", {
                        required: { value: true, message: 'Missing password' },
                        maxLength: { value: 40, message: 'Password is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.clientPassword?.message}</span>
                <br />

                <FormControl className={classes.formControl} {...register("clientType", { required: { value: true, message: 'Missing Category' } })}>
                    <InputLabel id="demo-controlled-open-select-label">Client Type</InputLabel>
                    <Select
                        className="selectCategory"
                        labelId="clientType"
                        id="clientType"
                        value={type}
                        onChange={handleChange}
                        name="clientType"
                    >
                        <option value="">None</option>
                        <option value="COMPANY">COMPANY</option>
                        <option value="CUSTOMER">CUSTOMER</option>
                    </Select>
                </FormControl>
                <br />
                <span className="errorMessage">{errors.clientType?.message}</span>
                <br />

                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" disabled={!isDirty || !isValid} type="submit" value="Register">Register</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>
        </div>
    );
}

export default Register;


