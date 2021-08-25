import "./Logo.css";
import logoImage from "../../../Assets/images/AlbertCoupons.png";

function Logo(): JSX.Element {
    return (
        <div className="Logo">
			<img src={logoImage} alt="Albert Coupons Logo"/>
        </div>
    );
}

export default Logo;
