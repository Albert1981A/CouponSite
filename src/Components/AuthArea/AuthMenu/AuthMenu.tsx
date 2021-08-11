import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import "./AuthMenu.css";

interface AuthMenuState {
    user: UserModel;
}

class AuthMenu extends Component<{}, AuthMenuState> {

    private unsubscribe: Unsubscribe;

    public constructor(props: {}) {
        super(props);
        this.state = {
            user: store.getState().authState.user
        };
    }

    public componentDidMount(): void {
        store.subscribe(() => {
            this.setState({ user: store.getState().authState.user })
        });
    }

    // public componentWillUnmount(): void {
    //     this.unsubscribe();
    // }
    public componentWillUnmount() {
        this.unsubscribe = store.subscribe(() => {
            this.setState({ user: store.getState().authState.user });
        })
        console.log("exit CompanyCoupons and unsubscribe");
    }

    public render(): JSX.Element {
        return (
            <div className="AuthMenu">
                {this.state.user && (
                    <>
                        <span>
                            Hello {this.state.user.clientName}
                        </span>
                        <span> | </span>
                        <NavLink to="/logout" className="normal" activeClassName="active">Logout</NavLink>
                    </>
                )}

                {!this.state.user && (
                    <>
                        <span>Hello Guest</span>
                        <span> | </span>
                        <NavLink to="/login" className="normal" activeClassName="active">Login</NavLink>
                        <span> | </span>
                        <NavLink to="/register" className="normal" activeClassName="active">Register</NavLink>
                    </>
                )}

            </div>
        );
    }
}

export default AuthMenu;
