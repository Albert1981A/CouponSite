import { combineReducers, createStore } from "redux";
import { authReducer } from "./AuthAppState";
import { companiesReducer } from "./CompaniesState";
import { couponsReducer } from "./CouponsState";
import { customersReducer } from "./CustomersState";

// Single Reducer
// const customerStore = createStore(customersReducer);

// For getting data
// const xys = customerStore.getState().customers;

// Multiple customersReducer
const reducers = combineReducers({customersState: customersReducer, couponsState: couponsReducer, companiesState: companiesReducer, authState: authReducer});
const store = createStore(reducers);

// For getting data
// const companies = store.getState().companiesState.companies;
// const coupons = store.getState().couponsState.coupons;
// const customers = store.getState().customersState.customers;
// const customers = store.getState().authState.user;

export default store;