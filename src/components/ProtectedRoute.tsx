import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  adminRoute: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminRoute }) => {
  const token = localStorage.getItem('token');
    const userType = localStorage.getItem("userType");

  // If no token, redirect to login
  if (!token) {
    if(adminRoute) {
        return userType === "admin" ? children :  <Navigate to="/login" />;
    }
    return <Navigate to="/login" />;
  };

  return children;
};

export default ProtectedRoute;
