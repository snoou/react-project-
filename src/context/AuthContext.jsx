import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
      const users = await res.json();

      if (users.length > 0) {
        const loggedInUser = users[0];
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        return { success: true };
      } else {
        return { success: false, message: "ایمیل یا رمز عبور اشتباه است" };
      }
    } catch (error) {
      return { success: false, message: "خطا در برقراری ارتباط با سرور" };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};