import React, { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { authService, type ValidateTokenResponse, type RefreshTokenResponse } from '../services/authService';
import { type EntityType, type User, type AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const intervalRef = useRef<number | null>(null);

  // Function to validate token with server
  const validateTokenWithServer = async (token: string, userData: User | null = null): Promise<boolean> => {
  try {
    const response: ValidateTokenResponse = await authService.validateToken(token);
    if (response.valid && response.email) {
      const updatedUser: User = {
        id: userData?.id || response.userId || '', // Ensure server returns userId
        email: response.email,
        name: userData?.name || response.name || response.email.split('@')[0],
        role: userData?.role || response.role || 'JOB_SEEKER' as const
      };
      setUser(updatedUser);
      setEntityType('USER');
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('entityType', 'USER');
      localStorage.setItem('tokenExpiration', response.expirationTime.toString());
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error validating token with server:', error);
    return false;
  }
};

  // Function to refresh token
  const refreshTokenFunc = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return false;

      const response: RefreshTokenResponse = await authService.refreshToken(currentToken);
      if (response.token) {
        setToken(response.token);
        localStorage.setItem('token', response.token);
        
        // Validate the new token to get updated user info and expiration
        const isValid = await validateTokenWithServer(response.token, user);
        if (isValid) {
          setIsAuthenticated(true);
          setupRefreshInterval();
        }
        return isValid;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  };

  // Check if token is about to expire (within 5 minutes)
  const shouldRefreshToken = (): boolean => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return false;
    
    const currentTime = Date.now();
    const expiration = parseInt(expirationTime);
    const fiveMinutes = 5 * 60 * 1000;
    
    return (expiration - currentTime) < fiveMinutes;
  };

  // Set up token refresh interval
  const setupRefreshInterval = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(async () => {
      if (shouldRefreshToken()) {
        const refreshed = await refreshTokenFunc();
        if (!refreshed) {
          logout();
        }
      }
    }, 60000); // Check every minute
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedEntityType = localStorage.getItem('entityType');
        
        // If we have a company token, don't process in user auth context
        if (localStorage.getItem('companyToken')) {
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          setEntityType(null);
          setIsLoading(false);
          return;
        }
        
        // Check if we have valid token and user data
        if (!storedToken || !storedUser) {
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          setEntityType(null);
          setIsLoading(false);
          return;
        }

        // Check for invalid string values
        if (storedUser === 'undefined' || storedUser === 'null' || storedToken === 'undefined' || storedToken === 'null') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('entityType');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          setEntityType(null);
          setIsLoading(false);
          return;
        }

        let userData: User;
        try {
          userData = JSON.parse(storedUser);
          // Validate parsed user data
          if (!userData || !userData.email) {
            throw new Error('Invalid user data structure');
          }
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('entityType');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          setEntityType(null);
          setIsLoading(false);
          return;
        }


        // Try server validation first
        let isValid = false;
        try {
          isValid = await validateTokenWithServer(storedToken, userData);
        } catch (serverError) {
          console.warn('Server validation failed:', serverError);
          
          // Fallback to local validation
          const tokenExpiration = localStorage.getItem('tokenExpiration');
          const now = Date.now();
          
          if (tokenExpiration && parseInt(tokenExpiration) > now) {
            setUser(userData);
            setToken(storedToken);
            isValid = true;
            
            // Try to refresh the token in the background
            setTimeout(async () => {
              try {
                await refreshTokenFunc();
              } catch (e) {
                console.warn('Background token refresh failed:', e);
              }
            }, 1000);
          } else {
            console.log('Token expired locally');
          }
        }

        if (isValid) {
          setUser(userData);
          setToken(storedToken);
          setEntityType(storedEntityType as EntityType || 'USER');
          setIsAuthenticated(true);
          setupRefreshInterval();
        } else {
          console.log('Authentication failed, attempting refresh...');
          // Try to refresh the token
          const refreshed = await refreshTokenFunc();
          if (refreshed) {
            console.log('Token refreshed successfully');
            setIsAuthenticated(true);
            setupRefreshInterval();
          } else {
            console.log('Token refresh failed, clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('entityType');
            setUser(null);
            setToken(null);
            setEntityType(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
        setUser(null);
        setToken(null);
        setEntityType(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []); // Run only once on mount

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      console.log('Login response:', data); // Debug log
      
      const { token: jwtToken, user: userData } = data;
      
      // Validate that we have valid user data
      if(!userData || !userData.email || !userData.role) {
        throw new Error('Invalid user data received from server');
      }
      
      setToken(jwtToken);
      setUser(userData);
      setEntityType('USER');
      setIsAuthenticated(true);
      
      // Store in localStorage with validation
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('entityType', 'USER');
      
      console.log('Stored user data:', JSON.stringify(userData)); // Debug log
      
      // Validate the token to get expiration time
      try {
        const response = await authService.validateToken(jwtToken);
        if (response.expirationTime) {
          localStorage.setItem('tokenExpiration', response.expirationTime.toString());
        }
      } catch (error) {
        console.warn('Could not get token expiration time:', error);
        // Set a default expiration time (24 hours from now)
        const defaultExpiration = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('tokenExpiration', defaultExpiration.toString());
      }
      
      // Set up token refresh interval after login
      setupRefreshInterval();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const data = await authService.signup({ name, email, password });
      console.log('Signup successful:', data);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear interval on logout
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setUser(null);
    setToken(null);
    setEntityType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('entityType');
  };

  const value = {
    user,
    token,
    entityType,
    login,
    signup,
    logout,
    isAuthenticated,
    isLoading,
    refreshToken: refreshTokenFunc,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};