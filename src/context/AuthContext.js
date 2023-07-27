import React, { createContext, useEffect, useState } from 'react';
import axiosClient from '../axios/axios-client';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();
  const logout = () => {
    axiosClient
      .get(`/${userRole}/logout`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setToken(null);
    setUserRole(null);
    setUser(null);
    navigate(userRole === 'admin' ? 'admin/login' : '/login');
  };

  const isAuthenticated = () => {
    if (!token) {
      logout();
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userRole, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
