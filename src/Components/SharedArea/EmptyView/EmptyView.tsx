import { Box, Typography } from "@material-ui/core";
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
                <br />
                <Typography className="EM1" variant="h5" noWrap>
                    <Box fontWeight="fontWeightMedium">
                    &nbsp; &nbsp; Empty view!
                        </Box>
                </Typography>
                <Typography className="EM2">
                        <span>&nbsp; &nbsp; &nbsp; {this.props.msg}</span>
                </Typography>
                <br />
            </div>
        );
    }
}

export default EmptyView;
