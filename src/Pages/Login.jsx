    import { useState } from "react";
    import { useNavigate, Link, useLocation } from "react-router-dom";
    import { loginEmail, loginWithGoogle } from "../services/authService";
    import { toastSuccess, alertError } from "../utils/alert";
    import "../Styles/Auth.css";

    const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ send user back to where they came from (invite link, protected page, etc.)
    const from = location.state?.from?.pathname || "/explore";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
        return alertError("Missing fields", "Please enter email and password.");
        }

        try {
        setLoading(true);
        await loginEmail(email, password);

        toastSuccess("Welcome back 🎉");
        navigate(from, { replace: true }); // ✅ go back to the event/details page
        } catch (err) {
        console.error(err);

        if (err.code === "auth/user-not-found") {
            return alertError("No account found", "Please sign up first.");
        }
        if (err.code === "auth/wrong-password") {
            return alertError("Wrong password", "Please try again.");
        }
        if (err.code === "auth/invalid-credential") {
            return alertError("Invalid login", "Email or password is incorrect.");
        }
        if (err.code === "auth/invalid-email") {
            return alertError("Invalid email", "Please enter a valid email address.");
        }

        alertError("Login failed", err.message || "Please try again.");
        } finally {
        setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
        setLoading(true);
        await loginWithGoogle();

        toastSuccess("Logged in with Google ✅");
        navigate(from, { replace: true }); // ✅ go back to the event/details page
        } catch (err) {
        console.error(err);
        alertError("Google login failed", err.message || "Please try again.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="auth-page">
        <div className="auth-card">
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Login to manage your events</p>

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
