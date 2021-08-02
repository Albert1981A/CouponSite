import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import CompanyCoupons from "../../CompanyArea/CompanyCoupons/CompanyCoupons";
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
                <Route path="/company-coupons" component={CompanyCoupons} exact />
                <Route path="/customer-coupons" component={CustomerCoupons} exact />
                <Route path="/about" component={About} exact />
                <Redirect from="/" to="/home" exact/>
                <Route component={Page404}/> {/* Last */}
            </Switch>
        </div>
     
    );
}

export default Routing;
