import { useAuth } from './useAuth';
import { useCompanyAuth } from './useCompanyAuth';
import type { EntityType } from '../types/auth.types';

interface CombinedUser {
  id: string;
  email: string;
  name?: string;
  entityType: EntityType;
  role: 'JOB_SEEKER' | 'ADMIN' | 'COMPANY';
}

export const useCombinedAuth = () => {
  const userAuth = useAuth();
  const companyAuth = useCompanyAuth();

  const isAuthenticated = userAuth.isAuthenticated || companyAuth.isAuthenticated;
  const isLoading = userAuth.isLoading || companyAuth.isLoading;

  const getCurrentUser = (): CombinedUser | null => {
    if (userAuth.isAuthenticated && userAuth.user) {
      return {
        ...userAuth.user,
        entityType: 'USER' as EntityType
      };
    }
    
    if (companyAuth.isAuthenticated && companyAuth.company) {
      return {
        id: companyAuth.company.id,
        email: companyAuth.company.email,
        name: companyAuth.company.name || companyAuth.company.email.split('@')[0],
        entityType: 'COMPANY' as EntityType,
        role: 'COMPANY'
      };
    }
    
    return null;
  };

  return {
    user: getCurrentUser(),
    isAuthenticated,
    isLoading,
    userAuth,
    companyAuth
  };
};