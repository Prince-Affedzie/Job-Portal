// src/Context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });
  

  const login = (userRole) => {
    setRole(userRole);
    localStorage.setItem("role", userRole); // persist across reloads
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role");
  };

  useEffect(() => {
    // Optional: Sync role with localStorage if needed
    const storedRole = localStorage.getItem("role");
    if (storedRole && !role) {
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
