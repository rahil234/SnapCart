import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  if (!auth.isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = auth.user?.roles || [];
    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      // Redirect to Not Authorized page or show a message
      return <Navigate to="/not-authorized" replace />;
    }
  }

  // User is authenticated and has the required roles
  return children;
};

export default ProtectedRoute;