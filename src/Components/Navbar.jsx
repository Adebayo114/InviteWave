    import { Link, useNavigate } from "react-router-dom";
    import { getAuthUser, logoutUser } from "../utils/auth";
    import "../Styles/Navbar.css";

    const Navbar = () => {
    const navigate = useNavigate();
    const user = getAuthUser(); // 👈 check login status

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm px-3 py-2">
        <div className="container">
            <Link className="navbar-brand fw-bold fs-4" to="/">
            InviteWave
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
                <Link className="nav-link" to="/">Home</Link>
                </li>

                <li className="nav-item mx-2">
                <Link className="nav-link" to="/explore">Explore</Link>
                </li>

                {user && (
                <>
                    <li className="nav-item mx-2">
                    <Link className="nav-link" to="/create-event">Create Event</Link>
                    </li>

                    <li className="nav-item mx-2">
                    <Link className="nav-link" to="/my-events">My Events</Link>
                    </li>
                </>
                )}

                <li className="nav-item mx-2">
                <Link className="nav-link" to="/about">About</Link>
                </li>

                {!user ? (
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
                ) : (
                <li className="nav-item mx-2">
                    <button
                    className="btn btn-danger px-3 py-1"
                    onClick={handleLogout}
                    >
                    Logout
                    </button>
                </li>
                )}
            </ul>
            </div>
        </div>
        </nav>
    );
    };

    export default Navbar;
