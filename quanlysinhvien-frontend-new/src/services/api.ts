import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5146/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Thêm interceptor để đính kèm token xác thực vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Thêm interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token và chuyển hướng đến trang đăng nhập
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
