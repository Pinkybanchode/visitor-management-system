import { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import getUserFromToken from "../Helpers/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const existingUser = getUserFromToken();
    if (existingUser) {
      setUser(existingUser);
    } 
  }, []);

  const login = async (data) => {
    const res = await API.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);

    const loggedInUser = getUserFromToken();
    setUser(loggedInUser);
  };

  const logout = () =>{
    localStorage.removeItem("token"); 
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};