import { API_BASE_URL } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  pendingCompanies: number;
  verifiedCompanies: number;
  activeJobs: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  skills?: string[];
  createdAt?: string;
}

export interface AdminCompany {
  id: number;
  name: string;
  email?: string;
  description?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  logoUrl?: string;
  verificationStatus: string;
  createdAt?: string;
}

export interface AdminApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  jobCompany: string;
  applicantName: string;
  applicantEmail: string;
  status: string;
  statusDisplayName: string;
  appliedDate: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getUsers(page = 0, size = 20): Promise<PageResponse<AdminUser>> {
    const res = await fetch(`${API_BASE_URL}/admin/users?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async deleteUser(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete user');
  },

  async updateUserRole(id: number, role: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update role');
  },

  async getCompanies(page = 0, size = 20): Promise<PageResponse<AdminCompany>> {
    const res = await fetch(`${API_BASE_URL}/admin/companies?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch companies');
    return res.json();
  },

  async verifyCompany(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to verify company');
  },

  async rejectCompany(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to reject company');
  },

  async deleteCompany(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/admin/companies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete company');
  },

  async getApplications(page = 0, size = 20): Promise<PageResponse<AdminApplication>> {
    const res = await fetch(`${API_BASE_URL}/admin/applications?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },
};
