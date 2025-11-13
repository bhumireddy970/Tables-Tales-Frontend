import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('email');
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/needaccess" replace />;
  }

  return children;
};

export default PrivateRoute;