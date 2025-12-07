import { API_BASE_URL } from '../config/api';
import type { ApplicationRequest, ApplicationResponse } from '../types/job.types';
import type { ApplicationsResponse, ApplicationsQueryParams } from '../types/application.types';

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

  async fetchApplications(token: string, params: ApplicationsQueryParams = {}): Promise<ApplicationsResponse> {
    const queryParams = new URLSearchParams();
    
    // Add query parameters if provided
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);
    
    const url = `${API_BASE_URL}/applications/candidate/my-applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || 'Failed to fetch applications';
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
};