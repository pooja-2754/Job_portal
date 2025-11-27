import React, { useState, useEffect } from 'react';
import type { Application, ApplicationStatus } from '../types/job.types';
import { jobService } from '../services/jobService';

interface ApplicationManagementProps {
  selectedJobId?: string;
  selectedJobTitle?: string;
  onBack?: () => void;
}

const ApplicationManagement: React.FC<ApplicationManagementProps> = ({
  selectedJobId,
  selectedJobTitle,
  onBack
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const fetchedApplications = await jobService.getApplications(selectedJobId);
      // Ensure we always set an array, even if the API returns unexpected data
      setApplications(Array.isArray(fetchedApplications) ? fetchedApplications : []);
    } catch (err) {
      setError('Failed to fetch applications. Please try again.');
      console.error('Error fetching applications:', err);
      // Ensure applications is always an array even on error
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updatedApplication = await jobService.updateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app => 
        app.id === applicationId ? updatedApplication : app
      ));
      
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(updatedApplication);
      }
    } catch (err) {
      setError('Failed to update application status. Please try again.');
      console.error('Error updating application status:', err);
    } finally {
      setIsUpdatingStatus(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredApplications = Array.isArray(applications) ? applications.filter(app =>
    statusFilter === 'all' || app.status === statusFilter
  ) : [];

  const statusCounts = Array.isArray(applications) ? applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<ApplicationStatus, number>) : {};

  if (selectedApplication) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
            <p className="text-gray-600 mt-1">{selectedApplication.jobTitle}</p>
          </div>
          <button
            onClick={() => setSelectedApplication(null)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Name:</span>
                  <span className="text-gray-900">{selectedApplication.applicantName}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Email:</span>
                  <span className="text-gray-900">{selectedApplication.applicantEmail}</span>
                </div>
                {selectedApplication.applicantPhone && (
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-32">Phone:</span>
                    <span className="text-gray-900">{selectedApplication.applicantPhone}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-medium text-gray-700 w-32">Applied Date:</span>
                  <span className="text-gray-900">{formatDate(selectedApplication.appliedDate)}</span>
                </div>
              </div>
            </div>

            {selectedApplication.coverLetter && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
              </div>
            )}

            {selectedApplication.experience && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.experience}</p>
              </div>
            )}

            {selectedApplication.education && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.education}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
              <div className="space-y-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
                
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Update Status:</label>
                  {(['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'] as ApplicationStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedApplication.id, status)}
                      disabled={isUpdatingStatus || status === selectedApplication.status}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        status === selectedApplication.status
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedApplication.resume && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                <a
                  href={selectedApplication.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedJobTitle ? `Applications for ${selectedJobTitle}` : 'All Applications'}
          </h2>
          <p className="text-gray-600 mt-1">
            {selectedJobId ? `${Array.isArray(applications) ? applications.length : 0} application(s)` : `${Array.isArray(applications) ? applications.length : 0} total application(s)`}
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Jobs
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              statusFilter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({Array.isArray(applications) ? applications.length : 0})
          </button>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as ApplicationStatus)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                statusFilter === status
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status} ({count as number})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No applications found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{application.applicantName}</div>
                    <div className="text-sm text-gray-500">{application.applicantEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.appliedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;