import { createContext } from 'react';
import type { EntityType, User } from './AuthContext';
import type { Company, CompanySignupData } from './CompanyAuthContextValue';

export interface CombinedAuthContextType {
  // User auth state
  user: User | null;
  userToken: string | null;
  userIsAuthenticated: boolean;
  userIsLoading: boolean;
  
  // Company auth state
  company: Company | null;
  companyToken: string | null;
  companyIsAuthenticated: boolean;
  companyIsLoading: boolean;
  
  // Combined state
  currentEntityType: EntityType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  userLogin: (email: string, password: string) => Promise<void>;
  userSignup: (name: string, email: string, password: string) => Promise<void>;
  userLogout: () => void;
  
  companyLogin: (email: string, password: string) => Promise<void>;
  companySignup: (name: string, email: string, password: string, companyData?: CompanySignupData) => Promise<void>;
  companyLogout: () => void;
  
  // Combined logout
  logout: () => void;
}

export const CombinedAuthContext = createContext<CombinedAuthContextType | undefined>(undefined);