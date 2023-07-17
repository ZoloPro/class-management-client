import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    localStorage.setItem('user', JSON.stringify(user));
  }, [token, userRole, setUser]);

  const login = (newToken, role, user) => {
    setToken(newToken);
    setUserRole(role);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userRole, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
