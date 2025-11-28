import { API_BASE_URL } from '../config/api';
import type { Company, CompanyCreateRequest, CompanyUpdateRequest, CompanyStatus } from '../types/job.types';

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

export const companyService = {
  // Get all companies for the current user (recruiter)
  async getMyCompanies(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }): Promise<{
    content: Company[];
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

    const url = `${API_BASE_URL}/v1/companies/my-companies${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch your companies');
    }
    return response.json();
  },

  // Get companies by status (for admin)
  async getCompaniesByStatus(status: CompanyStatus): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/v1/companies?status=${status}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  // Get all companies (for admin)
  async getAllCompanies(): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/v1/companies`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  // Get a single company by ID
  async getCompany(id: number): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/v1/companies/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company');
    }
    return response.json();
  },

  // Create a new company
  async createCompany(companyData: CompanyCreateRequest): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/v1/companies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(companyData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create company');
    }
    return response.json();
  },

  // Update a company
  async updateCompany(id: number, companyData: CompanyUpdateRequest): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/v1/companies/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(companyData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update company');
    }
    return response.json();
  },

  // Delete a company
  async deleteCompany(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/v1/companies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete company');
    }
  },

  // Verify a company (admin only)
  async verifyCompany(id: number, status: CompanyStatus): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/v1/companies/${id}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to verify company');
    }
    return response.json();
  },

  // Get verified companies for job posting
  async getVerifiedCompanies(): Promise<Company[]> {
    const response = await fetch(`${API_BASE_URL}/v1/companies/verified`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch verified companies');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },
};