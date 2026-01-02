import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuth");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (email, password) => {
        localStorage.setItem("isAuth", "true");
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("isAuth");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};