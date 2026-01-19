    import { useState } from "react";
    import { useNavigate, Link, useLocation } from "react-router-dom";
    import { loginEmail, loginWithGoogle } from "../services/authService";
    import "../Styles/Auth.css";

    const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ where user was trying to go before being forced to login
    const from = location.state?.from || "/my-events";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
        setLoading(true);
        await loginEmail(email, password);
        navigate(from, { replace: true }); // ✅ go back
        } catch (err) {
        console.error(err);
        alert(err.message || "Login failed");
        } finally {
        setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
        setLoading(true);
        await loginWithGoogle();
        navigate(from, { replace: true }); // ✅ go back
        } catch (err) {
        console.error(err);
        alert(err.message || "Google sign-in failed");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="auth-page">
        <div className="auth-card">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Login to continue</p>

            <button className="auth-google" onClick={handleGoogle} disabled={loading}>
            Continue with Google
            </button>

            <div className="auth-divider">
            <span>or</span>
            </div>

            <form onSubmit={handleEmailLogin} className="auth-form">
            <label className="auth-label">Email</label>
            <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label className="auth-label">Password</label>
            <input
                className="auth-input"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
            </form>

            <p className="auth-footer">
            Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
        </div>
    );
    };

    export default Login;
