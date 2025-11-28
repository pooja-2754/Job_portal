import { API_BASE_URL } from '../config/api';

export interface CompanyLoginCredentials {
  email: string;
  password: string;
}

export interface CompanySignupData {
  name: string;
  email: string;
  password: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  size?: string;
}

export interface CompanyLoginResponse {
  token: string;
  company: {
    id: number;
    name?: string;
    logoUrl?: string;
    website?: string;
    description?: string;
    industry?: string;
    companySize?: string;
    verificationStatus?: string;
    verifiedAt?: string;
    email: string;
    adminId?: number;
    adminName?: string;
    jobCount?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  user: null;
  message: string;
}

export interface CompanySignupResponse {
  message: string;
}

export interface CompanyValidateTokenRequest {
  token: string;
}

export interface CompanyValidateTokenResponse {
  valid: boolean;
  email?: string;
  companyId?: string;
  name?: string;
  role?: 'COMPANY';
  expirationTime: number;
}

export interface CompanyRefreshTokenRequest {
  token: string;
}

export interface CompanyRefreshTokenResponse {
  token: string | null;
  message: string;
}

export const companyAuthService = {
  async login(credentials: CompanyLoginCredentials): Promise<CompanyLoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      // Check if the response contains a null token (indicating failed login)
      if (data.token === null) {
        throw new Error(data.message || 'Invalid credentials');
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async signup(companyData: CompanySignupData): Promise<CompanySignupResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();

      // Check if the response contains an error message
      if (!response.ok) {
        throw new Error(data.message || `Signup failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async validateToken(token: string): Promise<CompanyValidateTokenResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async refreshToken(token: string): Promise<CompanyRefreshTokenResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      
      // Check if the response contains a null token (indicating failed refresh)
      if (data.token === null) {
        throw new Error(data.message || 'Token refresh failed');
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },
};