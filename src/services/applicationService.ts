import { API_BASE_URL } from '../config/api';

export interface ApplicationRequest {
  jobId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  experience?: string;
  education?: string;
}

export interface ApplicationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  jobCompany: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  experience?: string;
  education?: string;
  status: string;
  statusDisplayName: string;
  appliedDate: string;
  updatedAt: string;
}

export const applicationService = {
  async submitApplication(application: ApplicationRequest): Promise<ApplicationResponse> {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(application),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to submit application';
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
};