import { Component } from "react";
import "./EmptyView.css";

interface viewProps {
    msg: string;
}

class EmptyView extends Component<viewProps> {

    public constructor(props: viewProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div className="EmptyView">
				<h2>Empty view!</h2>
                <span>{this.props.msg}</span>
            </div>
        );
    }
}

export default EmptyView;
