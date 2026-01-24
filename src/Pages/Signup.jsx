    import { useState } from "react";
    import { useNavigate, Link } from "react-router-dom";
    import { signupEmail, loginWithGoogle } from "../services/authService";
    import { toastSuccess, alertError } from "../utils/alert";
    import "../Styles/Auth.css";

    const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!email || !password) {
        return alertError("Missing fields", "Please enter email and password.");
        }

        try {
        setLoading(true);
        await signupEmail(email, password);
        toastSuccess("Account created 🎉");
        navigate("/my-events");
        } catch (err) {
        console.error(err);

        if (err.code === "auth/email-already-in-use") {
            alertError("Email already in use", "Please login instead.");
            return navigate("/login");
        }

        if (err.code === "auth/weak-password") {
            return alertError("Weak password", "Use at least 6 characters.");
        }

        if (err.code === "auth/invalid-email") {
            return alertError("Invalid email", "Please enter a valid email address.");
        }

        alertError("Signup failed", err.message || "Please try again.");
        } finally {
        setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
        setLoading(true);
        await loginWithGoogle();
        toastSuccess("Signed in with Google ✅");
        navigate("/my-events");
        } catch (err) {
        console.error(err);

        if (err.code === "auth/account-exists-with-different-credential") {
            return alertError(
            "Account exists",
            "This email already exists. Try logging in with Email/Password."
            );
        }

        alertError("Google sign-in failed", err.message || "Please try again.");
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
            />

            <label className="auth-label">Password</label>
            <input
                className="auth-input"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
