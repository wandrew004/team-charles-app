import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 