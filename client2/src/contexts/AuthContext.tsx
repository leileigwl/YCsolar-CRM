import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  last_login: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 加载用户
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const userResponse = await authAPI.getMe();
        setUser(userResponse.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // 注册
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ username, email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const userResponse = await authAPI.getMe();
        setUser(userResponse.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  // 登出
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 