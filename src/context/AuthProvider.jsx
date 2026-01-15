    import { useEffect, useState } from "react";
    import { AuthContext } from "./AuthContext";
    import { authListener } from "../services/authService";

    const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsub = authListener((u) => {
        setUser(u || null);
        setAuthLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authLoading }}>
        {children}
        </AuthContext.Provider>
    );
    };

    export default AuthProvider;
