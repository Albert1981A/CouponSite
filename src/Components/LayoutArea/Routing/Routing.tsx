import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AdminSpace from "../../AdminArea/AdminSpace/AdminSpace";
import UpdateCompanyDetails from "../../AdminArea/UpdateCompanyDetails/UpdateCompanyDetails";
import UpdateCustomerDetails from "../../AdminArea/UpdateCustomerDetails/UpdateCustomerDetails";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import CompanyCardDetails from "../../CompanyArea/CompanyCardDetails/CompanyCardDetails";
import CompanyCoupons from "../../CompanyArea/CompanyCoupons/CompanyCoupons";
import UpdateCompanyCoupon from "../../CompanyArea/UpdateCompanyCoupon/UpdateCompanyCoupon";
import AddCoupon from "../../CouponArea/AddCoupon/AddCoupon";
import CouponDetails from "../../CouponArea/CouponDetails/CouponDetails";
import CustomerCardDetails from "../../CustomerArea/CustomerCardDetails/CustomerCardDetails";
import CustomerCoupons from "../../CustomerArea/CustomerCoupons/CustomerCoupons";
import About from "../../MenuArea/About/About";
import Page404 from "../../SharedArea/Page404/Page404";
import Layout from "../Layout/Layout";
import Main from "../Main/Main";
import "./Routing.css";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
            {/* <Layout/> */}
			<Switch>
                <Route path="/home" component={Main} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/logout" component={Logout} exact />
                <Route path="/register" component={Register} exact />
                <Route path="/company-coupon-details/:id" component={CouponDetails} exact />
                <Route path="/company-card-details/:id" component={CompanyCardDetails} exact />
                <Route path="/company-coupons" component={CompanyCoupons} exact />
                <Route path="/update-company-coupon/:id" component={UpdateCompanyCoupon} exact />
                <Route path="/customer-coupons" component={CustomerCoupons} exact />
                <Route path="/customer-card-details/:id" component={CustomerCardDetails} exact />
                <Route path="/admin-space" component={AdminSpace} exact />
                <Route path="/update-company-details/:id" component={UpdateCompanyDetails} exact />
                <Route path="/update-customer-details/:id" component={UpdateCustomerDetails} exact />
                <Route path="/add-coupon" component={AddCoupon} exact />
                <Route path="/about" component={About} exact />
                <Redirect from="/" to="/home" exact/>
                <Route component={Page404}/> {/* Last */}
            </Switch>
        </div>
    );
}

export default Routing;
