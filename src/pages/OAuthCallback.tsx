import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          throw new Error('No token found');
        }

      
                
        // Fetch user data
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        /* if (!response.ok) {
          throw new Error('Failed to fetch user data');
        } */
        
        
        const userData = await response.data;
        
        // Save user data and token
        const user = {
          ...userData,
          token,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        
        // Update auth context
        setUser(user);
        
        // Redirect to home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=auth-failed', { replace: true });
      }
    };

    processOAuthLogin();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default OAuthCallback;