import React, { createContext, useContext, useState } from 'react';
import { LoginRequest, LoginResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/Auth/login', {
        username,
        password,
      } as LoginRequest);

      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
      } else {
        throw new Error('Không nhận được token từ server');
      }
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      if (error.response) {
        // Lỗi từ phản hồi của server
        throw new Error(error.response.data?.message || 'Đăng nhập thất bại');
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      } else {
        // Lỗi khi thiết lập request
        throw new Error('Có lỗi xảy ra khi gửi yêu cầu đăng nhập');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};