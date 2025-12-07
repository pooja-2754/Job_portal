import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanyAuth } from '../../hooks/useCompanyAuth';
import { companyJobService } from '../../services/companyJobService';
import CompanyDashboardJobForm from './CompanyDashboardJobForm';
import type { Job } from '../../types/job.types';
import { ArrowLeft, Edit, Trash2, Users, Calendar, MapPin, Briefcase, DollarSign } from 'lucide-react';

const CompanyDashboardJobDetails: React.FC = () => {
  const { isAuthenticated } = useCompanyAuth();
  const { id, '*': wildcard } = useParams<{ id: string; '*': string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Determine if we're in edit mode based on the URL
  const isEditing = wildcard === 'edit';

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError('');
        const jobData = await companyJobService.getCompanyJob(id);
        setJob(jobData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleEditJob = () => {
    navigate(`/company-dashboard/jobs/${id}/edit`);
  };

  const handleJobUpdated = () => {
    // Navigate back to view mode after updating
    navigate(`/company-dashboard/jobs/${id}`);
  };

  const handleCancelEdit = () => {
    // Navigate back to view mode when canceling
    navigate(`/company-dashboard/jobs/${id}`);
  };

  const handleDeleteJob = async () => {
    if (!job?.id || !window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await companyJobService.deleteCompanyJob(job.id);
      navigate('/company-dashboard/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  if (!isAuthenticated) {
    return null; // Will be handled by the protected route
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
        Job not found
      </div>
    );
  }

  // If we're in edit mode, show the form
  if (isEditing && job) {
    return (
      <div className="max-w-4xl mx-auto">
        <CompanyDashboardJobForm
          initialJob={job}
          onJobPosted={handleJobUpdated}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/company-dashboard/jobs')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company.name}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleEditJob}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Job
            </button>
            <button
              onClick={handleDeleteJob}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Job details card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Job header with status */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
              job.isActive 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {job.isActive ? 'Active' : 'Inactive'}
            </span>
            <div className="text-sm text-gray-500">
              Job ID: {job.id}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{job.location.city}, {job.location.state}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              <span>
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
              <Calendar className="w-3.5 h-3.5 mr-1" />
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

        {/* Job description */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
          <div 
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: job.descriptionHtml || job.description || '' }} 
          />
        </div>

        {/* Job requirements */}
        {job.requirementsHtml && (
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: job.requirementsHtml }} 
            />
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboardJobDetails;