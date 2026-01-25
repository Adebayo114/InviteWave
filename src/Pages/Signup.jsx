    import { useState } from "react";
    import { useNavigate, Link, useLocation } from "react-router-dom";
    import { signupEmail, loginWithGoogle } from "../services/authService";
    import { toastSuccess, alertError } from "../utils/alert";
    import "../Styles/Auth.css";

    const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ send user back to where they came from (invite link, protected page, etc.)
    const from = location.state?.from?.pathname || "/explore";

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
        navigate(from, { replace: true }); // ✅ go back to invite link
        } catch (err) {
        console.error(err);

        if (err.code === "auth/email-already-in-use") {
            alertError("Account exists", "This email already has an account. Please login.");
            return navigate("/login", { replace: true, state: { from: location.state?.from } });
        }

        if (err.code === "auth/weak-password") {
            return alertError("Weak password", "Password should be at least 6 characters.");
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

        toastSuccess("Signed up with Google ✅");
        navigate(from, { replace: true }); // ✅ go back to invite link
        } catch (err) {
        console.error(err);

        if (err.code === "auth/account-exists-with-different-credential") {
            return alertError(
            "Account exists",
            "This email already exists. Try logging in with Email/Password or the correct provider."
            );
        }

        alertError("Google signup failed", err.message || "Please try again.");
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
