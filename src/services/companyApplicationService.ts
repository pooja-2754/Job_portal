import { API_BASE_URL } from '../config/api';
import type { Application, ApplicationStatus } from '../types/job.types';

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

export const companyApplicationService = {
  // Company Application Management Endpoints
  async getCompanyApplications(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<{
    content: Application[];
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

    const url = `${API_BASE_URL}/applications/company${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    
    const response = await fetch(url, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company applications');
    }
    return response.json();
  },

  async getCompanyApplicationsByJob(jobId: string): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/applications/company/job/${jobId}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company applications by job');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async getCompanyApplicationsByStatus(status: ApplicationStatus): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/applications/company/status/${status}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company applications by status');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async getCompanyApplication(id: string): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/company/${id}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company application');
    }
    return response.json();
  },

  async updateCompanyApplicationStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/company/${id}/status`, {
      method: 'PUT',
      headers: getCompanyAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update company application status');
    }
    return response.json();
  },

  async searchCompanyApplications(params: {
    keyword?: string;
    status?: ApplicationStatus;
    jobId?: string;
    page?: number;
    size?: number;
  }): Promise<{
    content: Application[];
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
    if (params.status) {
      searchParams.append('status', params.status);
    }
    if (params.jobId) {
      searchParams.append('jobId', params.jobId);
    }
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params.size !== undefined) {
      searchParams.append('size', params.size.toString());
    }

    const url = `${API_BASE_URL}/applications/company/search${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    
    const response = await fetch(url, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to search company applications');
    }
    return response.json();
  },

  async getRecentCompanyApplications(days: number = 7): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/applications/company/recent?days=${days}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recent company applications');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async getOldPendingApplications(days: number = 30): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/applications/company/old-pending?days=${days}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch old pending applications');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },
};