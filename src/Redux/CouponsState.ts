import CouponModel from "../Models/CouponModel";

// Step 1 - Create AppState and manage the collection once and in a centralize place
export class CouponsAppState {
    public coupons: CouponModel[] = [];
    public allCoupons: CouponModel[] = [];
}

// Step 2 - Define ActionType using enum for all required operations
export enum CouponsActionType {
    CouponsDownloaded = "CouponsDownloaded",
    CouponAdded = "CouponAdded",
    CouponUpdated = "CouponUpdated",
    CouponDeleted = "CouponDeleted",
    CouponDeleteAll = "CouponDeleteAll",
    AllCouponsDownloaded = "AllCouponsDownloaded",
    AllCouponAdded = "AllCouponAdded",
    AllCouponUpdated = "AllCouponUpdated",
    AllCouponDeleted = "AllCouponDeleted"
}

// Step 3 - Define Action Interface to describe actionAction & payload if needed
export interface CouponAction {
    type: CouponsActionType;
    payload ? : any;
}

// Step 4 - Export Action Creators functions that gets payload and return relevant Action
export function couponsDownloadedAction(coupons: CouponModel[]): CouponAction {
    return { type: CouponsActionType.CouponsDownloaded, payload: coupons };
}

export function couponsAddedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.CouponAdded, payload: coupon };
}

export function couponsUpdatedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.CouponUpdated, payload: coupon };
}

export function couponsDeletedAction(id: number): CouponAction {
    return { type: CouponsActionType.CouponDeleted, payload: id };
}

export function couponsDeleteAllAction(): CouponAction {
    return { type: CouponsActionType.CouponDeleteAll };
}

// new
export function allCouponsDownloadedAction(coupons: CouponModel[]): CouponAction {
    return { type: CouponsActionType.AllCouponsDownloaded, payload: coupons };
}

export function allCouponsAddedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.AllCouponAdded, payload: coupon };
}

export function allCouponsUpdatedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.AllCouponUpdated, payload: coupon };
}

export function allCouponsDeletedAction(id: number): CouponAction {
    return { type: CouponsActionType.AllCouponDeleted, payload: id };
}

// Step 5 - Reducer function perform the required action
export function couponsReducer(currentState: CouponsAppState = new CouponsAppState(), action: CouponAction): CouponsAppState {

    // const newState = new CouponsAppState();
    // newState.coupons = currentState.coupons;
    const newState = {...currentState} //Spread Operator

    switch (action.type) {
        case CouponsActionType.CouponsDownloaded:
            newState.coupons = action.payload;
            break;
        case CouponsActionType.CouponAdded:
            newState.coupons.push(action.payload);
            break;
        case CouponsActionType.CouponUpdated:
            // const idx = newState.coupons.filter(c => c.id === action.payload.id);
            // newState.coupons[idx] = action.payload;
            const idx = newState.coupons.findIndex(c => c.id === action.payload.id);
            newState.coupons[idx] = action.payload;
            break;
        case CouponsActionType.CouponDeleted:
            newState.coupons = newState.coupons.filter(c => c.id !== action.payload);
            // newState.coupons.fill;
            break;
        case CouponsActionType.CouponDeleteAll:
            // newState.coupons = action.payload;
            newState.coupons = [];
            break;

        // new
        case CouponsActionType.AllCouponsDownloaded:
            newState.allCoupons = action.payload;
            break;
        case CouponsActionType.AllCouponAdded:
            newState.allCoupons.push(action.payload);
            break;
        case CouponsActionType.AllCouponUpdated:
            // const idx = newState.coupons.filter(c => c.id === action.payload.id);
            // newState.coupons[idx] = action.payload;
            const idx2 = newState.allCoupons.findIndex(c => c.id === action.payload.id);
            newState.allCoupons[idx2] = action.payload;
            break;
        case CouponsActionType.AllCouponDeleted:
            newState.allCoupons = newState.allCoupons.filter(c => c.id !== action.payload);
            // newState.coupons.fill;
            break;
    }
    return newState;
}