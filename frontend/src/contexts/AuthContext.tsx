import React, { useState, useEffect } from 'react';
import { AuthContext } from '../types/authContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/auth/status`, {
        credentials: 'include',
      });
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      setUsername(data.user?.username || null);
    } catch (err) {
      console.error('Error checking auth status:', err);
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setIsAuthenticated(false);
        setUsername(null);
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Logout failed'));
      }
    } catch (err) {
      console.error('Error logging out:', err);
      return Promise.reject(err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 