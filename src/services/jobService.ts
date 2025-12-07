import { API_BASE_URL } from '../config/api';
import type { Job, Application, JobType, JobTypeApi } from '../types/job.types';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const jobService = {
  // Job management functions
  async getJobs(page: number = 0, size: number = 10, sortBy: string = 'postedDate', sortDir: string = 'desc'): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/public/jobs?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    // The API might return a paginated response with content property
    // Handle both direct array and paginated response
    if (data.content && Array.isArray(data.content)) {
      return data.content;
    }
    // Ensure we always return an array, even if the API returns unexpected data
    return Array.isArray(data) ? data : [];
  },

  async getJob(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/public/jobs/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }
    return response.json();
  },

  async createJob(job: Omit<Job, 'id'>): Promise<Job> {
    // Transform job type to match backend enum format
    const transformJobType = (type: JobType): JobTypeApi => {
      switch (type) {
        case 'Full-Time':
          return 'FULL_TIME';
        case 'Part-Time':
          return 'PART_TIME';
        case 'Internship':
          return 'INTERNSHIP';
        case 'Remote':
          return 'REMOTE';
        default:
          return 'FULL_TIME';
      }
    };

    // Create a copy with transformed type for the API
    const jobForApi = {
      ...job,
      type: transformJobType(job.type)
    };

    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobForApi),
    });
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    return response.json();
  },

  async updateJob(id: string, job: Partial<Job>): Promise<Job> {
    // Transform job type to match backend enum format if present
    const transformJobType = (type: JobType): JobTypeApi => {
      switch (type) {
        case 'Full-Time':
          return 'FULL_TIME';
        case 'Part-Time':
          return 'PART_TIME';
        case 'Internship':
          return 'INTERNSHIP';
        case 'Remote':
          return 'REMOTE';
        default:
          return 'FULL_TIME';
      }
    };

    // Create a copy with transformed type for the API if type is present
    const jobForApi = job.type ? {
      ...job,
      type: transformJobType(job.type)
    } : job;

    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobForApi),
    });
    if (!response.ok) {
      throw new Error('Failed to update job');
    }
    return response.json();
  },

  async deleteJob(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
  },

  // Application management functions
  async getApplications(jobId?: string): Promise<Application[]> {
    const url = jobId ? `${API_BASE_URL}/applications?jobId=${jobId}` : `${API_BASE_URL}/applications`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    const data = await response.json();
    // Ensure we always return an array, even if the API returns unexpected data
    return Array.isArray(data) ? data : [];
  },

  async getApplication(id: string): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }
    return response.json();
  },

  async updateApplicationStatus(id: string, status: Application['status']): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update application status');
    }
    return response.json();
  },

  async getApplicationsByStatus(status: Application['status']): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/applications?status=${status}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch applications by status');
    }
    const data = await response.json();
    // Ensure we always return an array, even if the API returns unexpected data
    return Array.isArray(data) ? data : [];
  },

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
  },
};