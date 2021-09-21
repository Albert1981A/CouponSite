import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { logoutAction } from "../../../Redux/AuthAppState";
import { couponsDeleteAllAction, couponsUpdatedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { SccMsg } from "../../../Service/Notification";

function Logout(): JSX.Element {

    const [logoutDetails, setLogoutDetails] = useState(store.getState().authState.user.clientToken);
    const history = useHistory();
    
    async function logoutBack() {
        try {
            console.log(logoutDetails);
            console.log(globals.urls.client + "logout");
            const response = await tokenAxios.delete(globals.urls.client + "logout");
            store.dispatch(couponsDeleteAllAction());
            console.log(response);
            
        }
        catch (err) {
            notify.error(err);
        }
    }

    useEffect(()=> //React Hook for running side effects inside a fc
    { 
        logoutBack();
        notify.success(SccMsg.LOGOUT_SUCCESS);
        store.dispatch(logoutAction());
        history.push("/home");
    });

    return (
        <></>
    );
}

export default Logout;
