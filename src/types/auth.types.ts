export type EntityType = 'USER' | 'COMPANY';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'JOB_SEEKER' | 'ADMIN'; // Only JOB_SEEKER and ADMIN roles
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  entityType: EntityType | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<boolean>;
}

export type { AuthContextType };