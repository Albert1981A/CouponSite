import { Button, createStyles, FormHelperText, InputLabel, makeStyles, MenuItem, NativeSelect, Select, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { registerAction } from "../../../Redux/AuthAppState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import notify, { SccMsg } from "../../../Service/Notification";
import "./Register.css";

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

    async function send(user: UserModel) {
        console.log(user);
        try {
            const response = await axios.post<UserModel>(globals.urls.client + "register", user);
            store.dispatch(registerAction(response.data));
            console.log(response.data);
            notify.success(SccMsg.REGISTER_SUCCESS);
            history.push("/home"); // Redirect to home in success
        }
        catch (err) {
            notify.error(err);
        }
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
                        required: { value: true, message: 'Missing Name' },
                        maxLength: { value: 10, message: 'First name is limit upto 10 Characters' }
                    })}
                />
                <br />
                <span>{errors.clientName?.message}</span>
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
                        required: { value: true, message: 'Missing Email' },
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid Email' }
                    })}
                />
                <br />
                <span>{errors.clientEmail?.message}</span>
                <br />
                <TextField
                    id="outlined-textarea-3"
                    type="text"
                    name="clientType"
                    label="Type"
                    placeholder="Type"
                    multiline
                    variant="outlined"
                    {...register("clientType", {
                        required: { value: true, message: 'Missing Type' }
                    })}
                />

                {/* <input type="submit" disabled={!isDirty || !isValid} value="Register" /> */}
                <Button variant="contained" type="submit" color="primary" disabled={!isDirty || !isValid} value="Register" >Register</Button>

            </form>
        </div>
    );
}

export default Register;

// function setValue(value: string) {
//     throw new Error("Function not implemented.");
// }

