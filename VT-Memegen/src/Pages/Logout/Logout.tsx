// src/components/LogoutButton.tsx
import React from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-maroon"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
