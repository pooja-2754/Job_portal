import { API_BASE_URL } from '../config/api';
import type { Job, Application } from '../types/job.types';

// Helper function to get company auth headers
const getCompanyAuthHeaders = () => {
  const token = localStorage.getItem('companyToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const companyJobService = {
  // Company Job Management Endpoints
  async getCompanyJobs(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<{
    content: Job[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params?.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      searchParams.append('size', params.size.toString());
    }
    if (params?.sortBy) {
      searchParams.append('sortBy', params.sortBy);
    }
    if (params?.sortDir) {
      searchParams.append('sortDir', params.sortDir);
    }

    const url = `${API_BASE_URL}/companies/jobs${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    
    const response = await fetch(url, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company jobs');
    }
    return response.json();
  },

  async getActiveCompanyJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/companies/jobs/active`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch active company jobs');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async getCompanyJob(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/companies/jobs/${id}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company job');
    }
    return response.json();
  },

  async createCompanyJob(job: Omit<Job, 'id'>): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/companies/jobs`, {
      method: 'POST',
      headers: getCompanyAuthHeaders(),
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error('Failed to create company job');
    }
    return response.json();
  },

  async updateCompanyJob(id: string, job: Partial<Job>): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/companies/jobs/${id}`, {
      method: 'PUT',
      headers: getCompanyAuthHeaders(),
      body: JSON.stringify(job),
    });
    if (!response.ok) {
      throw new Error('Failed to update company job');
    }
    return response.json();
  },

  async deleteCompanyJob(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/companies/jobs/${id}`, {
      method: 'DELETE',
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete company job');
    }
  },

  async searchCompanyJobs(params: {
    keyword?: string;
    location?: string;
    type?: string;
    page?: number;
    size?: number;
  }): Promise<{
    content: Job[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  }> {
    const searchParams = new URLSearchParams();
    
    if (params.keyword) {
      searchParams.append('keyword', params.keyword);
    }
    if (params.location) {
      searchParams.append('location', params.location);
    }
    if (params.type) {
      searchParams.append('type', params.type);
    }
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params.size !== undefined) {
      searchParams.append('size', params.size.toString());
    }

    const url = `${API_BASE_URL}/companies/jobs/search${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    
    const response = await fetch(url, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to search company jobs');
    }
    return response.json();
  },

  async getCompanyJobsByType(type: string): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/companies/jobs/type/${type}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company jobs by type');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async getJobsWithApproachingDeadlines(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/companies/jobs/deadlines/approaching`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch jobs with approaching deadlines');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  // Company Dashboard Endpoint
  async getCompanyDashboardStats(): Promise<{
    totalJobs: number;
    activeJobs: number;
    inactiveJobs: number;
    expiredJobs: number;
    totalApplications: number;
    pendingApplications: number;
    acceptedApplications: number;
    rejectedApplications: number;
    recentApplications: Application[];
    topJobsByApplications: Array<{
      job: Job;
      applicationCount: number;
    }>;
    jobsWithApproachingDeadlines: Job[];
  }> {
    const response = await fetch(`${API_BASE_URL}/companies/dashboard`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company dashboard stats');
    }
    return response.json();
  },
};