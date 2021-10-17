import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { logoutAction } from "../../../Redux/AuthAppState";
import { companiesDeleteAllAction, companiesDeletedAction } from "../../../Redux/CompaniesState";
import { couponsDeleteAllAction, couponsUpdatedAction } from "../../../Redux/CouponsState";
import { customersDeleteAllAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";

function Logout(): JSX.Element {

    const history = useHistory();
    
    async function logoutBack(): Promise<void> {
        try {
            const response = await tokenAxios.delete<any>(globals.urls.client + "logout");
            store.dispatch(couponsDeleteAllAction());
            store.dispatch(companiesDeleteAllAction());
            store.dispatch(customersDeleteAllAction());
        }
        catch (err: any) {
            notify.error(ErrMsg.ERROR_LOGOUT);
            notify.error(err.massage);
        }
    }

    useEffect(() => 
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
