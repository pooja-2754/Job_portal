import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useCompanyAuth } from '../hooks/useCompanyAuth';
import { CombinedAuthContext } from './CombinedAuthContextValue';


interface CombinedAuthProviderProps {
  children: ReactNode;
}

export const CombinedAuthProvider: React.FC<CombinedAuthProviderProps> = ({ children }) => {
  // User auth
  const {
    user,
    token: userToken,
    entityType: userEntityType,
    login: userLogin,
    signup: userSignup,
    logout: userLogout,
    isAuthenticated: userIsAuthenticated,
    isLoading: userIsLoading,
  } = useAuth();

  // Company auth
  const {
    company,
    token: companyToken,
    login: companyLogin,
    signup: companySignup,
    logout: companyLogout,
    isAuthenticated: companyIsAuthenticated,
    isLoading: companyIsLoading,
  } = useCompanyAuth();

  // Determine current entity type and authentication state
  const currentEntityType = companyIsAuthenticated ? 'COMPANY' : userIsAuthenticated ? userEntityType : null;
  const isAuthenticated = userIsAuthenticated || companyIsAuthenticated;
  const isLoading = userIsLoading || companyIsLoading;

  // Combined logout function
  const logout = () => {
    userLogout();
    companyLogout();
  };

  const value = {
    // User auth state
    user,
    userToken,
    userIsAuthenticated,
    userIsLoading,
    
    // Company auth state
    company,
    companyToken,
    companyIsAuthenticated,
    companyIsLoading,
    
    // Combined state
    currentEntityType,
    isAuthenticated,
    isLoading,
    
    // Actions
    userLogin,
    userSignup,
    userLogout,
    
    companyLogin,
    companySignup,
    companyLogout,
    
    // Combined logout
    logout,
  };

  return <CombinedAuthContext.Provider value={value}>{children}</CombinedAuthContext.Provider>;
};