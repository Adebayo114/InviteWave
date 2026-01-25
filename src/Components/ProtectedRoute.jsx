    import { Navigate, useLocation } from "react-router-dom";
    import { useAuth } from "../context/useAuth";

    const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) return <div className="container">Loading...</div>;

    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

    return children;
    };

    export default ProtectedRoute;
