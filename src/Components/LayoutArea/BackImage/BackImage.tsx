import "./BackImage.css";
import BImage from "../../../Assets/images/002.png";

function BackImage(): JSX.Element {
    return (
        <div className="BackImage">
			<img src={BImage} alt="Back Image"/>
        </div>
    );
}

export default BackImage;
