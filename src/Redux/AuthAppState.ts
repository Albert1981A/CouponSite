import UserModel from "../Models/UserModel";

// Step 1 - Create AppState and manage the collection once and in a centralize place
export class AuthAppState {
    public user: UserModel = null;
    public constructor() {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            this.user = storedUser;
        }
    }
}

// Step 2 - Define ActionType using enum for all required operations
export enum AuthActionType {
    Register = "Register",
    Login = "Login",
    Logout = "Logout"
}

// Step 3 - Define Action Interface to describe actionAction & payload if needed
export interface AuthAction {
    type: AuthActionType;
    payload?: any; // ? for logout
}

// Step 4 - Export Action Creators functions that gets payload and return relevant Action
export function registerAction(user: UserModel): AuthAction {
    return { type: AuthActionType.Register, payload: user };
}

export function loginAction(user: UserModel): AuthAction {
    return { type: AuthActionType.Login, payload: user };
}

export function logoutAction(): AuthAction {
    return { type: AuthActionType.Logout };
}

// Step 5 - Reducer function perform the required action
export function authReducer(currentState: AuthAppState = new AuthAppState(),
    action: AuthAction): AuthAppState {

    // const newState = new CatsAppState();
    // newState.cats = currentState.cats;
    const newState = { ...currentState } //Spread Operator

    switch (action.type) {
        case AuthActionType.Register: //Payload is registered user from backend
            newState.user = action.payload;
            localStorage.setItem("user", JSON.stringify(newState.user)); // Saving in the session storage (won't be deleted)
            break;

        case AuthActionType.Login://Payload is logged i user from backend
            newState.user = action.payload;
            localStorage.setItem("user", JSON.stringify(newState.user)); // Saving in the session storage (won't be deleted)
            break;

        case AuthActionType.Logout: // No payload
            newState.user = null;
            localStorage.removeItem("user");
            break;
    }
    return newState;

}