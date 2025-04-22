import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  const addCartToUser = (cartId) => {
    setUser((prev) => ({ ...prev, cartId }));
    localStorage.setItem("user", JSON.stringify({ ...user, cartId }));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, addCartToUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
