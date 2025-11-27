import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jobService } from '../services/jobService';
import type { Job } from '../types/job.types';
import JobManagementList from '../components/JobManagementList';
import ApplicationManagement from '../components/ApplicationManagement';

type ViewType = 'overview' | 'jobs' | 'applications';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
}

const RecruiterDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await jobService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError('Failed to fetch dashboard statistics. Please try again.');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('applications');
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setCurrentView('jobs');
  };

  const handleLogout = () => {
    logout();
  };

  const renderNavigation = () => (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Recruiter Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderSidebar = () => (
    <div className="bg-gray-50 w-64 min-h-screen p-4">
      <div className="space-y-2">
        <button
          onClick={() => setCurrentView('overview')}
          className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
            currentView === 'overview'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setCurrentView('jobs')}
          className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
            currentView === 'jobs'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Manage Jobs
        </button>
        <button
          onClick={() => {
            setSelectedJob(null);
            setCurrentView('applications');
          }}
          className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
            currentView === 'applications' && !selectedJob
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Applications
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="shrink-0 bg-indigo-100 rounded-lg p-3">
                <div className="text-indigo-600 text-2xl font-bold">{stats.totalJobs}</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                <p className="text-lg font-semibold text-gray-900">Posted</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="shrink-0 bg-green-100 rounded-lg p-3">
                <div className="text-green-600 text-2xl font-bold">{stats.activeJobs}</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="text-lg font-semibold text-gray-900">Currently Open</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="shrink-0 bg-blue-100 rounded-lg p-3">
                <div className="text-blue-600 text-2xl font-bold">{stats.totalApplications}</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-lg font-semibold text-gray-900">Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="shrink-0 bg-yellow-100 rounded-lg p-3">
                <div className="text-yellow-600 text-2xl font-bold">{stats.pendingApplications}</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-lg font-semibold text-gray-900">Review</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentView('jobs')}
              className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 font-medium"
            >
              Post a New Job
            </button>
            <button
              onClick={() => setCurrentView('applications')}
              className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 font-medium"
            >
              Review Applications
            </button>
            <button
              onClick={() => setCurrentView('jobs')}
              className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 font-medium"
            >
              Manage Existing Jobs
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">New applications received</span>
              <span className="text-sm font-medium text-gray-900">{stats.pendingApplications}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Jobs requiring attention</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalJobs - stats.activeJobs}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Active job postings</span>
              <span className="text-sm font-medium text-gray-900">{stats.activeJobs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'jobs':
        return (
          <JobManagementList
            onJobSelect={handleJobSelect}
          />
        );
      case 'applications':
        return (
          <ApplicationManagement
            selectedJobId={selectedJob?.id}
            selectedJobTitle={selectedJob?.title}
            onBack={selectedJob ? handleBackToJobs : undefined}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      <div className="flex">
        {renderSidebar()}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;