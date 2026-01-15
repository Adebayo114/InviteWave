    import { Link, useNavigate } from "react-router-dom";
    import { logout } from "../services/authService";
    import { useAuth } from "../context/useAuth";



    import image from "../assets/Logo/logo1.png";
    import "../Styles/Navbar.css";

    const Navbar = () => {
    const navigate = useNavigate();
    const { user, authLoading } = useAuth(); // ✅ Firebase user

    const handleLogout = async () => {
        try {
        await logout();
        navigate("/login");
        } catch (err) {
        console.error(err);
        alert("Logout failed. Try again.");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm px-3 py-2">
        <div className="container">
            <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/">
            <img src={image} alt="InviteWave logo" className="navbar-logo" />
            <span className="ms-2">InviteWave</span>
            </Link>

            <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            >
            <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item mx-2">
                <Link className="nav-link" to="/">
                    Home
                </Link>
                </li>

                <li className="nav-item mx-2">
                <Link className="nav-link" to="/explore">
                    Explore
                </Link>
                </li>

                {/* While auth state is loading, don’t flash login/logout */}
                {!authLoading && user && (
                <>
                    <li className="nav-item mx-2">
                    <Link className="nav-link" to="/create-event">
                        Create Event
                    </Link>
                    </li>

                    <li className="nav-item mx-2">
                    <Link className="nav-link" to="/my-events">
                        My Events
                    </Link>
                    </li>
                </>
                )}

                <li className="nav-item mx-2">
                <Link className="nav-link" to="/about">
                    About
                </Link>
                </li>

                {!authLoading && !user ? (
                <>
                    <li className="nav-item mx-2">
                    <Link className="btn btn-outline-primary px-3 py-1" to="/login">
                        Login
                    </Link>
                    </li>

                    <li className="nav-item mx-2">
                    <Link className="btn btn-primary px-3 py-1" to="/signup">
                        Sign Up
                    </Link>
                    </li>
                </>
                ) : null}

                {!authLoading && user ? (
                <li className="nav-item mx-2 d-flex align-items-center gap-2">
                    {/* Optional: show name/email */}
                    <span className="small text-muted d-none d-lg-inline">
                    {user.displayName || user.email}
                    </span>

                    <button className="btn btn-danger px-3 py-1" onClick={handleLogout}>
                    Logout
                    </button>
                </li>
                ) : null}
            </ul>
            </div>
        </div>
        </nav>
    );
    };

    export default Navbar;
