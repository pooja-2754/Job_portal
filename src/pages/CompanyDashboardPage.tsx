import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useCompanyAuth } from '../hooks/useCompanyAuth';
import { Navbar } from '../components/Navbar';
import { CompanySidebar } from '../components/CompanySidebar';

const CompanyDashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useCompanyAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/company-login');
      return;
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Sidebar - Sticky on Desktop, Fixed Bottom on Mobile */}
      <CompanySidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        {/* 
          pb-20 on mobile prevents content from being hidden behind the bottom nav.
          md:pb-8 resets it for desktop.
        */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;