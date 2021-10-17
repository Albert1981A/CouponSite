import CompanyModel from "../Models/CompanyModel";

// Step 1 - Create AppState and manage the collection once and in a centralize place
export class CompaniesAppState {
    public companies: CompanyModel[] = [];
    company: any;
}

// Step 2 - Define ActionType using enum for all required operations
export enum CompaniesActionType {
    CompaniesDownloaded = "CompaniesDownloaded",
    CompanyAdded = "CompanyAdded",
    CompanyUpdated = "CompanyUpdated",
    CompanyDeleted = "CompanyDeleted",
    CompanyDeleteAll = "CompanyDeleteAll"
}

// Step 3 - Define Action Interface to describe actionAction & payload if needed
export interface CompanyAction {
    type: CompaniesActionType;
    payload ? : any;
}

// Step 4 - Export Action Creators functions that gets payload and return relevant Action
export function companiesDownloadedAction(companies: CompanyModel[]): CompanyAction {
    return { type: CompaniesActionType.CompaniesDownloaded, payload: companies };
}

export function companiesAddedAction(company: CompanyModel): CompanyAction {
    return { type: CompaniesActionType.CompanyAdded, payload: company };
}

export function companiesUpdatedAction(company: CompanyModel): CompanyAction {
    return { type: CompaniesActionType.CompanyUpdated, payload: company };
}

export function companiesDeletedAction(id: number): CompanyAction {
    return { type: CompaniesActionType.CompanyDeleted, payload: id };
}

export function companiesDeleteAllAction(): CompanyAction {
    return { type: CompaniesActionType.CompanyDeleteAll };
}

// Step 5 - Reducer function perform the required action
export function companiesReducer(currentState: CompaniesAppState = new CompaniesAppState(), action: CompanyAction): CompaniesAppState {
    
    // const newState = new CompaniesAppState();
    // newState.companies = currentState.companies;
    const newState = {...currentState} //Spread Operator

    switch (action.type) {
        case CompaniesActionType.CompaniesDownloaded:
            newState.companies = action.payload;
            break;
        case CompaniesActionType.CompanyAdded:
            newState.companies.push(action.payload);
            break;
        case CompaniesActionType.CompanyUpdated:
            // const idx = newState.companies.filter(c => c.id === action.payload.id);
            // newState.companies[idx] = action.payload;
            const idx = newState.companies.findIndex(c => c.id === action.payload.id);
            newState.companies[idx] = action.payload;
            break;
        case CompaniesActionType.CompanyDeleted:
            newState.companies = newState.companies.filter(c => c.id !== action.payload);
            // newState.companies.fill;
            break;
        case CompaniesActionType.CompanyDeleteAll:
            newState.companies = [];
            break;
    }
    return newState;
}