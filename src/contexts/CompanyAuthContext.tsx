import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { companyAuthService, type CompanyValidateTokenResponse, type CompanyRefreshTokenResponse } from '../services/companyAuthService';
import { CompanyAuthContext } from './CompanyAuthContextValue';
import type { Company, CompanySignupData } from './CompanyAuthContextValue';

interface CompanyAuthProviderProps {
  children: ReactNode;
}

export const CompanyAuthProvider: React.FC<CompanyAuthProviderProps> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const intervalRef = useRef<number | null>(null);

  // Helper: Persist state to local storage
  const persistSession = (token: string, company: Company) => {
    localStorage.setItem('companyToken', token);
    localStorage.setItem('company', JSON.stringify(company));
  };

  // Helper: Clear session
  const clearSession = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('company');
    localStorage.removeItem('companyTokenExpiration');
    setCompany(null);
    setToken(null);
    setIsAuthenticated(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Refactored: Pure function that returns the validated company object or null
  // It does NOT set state directly, preventing race conditions
  const validateTokenWithServer = async (tokenToCheck: string, existingCompanyData: Company | null): Promise<Company | null> => {
    try {
      const response: CompanyValidateTokenResponse = await companyAuthService.validateToken(tokenToCheck);
      
      if (response.valid && response.email) {
        // Construct the updated company object
        // Use server data where available, fallback to existing data
        const updatedCompany: Company = {
          ...existingCompanyData, // Preserve existing fields
          id: response.companyId || existingCompanyData?.id || '', 
          email: response.email,
          name: response.name || existingCompanyData?.name || response.email.split('@')[0],
          role: 'COMPANY' // Enforce role
        };

        // Update expiration if provided
        if (response.expirationTime) {
          localStorage.setItem('companyTokenExpiration', response.expirationTime.toString());
        }

        return updatedCompany;
      }
      return null;
    } catch (error) {
      console.error('Error validating company token with server:', error);
      throw error; // Let caller decide how to handle network errors
    }
  };

  // Function to refresh token
  const refreshTokenFunc = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem('companyToken');
      // Use current state company or fetch from LS if state is null
      const currentCompany = company || JSON.parse(localStorage.getItem('company') || 'null');

      if (!currentToken) return false;

      const response: CompanyRefreshTokenResponse = await companyAuthService.refreshToken(currentToken);
      
      if (response.token) {
        // After refreshing token, validate it to ensure we have up-to-date user info
        // or simply update the token while keeping the user
        const validatedCompany = await validateTokenWithServer(response.token, currentCompany);
        
        const finalCompany = validatedCompany || currentCompany;

        if (finalCompany) {
            setToken(response.token);
            setCompany(finalCompany);
            persistSession(response.token, finalCompany);
            return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error refreshing company token:', error);
      return false;
    }
  };

  const shouldRefreshToken = (): boolean => {
    const expirationTime = localStorage.getItem('companyTokenExpiration');
    if (!expirationTime) return false;
    
    const currentTime = Date.now();
    const expiration = parseInt(expirationTime);
    const fiveMinutes = 5 * 60 * 1000;
    
    return (expiration - currentTime) < fiveMinutes;
  };

  const setupRefreshInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(async () => {
      if (shouldRefreshToken()) {
        const refreshed = await refreshTokenFunc();
        if (!refreshed) {
          // Only logout if refresh actually fails, not just if it wasn't needed
          const expirationTime = localStorage.getItem('companyTokenExpiration');
          if (expirationTime && parseInt(expirationTime) < Date.now()) {
             logout();
          }
        }
      }
    }, 60000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Initialize Authentication
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      const storedToken = localStorage.getItem('companyToken');
      const storedCompanyStr = localStorage.getItem('company');

      // 1. Check for missing data
      if (!storedToken || !storedCompanyStr || storedCompanyStr === 'undefined') {
        clearSession();
        setIsLoading(false);
        return;
      }

      let parsedCompany: Company;
      try {
        parsedCompany = JSON.parse(storedCompanyStr);
        // Enforce role existence
        if (!parsedCompany.role) parsedCompany.role = 'COMPANY';
      } catch {
        clearSession();
        setIsLoading(false);
        return;
      }

      // 2. Try Server Validation
      try {
        const validatedCompany = await validateTokenWithServer(storedToken, parsedCompany);
        
        if (validatedCompany) {
          // Success: Update state with FRESH data
          setCompany(validatedCompany);
          setToken(storedToken);
          setIsAuthenticated(true);
          persistSession(storedToken, validatedCompany); // Update LS with fresh data
          setupRefreshInterval();
        } else {
          // Server said invalid: Try Refresh
          throw new Error('Token invalid');
        }
      } catch (error) {
        console.warn('Server validation failed, checking local expiry/refresh:', error);
        
        // 3. Fallback: Check Local Expiration
        const tokenExpiration = localStorage.getItem('companyTokenExpiration');
        const now = Date.now();
        const isLocallyValid = tokenExpiration && parseInt(tokenExpiration) > now;

        if (isLocallyValid) {
          // Trust local data temporarily
          setCompany(parsedCompany);
          setToken(storedToken);
          setIsAuthenticated(true);
          setupRefreshInterval();
          
          // Try background refresh to resync
          refreshTokenFunc().catch(console.error);
        } else {
          // Token expired, try immediate refresh
          const refreshed = await refreshTokenFunc();
          if (refreshed) {
            setIsAuthenticated(true);
            setupRefreshInterval();
          } else {
            clearSession();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await companyAuthService.login({ email, password });
      
      const { token: jwtToken, company: companyData } = data;
      
      const transformedCompanyData: Company = {
        id: companyData.id?.toString() || '',
        email: companyData.email || '',
        name: companyData.name || companyData.email?.split('@')[0] || '',
        logoUrl: companyData.logoUrl,
        website: companyData.website,
        description: companyData.description,
        industry: companyData.industry,
        companySize: companyData.companySize,
        verificationStatus: companyData.verificationStatus,
        verifiedAt: companyData.verifiedAt,
        adminId: companyData.adminId,
        adminName: companyData.adminName,
        jobCount: companyData.jobCount,
        createdAt: companyData.createdAt,
        updatedAt: companyData.updatedAt,
        role: 'COMPANY' // Enforce this explicitly
      };
      
      setToken(jwtToken);
      setCompany(transformedCompanyData);
      setIsAuthenticated(true);
      persistSession(jwtToken, transformedCompanyData);
      
      // Handle expiration time setup...
      try {
        const response = await companyAuthService.validateToken(jwtToken);
        if (response.expirationTime) {
          localStorage.setItem('companyTokenExpiration', response.expirationTime.toString());
        }
      } catch {
        // Default 24h
        const defaultExpiration = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('companyTokenExpiration', defaultExpiration.toString());
      }

      setupRefreshInterval();
    } catch (error) {
      console.error('Company login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, companyData?: CompanySignupData) => {
    await companyAuthService.signup({ name, email, password, ...companyData });
  };

  const logout = () => {
    clearSession();
  };

  const value = {
    company,
    token,
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading,
    refreshToken: refreshTokenFunc,
  };

  return <CompanyAuthContext.Provider value={value}>{children}</CompanyAuthContext.Provider>;
};