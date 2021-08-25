import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { companiesUpdatedAction } from "../../../Redux/CompaniesState";
import store from "../../../Redux/Store";
import globals from "../../../Service/Globals";
import tokenAxios from "../../../Service/InterceptorAxios";
import notify, { ErrMsg, SccMsg } from "../../../Service/Notification";
import "./UpdateCompanyCoupon.css";


interface RouteParam {
    id: string;
}
interface CouponDetailsProps extends RouteComponentProps<RouteParam> { }

function UpdateCompanyCoupon(props: CouponDetailsProps): JSX.Element {

    const { register, handleSubmit, formState: { errors, isDirty, isValid } } = useForm<CouponModel>({
        mode: "onTouched"
    });
    const history = useHistory();
    const id = +props.match.params.id;
    const [coupon, setCompany] = useState(
        store.getState().companiesState.company.find((c: { id: number; }) => c.id === id)
    );
    useEffect(() => {
        // If we don't have a user object - we are not logged in
        if (!store.getState().authState.user) {
            notify.error(ErrMsg.PLS_LOGIN);
            history.push("/login")
        }
    })

    async function send(coupon: CouponModel) {
        
        console.log(coupon);
        try {
            
            const response = await tokenAxios.put<CouponModel>(globals.urls.company + "/coupon", coupon);
            const added = response.data;
            store.dispatch(companiesUpdatedAction(added)); //With Redux
            notify.success(SccMsg.UPDATE_COUPON)
            history.push('/company')
        }
        catch (err) {
            console.log(err.message);
            notify.error(ErrMsg.UPDATE_COUPON);
        }
    }
    function getDate(date: Date): string {
        const myDate = new Date(date);
        const year  = myDate.getFullYear();
        const month = ("0" + (myDate.getMonth() + 1)).slice(-2);
        const day = ("0" + myDate.getDate()).slice(-2);
        const newDate = year+"-"+month+"-"+day;
        return newDate;
    }
    
    return (
        <div className="UpdateCompanyCoupon">
			<h2>Update Company Coupon</h2>
            <br />
            <form onSubmit={handleSubmit(send)}>

                <label>Category</label>
                <br />
                <input type="category" name="category"
                    value={coupon.category}
                    {...register("category")} />
                <br />

                <label>Company Id</label>
                <br />
                <input type="number" name="companyID"
                    value={coupon.companyId}
                    {...register("companyID")} />
                <br />

                <label>Title</label>
                <br />
                <input type="text" name="title"
                    value={coupon.title}
                    {...register("title", {
                        required: true,
                        minLength: 2
                    })} />
                <br />

                <label>Price</label>
                <br />
                <input type="double" name="price"
                    defaultValue={coupon.price}
                    {...register("price", {
                        required: true,
                    })} />
                <br />

                <label>Amount</label>
                <br />
                <input type="number" name="amount"
                    defaultValue={coupon.amount}
                    {...register("amount", {
                        required: true,
                    })} />
                <br />


                <label>Description</label>
                <br />
                <input type="text" name="description"
                    defaultValue={coupon.description}
                    {...register("description", {
                        required: true,
                        minLength: 10
                    })} />
                <br />

                <label>Start Date</label>
                <br />
                <input type="date" name="startDate"
                    // defaultValue={coupon.start_date}
                    defaultValue={getDate(coupon.start_date)}
                    {...register("startDate", {
                        required: true,
                    })} />
                <br />
                <label>End Date</label>
                <br />
                <input type="date" name="endDate"
                    defaultValue={getDate(coupon.end_date)}
                    {...register("endDate", {
                        required: true,
                    })} />
                <br />

                <button type="submit" color="primary">Update coupon</button>
            </form>
        </div>
    );
}

export default UpdateCompanyCoupon;
