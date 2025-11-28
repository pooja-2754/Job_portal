import { createContext } from 'react';

export interface Company {
  id: string;
  email: string;
  name?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  verificationStatus?: string;
  verifiedAt?: string;
  adminId?: number;
  adminName?: string;
  jobCount?: number;
  createdAt?: string;
  updatedAt?: string;
  role: 'COMPANY';
}

export interface CompanySignupData {
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  size?: string;
}

export interface CompanyAuthContextType {
  company: Company | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, companyData?: CompanySignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<boolean>;
}

export const CompanyAuthContext = createContext<CompanyAuthContextType | undefined>(undefined);