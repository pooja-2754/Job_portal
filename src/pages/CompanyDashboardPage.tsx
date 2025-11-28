import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyAuth } from '../hooks/useCompanyAuth';
import { Navbar } from '../components/Navbar';
import { CompanySidebar } from '../components/CompanySidebar';
import { Outlet } from 'react-router-dom';

const CompanyDashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useCompanyAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Only redirect if authentication check is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/company-login');
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Don't render the dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CompanySidebar />
      <div className="flex-1">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;