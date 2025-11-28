import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'JOB_SEEKER' | 'ADMIN';
  allowedRoles?: ('JOB_SEEKER' | 'ADMIN')[];
  fallbackPath?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
  fallbackPath = '/unauthorized'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check if user is in allowed roles list
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authorized, render children
  return <>{children}</>;
};

// Higher-order component for specific roles
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute requiredRole="ADMIN" fallbackPath="/unauthorized">
    {children}
  </RoleBasedRoute>
);

export const JobSeekerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute requiredRole="JOB_SEEKER" fallbackPath="/unauthorized">
    {children}
  </RoleBasedRoute>
);

// For routes that allow multiple roles
export const JobSeekerOrAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute allowedRoles={['JOB_SEEKER', 'ADMIN']} fallbackPath="/unauthorized">
    {children}
  </RoleBasedRoute>
);

// For recruiter routes (ADMIN role)
export const RecruiterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleBasedRoute requiredRole="ADMIN" fallbackPath="/unauthorized">
    {children}
  </RoleBasedRoute>
);