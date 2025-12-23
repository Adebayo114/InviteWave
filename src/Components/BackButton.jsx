    import { ArrowLeft } from "lucide-react";
    import { useNavigate } from "react-router-dom";
    import "../Styles/BackButton.css";

    const BackButton = ({ label = "Back" }) => {
    const navigate = useNavigate();

    return (
        <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        <span>{label}</span>
        </button>
    );
    };

    export default BackButton;
