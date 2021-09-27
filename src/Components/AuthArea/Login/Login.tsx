import { Button, createStyles, makeStyles, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import { loginAction } from "../../../Redux/AuthAppState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./Login.css";

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

function Login(): JSX.Element {

    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    
    const [type, setType] = React.useState<string | string>('');
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = useState(store.getState().authState.user);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setType(event.target.value as string);
    };

    const theme = useTheme();
    
    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CredentialsModel>({ mode: "onTouched" });
    const history = useHistory();

    async function send(credentials: CredentialsModel) {
        console.log(credentials);
        if (!user) {
            try {
                const response = await axios.post<UserModel>(globals.urls.client + "login", credentials);
                console.log(response.data);
                store.dispatch(loginAction(response.data));
                setUser(store.getState().authState.user);
                notify.success(SccMsg.LOGIN_SUCCESS);
                const clientType = store.getState().authState.user.clientType
                console.log(clientType);

                // switch(clientType.clientType){
                //     case "ADMINISTRATOR":
                //         history.push("/admin-space"); 
                //         break;

                //         case "COMPANY":
                //         history.push("/company-coupons");
                //         break;

                //         case "CUSTOMER":
                //         history.push("/customer-coupons");
                //         break;

                //         default:
                //         history.push("/home");
                // }
                if (clientType === "ADMINISTRATOR") {
                    history.push("/admin-space");
                } else if (clientType === "COMPANY") {
                    history.push("/company-coupons");
                } else if (clientType === "CUSTOMER") {
                    history.push("/customer-coupons");
                }
            }
            catch (err) {
                notify.error(ErrMsg.ERROR_WHILE_LOGIN);
                notify.error(err);
            }
        } else {
            notify.error(ErrMsg.ALREADY_LOGGED_IN);
        }

    }

    // useEffect(() => {
    //     const unsubscribe = store.subscribe(() => {
    //         setUser(store.getState().authState.user)
    //         return unsubscribe;
    //     })

    // });

    return (
        <div className="Login Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Login
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(send)}>

                {/* <input
                    type="text"
                    placeholder="Email"
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
                <br /> */}

                <TextField
                    id="outlined-textarea-3"
                    type="text"
                    name="email"
                    label="Email"
                    placeholder="Email"
                    multiline
                    variant="outlined"
                    {...register("email", {
                        required: { value: true, message: 'Missing email!' },
                        maxLength: { value: 60, message: 'email is limit upto 50 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' },
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.email?.message}</span>
                <br />

                {/* <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: true,
                        minLength: 4,
                        maxLength: 12,
                    })}
                />
                <br /> */}

                <TextField                
                    id="outlined-textarea-3"
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    // multiline
                    variant="outlined"
                    {...register("password", {
                        required: { value: true, message: 'Missing password!' },
                        maxLength: { value: 12, message: 'email is limit upto 50 Characters!' },
                        minLength: { value: 4, message: 'Minimum length of 2 Characters!' }                       
                    })}
                    // {...register("password", {
                    //     required: true,
                    //     minLength: 4,
                    //     maxLength: 12,
                    // })}
                />
                <br />
                <span className="errorMessage">{errors.password?.message}</span>
                <br />

                {/* <input type="submit" value="Login" /> */}

                <Button variant="contained" type="submit" color="primary" value="Login" disabled={!isDirty || !isValid}>Login</Button>

            </form>
        </div>
    );
}

export default Login;

