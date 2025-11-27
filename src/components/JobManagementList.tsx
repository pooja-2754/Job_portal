import React, { useState, useEffect } from 'react';
import type { Job } from '../types/job.types';
import { jobService } from '../services/jobService';
import JobPostingForm from './JobPostingForm';

interface JobManagementListProps {
  onJobSelect?: (job: Job) => void;
  onPostNewJob?: () => void;
}

const JobManagementList: React.FC<JobManagementListProps> = ({ onJobSelect, onPostNewJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await jobService.getJobs();
      // Ensure we always set an array, even if the API returns unexpected data
      setJobs(Array.isArray(fetchedJobs) ? fetchedJobs : []);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error('Error fetching jobs:', err);
      // Ensure jobs is always an array even on error
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobPosted = (job: Job) => {
    if (editingJob) {
      setJobs(jobs.map(j => j.id === job.id ? job : j));
      setEditingJob(null);
    } else {
      setJobs([job, ...jobs]);
    }
    setShowForm(false);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(jobId);
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (err) {
        setError('Failed to delete job. Please try again.');
        console.error('Error deleting job:', err);
      }
    }
  };

  const handleToggleActive = async (job: Job) => {
    try {
      const updatedJob = await jobService.updateJob(job.id, { isActive: !job.isActive });
      setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
    } catch (err) {
      setError('Failed to update job status. Please try again.');
      console.error('Error updating job status:', err);
    }
  };

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => {
    if (filter === 'active') return job.isActive !== false;
    if (filter === 'inactive') return job.isActive === false;
    return true;
  }) : [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (showForm) {
    return (
      <JobPostingForm
        initialJob={editingJob || undefined}
        onJobPosted={handleJobPosted}
        onCancel={() => {
          setShowForm(false);
          setEditingJob(null);
        }}
      />
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Jobs</h2>
        <button
          onClick={onPostNewJob || (() => setShowForm(true))}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Post New Job
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({Array.isArray(jobs) ? jobs.length : 0})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'active'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active ({Array.isArray(jobs) ? jobs.filter(job => job.isActive !== false).length : 0})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'inactive'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive ({Array.isArray(jobs) ? jobs.filter(job => job.isActive === false).length : 0})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No jobs found.</p>
          <button
            onClick={onPostNewJob || (() => setShowForm(true))}
            className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Post your first job
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted
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
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    {job.salary && (
                      <div className="text-sm text-gray-500">
                        {typeof job.salary === 'object' ? job.salary.formatted || 'Salary not specified' : job.salary}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.location.city}, {job.location.state}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.postedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.isActive !== false
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => onJobSelect?.(job)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Apps
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(job)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      {job.isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
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

export default JobManagementList;