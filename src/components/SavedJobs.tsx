import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, type SavedJobItem } from '../services/userService';
import {
  Bookmark,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const SavedJobs: React.FC = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [removing, setRemoving] = useState<number | null>(null);

  const fetchSavedJobs = async (page = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await userService.getSavedJobs(page, 10);
      setSavedJobs(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
      setCurrentPage(res.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs(0);
  }, []);

  const handleRemove = async (savedJob: SavedJobItem) => {
    try {
      setRemoving(savedJob.savedJobId);
      await userService.unsaveJob(savedJob.jobId);
      setSavedJobs(prev => prev.filter(j => j.savedJobId !== savedJob.savedJobId));
      setTotalElements(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove saved job');
    } finally {
      setRemoving(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-blue-100 text-blue-800';
      case 'PART_TIME': return 'bg-green-100 text-green-800';
      case 'INTERNSHIP': return 'bg-purple-100 text-purple-800';
      case 'REMOTE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bookmark className="w-6 h-6 mr-2 text-blue-600" />
            Saved Jobs
          </h2>
          <div className="text-sm text-gray-500">
            {totalElements} {totalElements === 1 ? 'job' : 'jobs'} saved
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-500 mb-4">Browse jobs and click "Save Job" to bookmark them here.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Browse Jobs
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div key={job.savedJobId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900">{job.jobTitle}</h3>
                          {!job.jobActive && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              No longer active
                            </span>
                          )}
                          {job.type && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                              {job.type.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                          {job.companyName && (
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.companyName}
                            </span>
                          )}
                          {job.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                          )}
                          {job.deadline && (
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Deadline: {formatDate(job.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      {job.jobActive ? (
                        <button
                          onClick={() => navigate(`/jobs/${job.jobId}`)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          View & Apply
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/jobs/${job.jobId}`)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-default"
                          disabled
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Job Closed
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(job)}
                        disabled={removing === job.savedJobId}
                        className="inline-flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove from saved"
                      >
                        {removing === job.savedJobId
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchSavedJobs(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fetchSavedJobs(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedJobs;
