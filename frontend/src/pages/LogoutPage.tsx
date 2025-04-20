import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        navigate('/');
      } catch (err) {
        console.error('Logout failed:', err);
        navigate('/');
      }
    };

    handleLogout();
  }, [navigate, logout]);

  return null; // This component doesn't render anything
};

export default LogoutPage; 