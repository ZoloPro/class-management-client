import React, { useContext } from 'react'
import { Route, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ role, children }) => {
  const { isAuthenticated, userRole } = useContext(AuthContext)

  return isAuthenticated && userRole === role ? (
    children
  ) : (
    <Navigate to={`${role === 'admin' ? '/admin/login' : '/login'}`} />
  )
}

export default ProtectedRoute
