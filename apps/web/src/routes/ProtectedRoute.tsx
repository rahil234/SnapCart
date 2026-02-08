import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';

import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles?: Array<'CUSTOMER' | 'SELLER' | 'ADMIN'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const location = useLocation();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (isAuthenticated) {
    const loginPath = location.pathname.startsWith('/seller')
      ? '/seller/login'
      : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => role === user.role);

    if (!hasRequiredRole) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
