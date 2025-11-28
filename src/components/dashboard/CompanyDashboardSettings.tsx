import React from 'react';
import { Settings } from 'lucide-react';

const CompanyDashboardSettings: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
        <p className="text-gray-600 mb-4">
          Configure your account settings here
        </p>
        <p className="text-sm text-gray-500">
          This section is under construction. You'll be able to manage notifications, security settings, and other preferences here.
        </p>
      </div>
    </div>
  );
};

export default CompanyDashboardSettings;