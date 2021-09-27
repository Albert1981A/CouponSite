import { Notyf } from 'notyf'


export enum SccMsg {
    ADDED = 'Added successfully!',
    DOWNLOADED = 'Downloaded successfully!',
    UPDATED = 'Updated successfully!',
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
    // Must be last
    REGISTER_SUCCESS = "REGISTER_SUCCESS",
    UPDATE_COUPON = "UPDATE_COUPON"
}
export enum ErrMsg {
    ERROR_GETTING_COUPONS = "ERROR_GETTING_COUPONS",
    ERROR_GETTING_COMPANIES = "ERROR_GETTING_COMPANIES",
    ERROR_GETTING_CUSTOMERS = "ERROR_GETTING_CUSTOMERS",
    ERROR_DELETING_COUPON = "ERROR_DELETING_COUPON",
    ERROR_DELETING_COMPANY = "ERROR_DELETING_COMPANY",
    ERROR_DELETING_CUSTOMER = "ERROR_DELETING_CUSTOMER",
    NOT_YOUR_COUPON = "NOT_YOUR_COUPON",
    ONLY_COMPANY_ALLOWED = "ONLY_COMPANY_ALLOWED",
    ONLY_CUSTOMER_ALLOWED = "ONLY_CUSTOMER_ALLOWED",
    ONLY_ADMIN_ALLOWED = "ONLY_ADMIN_ALLOWED",
    PLS_LOGIN = "PLS_LOGIN",
    UPDATE_COUPON = "UPDATE_COUPON",
    TITLE_EXIST = "TITLE_EXIST",
    ALREADY_OWN_THIS_COUPON = "ALREADY_OWN_THIS_COUPON",
    ALREADY_LOGGED_IN = "ALREADY_LOGGED_IN",
    ERROR_WHILE_LOGIN = "ERROR_WHILE_LOGIN",
    ERROR_WHILE_ADDING_COUPON = "ERROR_WHILE_ADDING_COUPON",
    ERROR_WHILE_ADDING_COMPANY = "ERROR_WHILE_ADDING_COMPANY",
    ERROR_WHILE_ADDING_CUSTOMER = "ERROR_WHILE_ADDING_CUSTOMER",
    UNABLE_TO_UPDATE_COMPANY = "UNABLE_TO_UPDATE_COMPANY",
    UNABLE_TO_UPDATE_COMPANY_ID = "UNABLE_TO_UPDATE_COMPANY_ID",
    UNABLE_TO_UPDATE_COMPANY_NAME = "UNABLE_TO_UPDATE_COMPANY_NAME",
    UNABLE_TO_UPDATE_CUSTOMER_ID = "UNABLE_TO_UPDATE_CUSTOMER_ID",
    UNABLE_TO_UPDATE_CUSTOMER = "UNABLE_TO_UPDATE_CUSTOMER",
    COMPANY_NAME_EXIST = "COMPANY_NAME_EXIST",
    COMPANY_EMAIL_EXIST = "COMPANY_EMAIL_EXIST",
    CUSTOMER_EMAIL_EXIST = "CUSTOMER_EMAIL_EXIST",
    NO_COMPANY_BY_THIS_ID = "NO_COMPANY_BY_THIS_ID",
    NO_CUSTOMER_BY_THIS_ID = "NO_CUSTOMER_BY_THIS_ID"
}

class Notify {

    private notification = new Notyf({ duration: 4000, position: { x: "left", y: "top" } });
    public success(message: string) {
        this.notification.success(message);
    }

    public error(err: any) {
        const msg = this.extractMsg(err);
        this.notification.error(msg);
    }

    private extractMsg(err: any): string {
        if (typeof err === 'string') {
            return err;
        }

        if (typeof err?.response?.data === 'string') { //Backend exact error
            return err.response.data;
        }

        if (Array.isArray(err?.response?.data)) { // Backend exact error list
            return err?.response?.data[0];
        }

        // Must be last
        if (typeof err?.message === 'string') {
            return err.message;
        }

        return "An error occurred, please try again.";
    }

}

const notify = new Notify();
export default notify;