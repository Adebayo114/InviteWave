    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { loginUser } from "../utils/auth";
    import "../Styles/Auth.css";

    const Signup = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
        alert("Please enter your name");
        return;
        }

        loginUser({
        id: Date.now(),
        name,
        });

        navigate("/my-events");
    };

    return (
        <div className="container auth-page">
        <h1>Create an Account</h1>

        <form onSubmit={handleSubmit} className="auth-form">
            <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <button type="submit">Sign Up</button>
        </form>
        </div>
    );
    };

    export default Signup;
