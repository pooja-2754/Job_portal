import React from 'react';
import { BarChart3, TrendingUp, Users, Briefcase } from 'lucide-react';

const CompanyDashboardAnalytics: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track your job posting performance and recruitment metrics
        </p>
      </div>

      {/* Placeholder Analytics Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Application Rate</p>
              <p className="text-2xl font-bold text-gray-900">8.5%</p>
              <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time to Hire</p>
              <p className="text-2xl font-bold text-gray-900">14 days</p>
              <p className="text-xs text-red-600 mt-1">+2 days from last month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-500 mt-1">No change</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-600 mb-4">
          Detailed analytics and charts will be displayed here
        </p>
        <p className="text-sm text-gray-500">
          This section is under construction. Check back soon for detailed insights about your job postings and recruitment metrics.
        </p>
      </div>
    </div>
  );
};

export default CompanyDashboardAnalytics;