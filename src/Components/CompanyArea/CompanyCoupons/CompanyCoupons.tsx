import { Button, ButtonGroup, Grid, Link, Typography } from "@material-ui/core";
import axios from "axios";
import { count } from "console";
import { Component } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Unsubscribe } from "redux";
import CouponsModel from "../../../Models/CouponModel";
import { companiesDownloadedAction } from "../../../Redux/CompaniesState";
import { couponsDownloadedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import EmptyView from "../../SharedArea/EmptyView/EmptyView";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./CompanyCoupons.css";

interface CouponListState {
    coupons: CouponsModel[];
    // count: number;
}

class CompanyCoupons extends Component<{}, CouponListState> {

    private unsubscribe: Unsubscribe;

    public constructor(props: {}) {
        super(props);
        this.state = {
            coupons: store.getState().couponsState.coupons,
            // count: store.getState().couponsState.coupons.length
        };
    }

    public async componentDidMount() {

        try {
            if (this.state.coupons.length === 0) {
                const response = await axios.get<CouponsModel[]>(globals.urls.company + "coupons");
                // store.dispatch(catsDownloadedAction(response.data)); // updating AppState (global state)
                store.dispatch(couponsDownloadedAction(response.data));
                if (response.data.length !== 0) {
                    this.setState({ coupons: response.data }); // updating the local state
                }
            }
        }
        catch (err) {
            alert(err.message);
        }
        this.unsubscribe = store.subscribe(() => {
            this.setState({ coupons: store.getState().couponsState.coupons }); // Will let us notify
        })

    }
    public handleClick(): void {
        console.log("in handleClick");
        <NavLink to="/add-coupon" exact />
    }

    public render(): JSX.Element {
        return (
            <div className="CompanyCoupons">

                <h2 className="head">Company Coupons &nbsp; &nbsp;</h2>

                <div className="topButtonsGroup">

                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                        <NavLink className="link" to="/add-coupon">
                            <Button color="primary">
                                Add Coupon
                            </Button>
                        </NavLink>
                        <NavLink className="link" to="/add-coupon">
                            <Button color="primary">
                                Coupon list
                            </Button>
                        </NavLink>
                    </ButtonGroup>
                </div>

                <br /><br />

                <Typography paragraph>
                    This section shows all the company's coupons.
                    You can add and remove coupons and you can also update the existing coupons.
                    Please note that a coupon with the same title to an existing coupon should not be added.
                    If an existing coupon is updated, it is not possible to update the coupon code. Also, you cannot updated the company code.
                </Typography>

                <div className="cards Box">
                    <Grid container spacing={4}>
                        {this.state.coupons.length === 0 && <EmptyView msg="No Coupon downloaded!" />}
                        {this.state.coupons.length !== 0 && this.state.coupons.map(c =>
                            <Grid item key={c.id} xs={12} sm={6} md={4}>
                                <CompanyCard key={c.id} coupon={c} />
                            </Grid>
                        )}
                    </Grid>
                </div>

            </div>
        );
    }

    public componentWillUnmount(): void {
        this.unsubscribe();

        console.log("exit CompanyCoupons and unsubscribe");
    }
}

export default CompanyCoupons;
