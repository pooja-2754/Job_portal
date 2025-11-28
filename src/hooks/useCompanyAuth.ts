import { useContext } from 'react';
import { CompanyAuthContext } from '../contexts/CompanyAuthContextValue';
import type { CompanyAuthContextType } from '../contexts/CompanyAuthContextValue';

export const useCompanyAuth = (): CompanyAuthContextType => {
  const context = useContext(CompanyAuthContext);
  if (context === undefined) {
    throw new Error('useCompanyAuth must be used within a CompanyAuthProvider');
  }
  return context;
};