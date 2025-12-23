    import { useState } from "react";
    import { useNavigate, Link } from "react-router-dom";
    import { loginUser } from "../utils/auth";
    import "../Styles/Auth.css";

    const Login = () => {
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
        <h1>Login</h1>

        <form onSubmit={handleSubmit} className="auth-form">
            <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <button type="submit">Login</button>
        </form>

        <div className="auth-footer">
            Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
        </div>
    );
    };

    export default Login;
