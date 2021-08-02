import { Button, ButtonGroup, Typography } from "@material-ui/core";
import { Component } from "react";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./CompanyCoupons.css";

class CompanyCoupons extends Component {

    public render(): JSX.Element {
        return (
            <div className="CompanyCoupons">


                <h2 className="head">Company Coupons	&nbsp; &nbsp;</h2>

                <div className="topButtonsGroup">
                    <ButtonGroup color="primary" size="small" aria-label="outlined primary button group">
                        <Button>Add coupon</Button>
                        <Button>coupon List</Button>
                    </ButtonGroup>
                </div>

                <Typography paragraph>
                    This section shows all the company's coupons.
                    You can add and remove coupons and you can also update the existing coupons.
                    Please note that a coupon with the same title to an existing coupon should not be added.
                    If an existing coupon is updated, it is not possible to update the coupon code. Also, you cannot updated the company code.
                </Typography>

                <CompanyCard />

            </div>
        );
    }
}

export default CompanyCoupons;
