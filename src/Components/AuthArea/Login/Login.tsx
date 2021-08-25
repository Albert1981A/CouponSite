import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import { loginAction } from "../../../Redux/AuthAppState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { SccMsg } from "../../../Service/Notification";
import "./Login.css";



function Login(): JSX.Element {

    const [user, setUser] = useState(store.getState().authState.user);

    const history = useHistory(); //Redirect function
    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsModel>();

    async function send(credentials: CredentialsModel) {
        console.log(credentials);
        try {
            const response = await axios.post<UserModel>(globals.urls.client + "login", credentials);
            console.log(response.data);
            store.dispatch(loginAction(response.data));
            // setUser(store.getState().authState.user);


            console.log("user:" + user);

            notify.success(SccMsg.LOGIN_SUCCESS);
            const clientType = store.getState().authState.user.clientType
            console.log(clientType);

            // switch(clientType.clientType){
            //     case "ADMINISTRATOR":
            //         history.push("/admin-space"); 
            //         return;

            //         case "COMPANY":
            //         history.push("/company-coupons");
            //         return;

            //         case "CUSTOMER":
            //         history.push("/customer-coupons");
            //         return;

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
            notify.error(err);
        }

    }

useEffect(() => {
    const unsubscribe = store.subscribe(() => {
        setUser(store.getState().authState.user)
        return unsubscribe;
    })
    
});

return (
    <div className="Login Box1">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(send)}>

            <input
                type="text"
                placeholder="Email"
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                {...register("password", {
                    required: true,
                    minLength: 4,
                    maxLength: 12,
                })}
            />
            <br />
            

            <input type="submit" value="Login" />

        </form>
    </div>
);
}

export default Login;

