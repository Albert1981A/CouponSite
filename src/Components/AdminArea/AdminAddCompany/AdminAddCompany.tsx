import { Button, ButtonGroup, createStyles, Input, makeStyles, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CompanyLoadModel from "../../../Models/CompanyLoadModel";
import CompanyModel from "../../../Models/CompanyModel";
import { companiesAddedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./AdminAddCompany.css";

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

function AdminAddCompany(): JSX.Element {

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

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CompanyLoadModel>({ mode: "onTouched" });

    async function send(companyToSend: CompanyModel) {
        console.log(companyToSend);
        if (store.getState().companiesState.companies.find(c => c.name === companyToSend.name)) {
            notify.error(ErrMsg.COMPANY_NAME_EXIST);
        } else if (store.getState().companiesState.companies.find(c => c.email === companyToSend.email)) {
            notify.error(ErrMsg.COMPANY_EMAIL_EXIST);
        } else {
            try {
                const response = await tokenAxios.post<CompanyModel>(globals.urls.admin + "companies", companyToSend);
                const added = response.data;
                console.log(added);
                store.dispatch(companiesAddedAction(added));
                notify.success(SccMsg.ADDED);
                history.push("/admin-companies")
            } catch (err) {
                notify.error(ErrMsg.ERROR_WHILE_ADDING_COMPANY);
                notify.error(err);
            }
        }
    }

    function cancel() {
        history.push('/admin-companies');
    }

    return (
        <div className="AdminAddCompany Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Add Company
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(send)}>

                {/* public name ? : string NO */}
                <TextField
                    id="outlined-textarea-2"
                    type="text"
                    name="name"
                    label="Name"
                    placeholder="Name"
                    multiline
                    variant="outlined"
                    {...register("name", {
                        required: { value: true, message: 'Missing name' },
                        maxLength: { value: 40, message: 'Name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.name?.message}</span>
                <br />
                {/* public email ? : string NO */}
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

                {/* <label className="labelAdd">Image</label>
                <input
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
                <span>{errors.image?.message}</span>
                <br />
                <br /> */}




                {/* <label for="avatar">Choose a profile picture:</label> */}

                <input type="file"
                    id="avatar" name="image"
                    accept="image/png, image/jpeg"
                    // style={{ display: "none" }}
                    accessKey={`${process.env.PUBLIC_URL}/assets/images/`}
                    
                    // ref={`${process.env.PUBLIC_URL}/assets/images/`}
                    {...register("image", {
                        required: { value: true, message: 'Missing image!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' },
                    })}
                ></input>



                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" disabled={!isDirty || !isValid} type="submit" value="create">Add Company</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>

        </div>
    );
}

export default AdminAddCompany;
