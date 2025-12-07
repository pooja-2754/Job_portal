import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/Navbar';
import { applicationService } from '../services/applicationService';
import type { Application, ApplicationsResponse, ApplicationsQueryParams } from '../types/application.types';
import {
  Briefcase,
  Calendar,
  Building,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X,
  Download
} from 'lucide-react';

const ApplicationsPage: React.FC = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  
  // Sorting state
  const [sortBy, setSortBy] = useState<string>('appliedDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  
  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fetchApplications = async () => {
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params: ApplicationsQueryParams = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir
      };
      
      const response: ApplicationsResponse = await applicationService.fetchApplications(token, params);
      setApplications(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token, currentPage, pageSize, sortBy, sortDir]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
    setCurrentPage(0); // Reset to first page when sorting
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'SHORTLISTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'UNDER_REVIEW':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'SHORTLISTED':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'ACCEPTED':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const formatDate = (dateInput: string | number[]) => {
    if (!dateInput) return 'N/A';
    
    try {
      let date: Date;
      
      // Handle array format [year, month, day, hour, minute, second, nanosecond]
      if (Array.isArray(dateInput)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
        // JavaScript months are 0-indexed, but the array seems to be 1-indexed
        date = new Date(year, month - 1, day, hour, minute, second);
      } else {
        // Handle string format
        date = new Date(dateInput);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const handlePreview = (application: Application) => {
    setPreviewUrl(application.resumePreviewUrl);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
  };

  const handleDownload = (application: Application) => {
    window.open(application.resumeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track the status of your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-4">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'UNDER_REVIEW').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'SHORTLISTED' || app.status === 'ACCEPTED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(0);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Showing {applications.length} of {totalElements} applications
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Applications List */}
            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500">Start applying for jobs to see them here</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('jobTitle')}
                        >
                          <div className="flex items-center">
                            Job
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('jobCompany')}
                        >
                          <div className="flex items-center">
                            Company
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('appliedDate')}
                        >
                          <div className="flex items-center">
                            Applied Date
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resume
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{application.jobTitle}</div>
                              <div className="text-sm text-gray-500">ID: {application.jobId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-900">{application.jobCompany}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-900">{formatDate(application.appliedDate)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              <span className="ml-1">{application.statusDisplayName}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {application.resumePreviewUrl ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handlePreview(application)}
                                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                                  title="Preview Resume"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </button>
                                <button
                                  onClick={() => handleDownload(application)}
                                  className="text-green-600 hover:text-green-800 inline-flex items-center"
                                  title="Download Resume"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400">No resume</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                            <span className="font-medium">{totalPages}</span>
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 0}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Previous</span>
                              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            
                            {/* Page Numbers */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i;
                              } else if (currentPage < 3) {
                                pageNum = i;
                              } else if (currentPage >= totalPages - 3) {
                                pageNum = totalPages - 5 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === pageNum
                                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNum + 1}
                                </button>
                              );
                            })}
                            
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages - 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Next</span>
                              <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <img
                src={previewUrl}
                alt="Resume Preview"
                className="max-w-full h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;