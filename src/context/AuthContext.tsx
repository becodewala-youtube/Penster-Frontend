import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          // Verify token and get fresh user data
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = {
            ...response.data,
            token
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Configure axios defaults
  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      setLoading(false);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      setLoading(false);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);