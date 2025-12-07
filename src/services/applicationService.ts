import { API_BASE_URL } from '../config/api';
import type { ApplicationRequest, ApplicationResponse } from '../types/job.types';

export const applicationService = {
  async submitApplication(application: ApplicationRequest, token: string): Promise<ApplicationResponse> {
    const response = await fetch(`${API_BASE_URL}/applications/candidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(application),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 400) {
        throw new Error('You must have a primary resume to apply for this job');
      }
      
      if (response.status === 409) {
        throw new Error('You have already applied to this job');
      }
      
      if (response.status === 404) {
        throw new Error('This job is not available or has been closed');
      }
      
      const errorMessage = errorData.message || errorData.error || 'Failed to submit application';
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
};