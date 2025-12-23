    import { Navigate } from "react-router-dom";
    import { getAuthUser } from "../utils/auth";

    const ProtectedRoute = ({ children }) => {
    const user = getAuthUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
    };

    export default ProtectedRoute;
