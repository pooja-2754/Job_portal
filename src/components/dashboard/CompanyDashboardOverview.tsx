import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';
import { companyJobService } from '../../services/companyJobService';
import type { Job, Application } from '../../types/job.types';
import {
  Briefcase,
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  Building,
  Calendar,
  BarChart3,
} from 'lucide-react';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  inactiveJobs: number;
  expiredJobs: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  recentApplications: Application[];
  topJobsByApplications: Array<{
    job: Job;
    applicationCount: number;
  }>;
  jobsWithApproachingDeadlines: Job[];
}

const CompanyDashboardOverview: React.FC = () => {
  const { company } = useCompanyAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const dashboardStats = await companyJobService.getCompanyDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 text-center">
          <p>No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {company?.name || 'Company'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your job postings and applications
        </p>
      </div>

      {/* Company Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <Building className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{company?.name || 'Company Name'}</h2>
              <p className="text-gray-600">{company?.email}</p>
              {company?.industry && (
                <p className="text-sm text-gray-500">Industry: {company.industry}</p>
              )}
              {company?.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {company.website}
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/company-dashboard/profile')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/company-dashboard/jobs/new')}
            className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </button>
          <button
            onClick={() => navigate('/company-dashboard/jobs')}
            className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            Manage Jobs
          </button>
          <button
            onClick={() => navigate('/company-dashboard/applications')}
            className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            View Applications
          </button>
          <button
            onClick={() => navigate('/company-dashboard/analytics')}
            className="flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/company-dashboard/jobs')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                <p className="text-xs text-gray-500 mt-1">Click to view all jobs</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/company-dashboard/jobs?filter=active')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
                <p className="text-xs text-gray-500 mt-1">Currently accepting applications</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/company-dashboard/applications')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                <p className="text-xs text-gray-500 mt-1">Across all job postings</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/company-dashboard/applications?filter=pending')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingApplications}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting your response</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
            <button
              onClick={() => navigate('/company-dashboard/applications')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="p-6">
            {stats.recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent applications</p>
                <button
                  onClick={() => navigate('/company-dashboard/jobs/new')}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Post a job to receive applications
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentApplications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/company-dashboard/applications/${application.id}`)}>
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Users className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{application.applicantName}</p>
                        <p className="text-sm text-gray-600">{application.jobTitle}</p>
                        <p className="text-xs text-gray-500">
                          Applied {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Jobs with Approaching Deadlines */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Jobs with Approaching Deadlines</h3>
            <button
              onClick={() => navigate('/company-dashboard/jobs?filter=deadline')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="p-6">
            {stats.jobsWithApproachingDeadlines.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No jobs with approaching deadlines</p>
                <button
                  onClick={() => navigate('/company-dashboard/jobs/new')}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Post a new job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.jobsWithApproachingDeadlines.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/company-dashboard/jobs/${job.id}`)}>
                    <div className="flex items-center">
                      <div className="bg-orange-100 p-2 rounded-full mr-3">
                        <Calendar className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-600">
                          Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not set'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {job.applicationCount || 0} applications
                        </p>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Performing Jobs */}
      {stats.topJobsByApplications.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Top Jobs by Applications</h3>
            <button
              onClick={() => navigate('/company-dashboard/jobs?sort=applications')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topJobsByApplications.slice(0, 5).map((item, index) => (
                <div key={item.job.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/company-dashboard/jobs/${item.job.id}`)}>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3 flex items-center justify-center text-green-600 font-bold text-sm w-7 h-7">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.job.title}</p>
                      <p className="text-sm text-gray-600">{item.applicationCount} applications</p>
                      <p className="text-xs text-gray-500">
                        Posted {item.job.postedDate ? new Date(item.job.postedDate).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboardOverview;