    import { useState } from "react";
    import { useNavigate, Link } from "react-router-dom";
    import { signupEmail, loginWithGoogle } from "../services/authService";
    import "../Styles/Auth.css";

    const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
        alert("Please enter email and password.");
        return;
        }

        if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
        }

        try {
        setLoading(true);
        await signupEmail(cleanEmail, password);
        navigate("/my-events");
        } catch (err) {
        console.error(err);

        if (err.code === "auth/email-already-in-use") {
            alert("This email already has an account. Please login.");
            navigate("/login");
            return;
        }

        if (err.code === "auth/account-exists-with-different-credential") {
            alert("This email exists. Try logging in with Google.");
            navigate("/login");
            return;
        }

        alert(err.message || "Signup failed");
        } finally {
        setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
        setLoading(true);
        await loginWithGoogle();
        navigate("/my-events");
        } catch (err) {
        console.error(err);

        if (err.code === "auth/account-exists-with-different-credential") {
            alert("This email exists already. Try logging in with email/password.");
            navigate("/login");
            return;
        }

        alert(err.message || "Google sign-in failed");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="auth-page">
        <div className="auth-card">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Start creating events in minutes</p>

            <button className="auth-google" onClick={handleGoogle} disabled={loading}>
            Continue with Google
            </button>

            <div className="auth-divider">
            <span>or</span>
            </div>

            <form onSubmit={handleSignup} className="auth-form">
            <label className="auth-label">Email</label>
            <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
            />

            <label className="auth-label">Password</label>
            <input
                className="auth-input"
                type="password"
                placeholder="Create a password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
            />

            <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Sign up"}
            </button>
            </form>

            <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
        </div>
    );
    };

    export default Signup;
