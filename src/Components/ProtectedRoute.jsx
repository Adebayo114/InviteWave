    import { Navigate } from "react-router-dom";
    import { useAuth } from "../context/useAuth";


    const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useAuth();

    if (authLoading) return <div className="container">Loading...</div>;

    if (!user) return <Navigate to="/login" replace />;

    return children;
    };

    export default ProtectedRoute;
