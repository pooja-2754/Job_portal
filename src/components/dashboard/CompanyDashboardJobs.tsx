import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';
import { companyJobService } from '../../services/companyJobService';
import type { Job } from '../../types/job.types';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Search,
  RefreshCw,
  Clock,
  Filter
} from 'lucide-react';

const CompanyDashboardJobs: React.FC = () => {
  const { isAuthenticated } = useCompanyAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [jobs, setJobs] = useState<Job[]>([]);
  
  // Loading states
  const [isInitialLoad, setIsInitialLoad] = useState(true); // For the very first render
  const [isContentLoading, setIsContentLoading] = useState(false); // For subsequent updates
  const [isRefreshing, setIsRefreshing] = useState(false); // For manual refresh
  
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active'>((filterParam === 'active') ? 'active' : 'all');
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/company-login');
      return;
    }
    // Only trigger fetch if we are not already loading to prevent double firing
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentPage, filterStatus]);

  const fetchJobs = async (isManualRefresh = false) => {
    try {
      setError('');
      
      // Determine which loading indicator to show
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (jobs.length === 0 && isInitialLoad) {
        // Keep component blocked only on very first load if you prefer, 
        // or just use isContentLoading for everything.
        setIsContentLoading(true);
      } else {
        setIsContentLoading(true);
      }
      
      let response;
      
      // Logic based on original code: 
      // If 'active', fetch all active jobs (no pagination). 
      // If 'all', fetch paginated jobs.
      if (filterStatus === 'active') {
        const activeJobs = await companyJobService.getActiveCompanyJobs();
        setJobs(activeJobs);
        setTotalPages(1);
      } else {
        response = await companyJobService.getCompanyJobs({
          page: currentPage,
          size: 10,
        });
        setJobs(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsInitialLoad(false);
      setIsContentLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchJobs(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await companyJobService.deleteCompanyJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  // Client-side filtering logic (applied to the fetched data)
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Render Helpers ---

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100 h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
      <p>Loading jobs...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Briefcase className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {searchTerm ? 'No matches found' : 'No jobs posted'}
      </h3>
      <p className="text-gray-500 max-w-sm mb-6">
        {searchTerm 
          ? `We couldn't find any jobs matching "${searchTerm}". Try different keywords.`
          : 'Get started by creating your first job posting to attract top talent.'
        }
      </p>
      {!searchTerm && (
        <button
          onClick={() => navigate('/company-dashboard/jobs/new')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job Post
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-500 mt-1">
            View and manage your active listings and applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isContentLoading}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => navigate('/company-dashboard/jobs/new')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            <span className="font-medium">Post Job</span>
          </button>
        </div>
      </div>

      {/* --- Controls Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6">
        <div className="flex flex-col md:flex-row gap-4 p-3">
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, company, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
            />
          </div>
          
          {/* Filters */}
          <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => { setCurrentPage(0); setFilterStatus('all'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => { setCurrentPage(0); setFilterStatus('active'); }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filterStatus === 'active'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              Active Only
            </button>
          </div>
        </div>
      </div>

      {/* --- Error Banner --- */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <div className="mr-3 text-red-500">
            <Filter className="w-5 h-5" /> 
          </div>
          {error}
        </div>
      )}

      {/* --- Main Content Area --- */}
      {/* 
         This is the critical part: 
         We render the structure above, then conditionally render the *content* below.
      */}
      <div className="min-h-[400px]">
        {isContentLoading ? (
          renderLoadingState()
        ) : filteredJobs.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{job.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          job.isActive 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {/* Job Meta Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{job.location.city}, {job.location.state}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{job.type}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">
                            {typeof job.salary === 'string' ? job.salary : job.salary?.formatted || 'Competitive'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{job.applicationCount || 0} Applicants</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3 mt-3">
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Posted {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently'}
                        </div>
                        {job.deadline && (
                          <div className={`flex items-center ${
                             new Date(job.deadline) < new Date() ? 'text-red-500 font-medium' : ''
                          }`}>
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
                      <button
                        onClick={() => navigate(`/company-dashboard/jobs/${job.id}`)}
                        className="flex-1 md:flex-none flex items-center justify-center p-2 text-gray-600 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors group/btn"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 md:mr-2" />
                        <span className="md:hidden lg:inline text-sm font-medium">View</span>
                      </button>
                      <button
                        onClick={() => navigate(`/company-dashboard/jobs/${job.id}/edit`)}
                        className="flex-1 md:flex-none flex items-center justify-center p-2 text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4 md:mr-2" />
                        <span className="md:hidden lg:inline text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="flex-1 md:flex-none flex items-center justify-center p-2 text-gray-600 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4 md:mr-2" />
                        <span className="md:hidden lg:inline text-sm font-medium">Delete</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Pagination --- */}
      {totalPages > 1 && !isContentLoading && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 text-sm text-gray-600 font-medium">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboardJobs;