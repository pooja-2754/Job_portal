// Re-export all hooks and providers
export { useCombinedAuth } from '../hooks/useCombinedAuth';
export { useCombinedAuthContext } from '../hooks/useCombinedAuthContext';
export { useCompanyAuth } from '../hooks/useCompanyAuth';
export { useAuth } from './AuthContext';

// Re-export providers
export { AuthProvider } from './AuthContext';
export { CompanyAuthProvider } from './CompanyAuthContext';
export { CombinedAuthProvider } from './CombinedAuthContextProvider';

// Re-export contexts
export { CompanyAuthContext } from './CompanyAuthContextValue';
export { CombinedAuthContext } from './CombinedAuthContext';

// Re-export types
export type {
  CombinedAuthContextType
} from './CombinedAuthContextValue';

export type {
  User,
  EntityType
} from './AuthContext';

export type {
  Company,
  CompanySignupData
} from './CompanyAuthContextValue';