import { API_BASE_URL } from '../config/api';
import type { Resume, UploadResumeResponse } from '../types/resume.types';

export const resumeService = {
  async uploadResume(formData: FormData, token: string): Promise<UploadResumeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async getResume(resumeId: number, token: string): Promise<Resume> {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch resume with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async getUserResumes(token: string): Promise<Resume[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/my-resumes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch resumes with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async setPrimaryResume(resumeId: number, token: string): Promise<Resume> {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/set-primary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to set primary resume with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },
};