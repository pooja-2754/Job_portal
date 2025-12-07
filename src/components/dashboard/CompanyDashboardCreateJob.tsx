import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyDashboardJobForm from './CompanyDashboardJobForm';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';

const CompanyDashboardCreateJob: React.FC = () => {
  const { isAuthenticated } = useCompanyAuth();
  const navigate = useNavigate();

  const handleJobPosted = () => {
    // Navigate to the jobs list after successfully posting a job
    navigate('/company-dashboard/jobs');
  };

  const handleCancel = () => {
    // Navigate back to the jobs list when canceling
    navigate('/company-dashboard/jobs');
  };

  if (!isAuthenticated) {
    return null; // Will be handled by the protected route
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CompanyDashboardJobForm
        onJobPosted={handleJobPosted}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CompanyDashboardCreateJob;