import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const location = useLocation();
  const auth = useSelector((state: { auth: { isAuthenticated: boolean; user?: { role: string } } }) => state.auth);

  if (!auth.isAuthenticated) {
    // Determine the appropriate login page based on the user's role
    const loginPath = location.pathname.startsWith('/seller') ? '/seller/login' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => role === auth.user?.role);

    if (!hasRequiredRole) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;