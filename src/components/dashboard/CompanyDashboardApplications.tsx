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
} from 'lucide-react';

const CompanyDashboardApplications: React.FC = () => {
  const { isAuthenticated } = useCompanyAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  }, [isAuthenticated, navigate, currentPage, filterStatus]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const updatedApplication = await companyApplicationService.updateCompanyApplicationStatus(
        applicationId,
        newStatus
      );
      setApplications(applications.map(app => 
        app.id === applicationId ? updatedApplication : app
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status');
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => 
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-2">
          Review and manage job applications from candidates
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Applications
            </button>
            <button
              onClick={() => setFilterStatus('Pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'Pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('Under Review')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'Under Review'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => setFilterStatus('Shortlisted')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'Shortlisted'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shortlisted
            </button>
            <button
              onClick={() => setFilterStatus('Accepted')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === 'Accepted'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Accepted
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No applications found' : 'No applications yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Applications will appear here when candidates apply to your job postings'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{application.applicantName}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {application.applicantEmail}
                      </div>
                      {application.applicantPhone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {application.applicantPhone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {application.jobTitle}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Applied: {new Date(application.appliedDate).toLocaleDateString()}
                      </div>
                    </div>

                    {application.experience && (
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Experience</h4>
                        <p className="text-sm text-gray-600">{application.experience}</p>
                      </div>
                    )}

                    {application.education && (
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Education</h4>
                        <p className="text-sm text-gray-600">{application.education}</p>
                      </div>
                    )}

                    {application.coverLetter && (
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Cover Letter</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{application.coverLetter}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/company-dashboard/applications/${application.id}`)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View application"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {application.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'Under Review')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as under review"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}
                    
                    {application.status === 'Under Review' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'Shortlisted')}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Shortlist candidate"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'Rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject application"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {application.status === 'Shortlisted' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'Accepted')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Accept application"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application.id, 'Rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject application"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboardApplications;