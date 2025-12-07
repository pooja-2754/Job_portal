import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Job } from '../types/job.types';
import {
  Bookmark,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  ExternalLink,
  Trash2,
  Loader2,
  Search,
  Filter
} from 'lucide-react';

const SavedJobs: React.FC = () => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchSavedJobs();
  }, [token]);

  const fetchSavedJobs = async () => {
    if (!token) {
      setError('Authentication token not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call when saved jobs endpoint is available
      // For now, we'll simulate with mock data
      const mockSavedJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: {
            id: 1,
            name: 'Tech Corp',
            website: 'https://techcorp.com',
            description: 'A leading technology company',
            industry: 'Technology',
            size: '1000+'
          },
          location: {
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            zipCode: '94105'
          },
          type: 'FULL_TIME',
          description: 'We are looking for an experienced frontend developer...',
          requirements: '5+ years of experience with React',
          salary: {
            min: 120000,
            max: 160000,
            currency: 'USD',
            period: 'yearly',
            isNegotiable: false,
            formatted: '$120k - $160k'
          },
          postedDate: '2023-12-01',
          deadline: '2024-01-15',
          isActive: true
        },
        {
          id: '2',
          title: 'Full Stack Engineer',
          company: {
            id: 2,
            name: 'StartupXYZ',
            website: 'https://startupxyz.com',
            description: 'An innovative startup',
            industry: 'Technology',
            size: '50-100'
          },
          location: {
            city: 'Remote',
            state: '',
            country: 'USA'
          },
          type: 'REMOTE',
          description: 'Join our team as a full stack engineer...',
          requirements: 'Experience with Node.js and React',
          salary: {
            min: 100000,
            max: 140000,
            currency: 'USD',
            period: 'yearly',
            isNegotiable: true,
            formatted: '$100k - $140k'
          },
          postedDate: '2023-11-28',
          deadline: '2024-01-10',
          isActive: true
        }
      ];
      setSavedJobs(mockSavedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId: string) => {
    if (!token) return;

    try {
      // TODO: Replace with actual API call
      // await jobService.removeSavedJob(jobId, token);
      setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove saved job');
    }
  };

  const handleApply = (jobId: string) => {
    // Navigate to job application page
    window.location.href = `/jobs/${jobId}`;
  };

  const filteredJobs = savedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${job.location.city}, ${job.location.state}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || job.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'bg-blue-100 text-blue-800';
      case 'PART_TIME':
        return 'bg-green-100 text-green-800';
      case 'INTERNSHIP':
        return 'bg-purple-100 text-purple-800';
      case 'REMOTE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bookmark className="w-6 h-6 mr-2 text-blue-600" />
            Saved Jobs
          </h2>
          <div className="text-sm text-gray-500">
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Trash2 className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        </div>
      ) : (
        <>
          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' ? 'No matching saved jobs' : 'No saved jobs yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start saving jobs to see them here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Building className="w-4 h-4 mr-1" />
                            <span className="mr-4">{job.company.name}</span>
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{job.location.city}{job.location.state ? `, ${job.location.state}` : ''}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
                          {job.type.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{job.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                        {job.salary && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{typeof job.salary === 'string' ? job.salary : job.salary.formatted}</span>
                          </div>
                        )}
                        {job.deadline && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Deadline: {formatDate(job.deadline)}</span>
                          </div>
                        )}
                        {job.postedDate && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Posted: {formatDate(job.postedDate)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleApply(job.id)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          Apply Now
                        </button>
                        <button
                          onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleRemoveSavedJob(job.id)}
                          className="inline-flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedJobs;