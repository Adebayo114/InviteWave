    import { Navigate, useLocation } from "react-router-dom";
    import { useAuth } from "../context/useAuth";

    const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) return <div className="container">Loading...</div>;

    if (!user) {
        // ✅ remember the page they tried to open
        return (
        <Navigate
            to="/login"
            replace
            state={{ from: location.pathname + location.search }}
        />
        );
    }

    return children;
    };

    export default ProtectedRoute;
