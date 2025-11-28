import React from 'react';
import { Calendar } from 'lucide-react';

const CompanyDashboardInterviews: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interview Schedule</h1>
        <p className="text-gray-600 mt-2">
          Manage and schedule interviews with candidates
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Interview Scheduler</h3>
        <p className="text-gray-600 mb-4">
          Schedule and manage your interviews here
        </p>
        <p className="text-sm text-gray-500">
          This section is under construction. You'll be able to schedule interviews, send invitations, and manage your interview calendar here.
        </p>
      </div>
    </div>
  );
};

export default CompanyDashboardInterviews;