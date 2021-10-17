import { Button, ButtonGroup, createStyles, makeStyles, TextField, Theme, ThemeProvider, Typography, useTheme } from "@material-ui/core";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CompanyModel from "../../../Models/CompanyModel";
import { companiesUpdatedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./UpdateCompanyDetails.css";

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

interface updateCompanyDetailsProps extends RouteComponentProps<RouteParam> { }

function UpdateCompanyDetails(props: updateCompanyDetailsProps): JSX.Element {

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

    const [company, setCompany] = useState(
        store.getState().companiesState.companies.find((c) => c.id === id)
    );

    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login");
        }
        else if (store.getState().authState.user.clientType !== "ADMINISTRATOR") {
            notify.error(ErrMsg.ONLY_ADMIN_ALLOWED);
            history.push("/home");
        }
    });

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CompanyModel>({
        mode: "onTouched"
    });

    async function send(companyToSend: CompanyModel) {
        // companyToSend.id = ((Number)(companyToSend.id));
        console.log(companyToSend);
        // console.log(company);
        if (companyToSend.id != company.id) {
            notify.error(ErrMsg.UNABLE_TO_UPDATE_COMPANY_ID);
        } else if (companyToSend.name !== company.name) {
            notify.error(ErrMsg.UNABLE_TO_UPDATE_COMPANY_NAME);
        } else {
            try {
                console.log("hi... im Here - 1");
                // const formData = new FormData();
                // formData.append("id", companyToSend.id.toString());
                // formData.append("name", companyToSend.name);
                // formData.append("email", companyToSend.email);
                // formData.append("password", companyToSend.password);
                // formData.append("image", company.image.item(0));
                // formData.append("imageID", company.imageID);
                companyToSend.image = company.image;
                companyToSend.imageID = company.imageID;

                console.log("hi... im Here - 2");
                const response = await tokenAxios.put<CompanyModel>(globals.urls.admin + "companies", companyToSend);
                const added = response.data;
                // console.log(added);
                store.dispatch(companiesUpdatedAction(added));
                setCompany(store.getState().companiesState.companies.find((c) => c.id === id));
                notify.success(SccMsg.UPDATED);
                history.push('/admin-companies');
            }
            catch (err: any) {
                notify.error(ErrMsg.UNABLE_TO_UPDATE_COMPANY);
                const err1 = err as AxiosError
                if (err1.response) {
                    console.log(err1.response.status)
                    console.log(err1.response.data)
                    notify.error(err1);
                }
            }
        }
    }

    function cancel() {
        history.push('/admin-companies');
    }

    return (
        <div className="UpdateCompanyDetails Box1">

            <ThemeProvider theme={theme}>
                <Typography variant="h5" noWrap>
                    Update Company Details
                </Typography>
            </ThemeProvider>
            <br />

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit(send)}>

                {/* public id ? : number NO*/}
                <label>Company Id</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-2"
                    type="number"
                    name="id"
                    placeholder="Id"
                    value={company.id}
                    {...register("id", {
                        required: { value: true, message: 'Missing company id' },
                        pattern: { value: /^[0-9]*$/, message: 'Only integers!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.id?.message}</span>
                <br />

                {/* public name ? : string NO*/}
                <label>Name</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-2"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={company.name}
                    {...register("name", {
                        required: { value: true, message: 'Missing name!' },
                        maxLength: { value: 40, message: 'Name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.name?.message}</span>
                <br />

                {/* public email ? : string */}
                <label>Email</label> <br />
                <input
                    id="outlined-textarea-2"
                    type="text"
                    name="email"
                    placeholder="Email"
                    defaultValue={company.email}
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
                    defaultValue={company.password}
                    {...register("password", {
                        required: { value: true, message: 'Missing last name!' },
                        maxLength: { value: 40, message: 'Last name is limit upto 40 Characters!' },
                        minLength: { value: 2, message: 'Minimum length of 2 Characters!' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.password?.message}</span>
                <br />

                {/* public image ? : FileList NO*/}
                {/* <label>Image</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-2"
                    type="file"
                    name="image"
                    placeholder="Image"
                    {...register("image", {
                        required: { value: true, message: 'Missing company image' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.imageID?.message}</span>
                <br /> */}

                {/* public imageID ? : string NO*/}
                {/* <label>Image Id</label> <br />
                <input
                    className="disabledArea1"
                    id="outlined-textarea-2"
                    type="text"
                    name="imageID"
                    placeholder="Image-Id"
                    value={company.imageID}
                    {...register("imageID", {
                        required: { value: true, message: 'Missing company image id' }
                    })}
                />
                <br />
                <span className="errorMessage">{errors.imageID?.message}</span>
                <br /> */}

                <ButtonGroup variant="contained" fullWidth>
                    <Button color="primary" disabled={!isDirty || !isValid} type="submit" value="Update">Update</Button>
                    <Button color="secondary" onClick={cancel}>Cancel</Button>
                </ButtonGroup>

            </form>

        </div>
    );
}

export default UpdateCompanyDetails;
