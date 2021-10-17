import CustomerModel from "../Models/CustomerModel";

// Step 1 - Create AppState and manage the collection once and in a centralize place
export class CustomersAppState {
    public customers: CustomerModel[] = [];
}

// Step 2 - Define ActionType using enum for all required operations
export enum CustomersActionType {
    CustomersDownloaded = "CustomersDownloaded",
    CustomerAdded = "CustomerAdded",
    CustomerUpdated = "CustomerUpdated",
    CustomerDeleted = "CustomerDeleted",
    CustomerDeleteAll = "CustomerDeleteAll"
}

// Step 3 - Define Action Interface to describe actionAction & payload if needed
export interface CustomerAction {
    type: CustomersActionType;
    payload ? : any;
}

// Step 4 - Export Action Creators functions that gets payload and return relevant Action
export function customersDownloadedAction(customers: CustomerModel[]): CustomerAction {
    return { type: CustomersActionType.CustomersDownloaded, payload: customers };
}

export function customersAddedAction(customer: CustomerModel): CustomerAction {
    return { type: CustomersActionType.CustomerAdded, payload: customer };
}

export function customersUpdatedAction(customer: CustomerModel): CustomerAction {
    return { type: CustomersActionType.CustomerUpdated, payload: customer };
}

export function customersDeletedAction(id: number): CustomerAction {
    return { type: CustomersActionType.CustomerDeleted, payload: id };
}

export function customersDeleteAllAction(): CustomerAction {
    return { type: CustomersActionType.CustomerDeleteAll };
}

// Step 5 - Reducer function perform the required action
export function customersReducer(currentState: CustomersAppState = new CustomersAppState(), action: CustomerAction): CustomersAppState {
    
    // const newState = new CouponsAppState();
    // newState.customers = currentState.customers;
    const newState = {...currentState} //Spread Operator

    switch (action.type) {
        case CustomersActionType.CustomersDownloaded:
            newState.customers = action.payload;
            break;
        case CustomersActionType.CustomerAdded:
            newState.customers.push(action.payload);
            break;
        case CustomersActionType.CustomerUpdated:
            // const idx = newState.customers.filter(c => c.id === action.payload.id);
            // newState.customers[idx] = action.payload;
            const idx = newState.customers.findIndex(c => c.id === action.payload.id);
            newState.customers[idx] = action.payload;
            break;
        case CustomersActionType.CustomerDeleted:
            newState.customers = newState.customers.filter(c => c.id !== action.payload);
            // newState.customers.fill;
            break;
        case CustomersActionType.CustomerDeleted:
            newState.customers = [];
            break;
    }
    return newState;
}