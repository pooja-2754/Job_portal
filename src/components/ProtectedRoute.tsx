import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCompanyAuth } from '../hooks/useCompanyAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'seeker' | 'recruiter' | 'company';
  authType?: 'user' | 'company' | 'any';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  authType = 'any'
}) => {
  const {
    isAuthenticated: userIsAuthenticated,
    isLoading: userIsLoading,
    user
  } = useAuth();
  
  const {
    isAuthenticated: companyIsAuthenticated,
    isLoading: companyIsLoading
  } = useCompanyAuth();

  const isLoading = userIsLoading || companyIsLoading;

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check authentication type requirements first
  if (authType === 'user' && !userIsAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (authType === 'company' && !companyIsAuthenticated) {
    return <Navigate to="/company-login" replace />;
  }

  // If not authenticated and authType is 'any', redirect to appropriate login page
  if (authType === 'any' && !userIsAuthenticated && !companyIsAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements for users
  if (requiredRole && userIsAuthenticated) {
    if (requiredRole === 'seeker' && user?.role !== 'JOB_SEEKER') {
      return <Navigate to="/unauthorized" replace />;
    }
    if (requiredRole === 'recruiter' && user?.role !== 'ADMIN') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check role requirements for companies
  if (requiredRole === 'company' && !companyIsAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;