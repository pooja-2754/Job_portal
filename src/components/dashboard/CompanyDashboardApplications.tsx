import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';
import { companyApplicationService } from '../../services/companyApplicationService';
import type { Application, ApplicationStatus } from '../../types/job.types';
import {
  FileText,
  Eye,
  Check,
  X,
  Clock,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Search,
  RefreshCw,
  Filter,
  GraduationCap,
} from 'lucide-react';

const CompanyDashboardApplications: React.FC = () => {
  const { isAuthenticated } = useCompanyAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Loading states
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>(
    filter ? (filter as ApplicationStatus) : 'all'
  );
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/company-login');
      return;
    }
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentPage, filterStatus]);

  const fetchApplications = async (isManualRefresh = false) => {
    try {
      setError('');
      
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsContentLoading(true);
      }
      
      let response;
      
      if (filterStatus === 'all') {
        response = await companyApplicationService.getCompanyApplications({
          page: currentPage,
          size: 10,
        });
        setApplications(response.content);
        setTotalPages(response.totalPages);
      } else {
        const statusApplications = await companyApplicationService.getCompanyApplicationsByStatus(filterStatus);
        setApplications(statusApplications);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setIsContentLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchApplications(true);
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    // Optimistic update could go here, but for safety we await
    try {
      const updatedApplication = await companyApplicationService.updateCompanyApplicationStatus(
        applicationId,
        newStatus
      );
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? updatedApplication : app
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
    }
  };

  const getStatusBadgeStyles = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Client-side filtering logic for search term
  const filteredApplications = applications.filter(app => 
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100 h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
      <p>Loading applications...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {searchTerm ? 'No matches found' : 'No applications received'}
      </h3>
      <p className="text-gray-500 max-w-sm">
        {searchTerm 
          ? `No candidates found matching "${searchTerm}".`
          : 'Applications will appear here once candidates apply to your jobs.'
        }
      </p>
    </div>
  );

  // Helper to render action buttons based on status
  const renderActions = (app: Application) => {
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate(`/company-dashboard/applications/${app.id}`)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1.5" />
          View Details
        </button>

        {app.status === 'Pending' && (
          <button
            onClick={() => handleStatusUpdate(app.id, 'Under Review')}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Review
          </button>
        )}
        
        {(app.status === 'Under Review' || app.status === 'Pending') && (
          <>
            <button
              onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Shortlist
            </button>
            <button
              onClick={() => handleStatusUpdate(app.id, 'Rejected')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors ml-auto"
            >
              <X className="w-4 h-4 mr-1.5" />
              Reject
            </button>
          </>
        )}
        
        {app.status === 'Shortlisted' && (
          <>
            <button
              onClick={() => handleStatusUpdate(app.id, 'Accepted')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Accept
            </button>
            <button
              onClick={() => handleStatusUpdate(app.id, 'Rejected')}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors ml-auto"
            >
              <X className="w-4 h-4 mr-1.5" />
              Reject
            </button>
          </>
        )}
      </div>
    );
  };

  const filterTabs: (ApplicationStatus | 'all')[] = ['all', 'Pending', 'Under Review', 'Shortlisted', 'Accepted'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 mt-1">
            Track and manage candidate submissions.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isContentLoading}
          className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm w-full md:w-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6">
        <div className="flex flex-col gap-4 p-3">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by candidate name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setCurrentPage(0); setFilterStatus(tab); }}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {tab === 'all' ? 'All Applications' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Content Area - Scoped Loading */}
      <div className="min-h-[400px]">
        {isContentLoading && !isRefreshing ? (
          renderLoadingState()
        ) : filteredApplications.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 text-lg font-bold shrink-0">
                        {app.applicantName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{app.applicantName}</h3>
                        <p className="text-indigo-600 font-medium flex items-center text-sm mt-0.5">
                          <Briefcase className="w-3.5 h-3.5 mr-1" />
                          {app.jobTitle}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyles(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6 text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center truncate">
                      <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span className="truncate" title={app.applicantEmail}>{app.applicantEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span>{app.applicantPhone || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                    </div>
                    {(app.experience || app.education) && (
                      <div className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        <span className="truncate">See details</span>
                      </div>
                    )}
                  </div>

                  {/* Preview Content */}
                  {app.coverLetter && (
                    <div className="mb-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cover Letter Preview</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                    </div>
                  )}

                  {/* Actions Bar */}
                  {renderActions(app)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
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

export default CompanyDashboardApplications;