import { API_BASE_URL } from '../config/api';
import type { Company, CompanyCreateRequest, CompanyUpdateRequest } from '../types/job.types';

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

export const companyProfileService = {
  // Company Profile Management Endpoints
  async getCurrentCompanyProfile(): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/companies/profile`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch current company profile');
    }
    return response.json();
  },

  async updateCurrentCompanyProfile(companyData: CompanyUpdateRequest): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/companies/profile`, {
      method: 'PUT',
      headers: getCompanyAuthHeaders(),
      body: JSON.stringify(companyData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update current company profile');
    }
    return response.json();
  },

  async updateCompany(id: number, companyData: CompanyUpdateRequest): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'PUT',
      headers: getCompanyAuthHeaders(),
      body: JSON.stringify(companyData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update company');
    }
    return response.json();
  },

  async deleteCompany(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'DELETE',
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete company');
    }
  },

  // Admin endpoints (for admin users)
  async getAllCompanies(params?: {
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

    const url = `${API_BASE_URL}/companies${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    
    const response = await fetch(url, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch all companies');
    }
    return response.json();
  },

  async getCompanyById(id: number): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      headers: getCompanyAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch company by id');
    }
    return response.json();
  },

  async createCompany(companyData: CompanyCreateRequest): Promise<Company> {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers: getCompanyAuthHeaders(),
      body: JSON.stringify(companyData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create company');
    }
    return response.json();
  },
};