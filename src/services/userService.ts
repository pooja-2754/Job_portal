import { API_BASE_URL } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  skills?: string;   // stored as comma-separated string in backend
  hasPrimaryResume: boolean;
  savedJobCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedJobItem {
  savedJobId: number;
  savedAt: string;
  jobId: number;
  jobTitle: string;
  jobActive: boolean;
  companyName?: string;
  companyLogo?: string;
  location?: string;
  type?: string;
  workplaceType?: string;
  experienceLevel?: string;
  deadline?: string;
}

export interface SavedJobsResponse {
  content: SavedJobItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const userService = {
  async getMyProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/users/me`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateMyProfile(data: { name?: string; phone?: string; skills?: string }): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update profile');
    }
    return res.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/me/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Failed to change password');
  },

  async getSavedJobs(page = 0, size = 10): Promise<SavedJobsResponse> {
    const res = await fetch(`${API_BASE_URL}/users/me/saved-jobs?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch saved jobs');
    return res.json();
  },

  async saveJob(jobId: number | string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/me/saved-jobs/${jobId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (res.status === 409) throw new Error('Job already saved');
    if (!res.ok) throw new Error('Failed to save job');
  },

  async unsaveJob(jobId: number | string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/users/me/saved-jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove saved job');
  },
};
