import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { AcademicYears } from './pages/AcademicYears';
import { Classes } from './pages/Classes';
import Teachers from './pages/Teachers';
import Students from './pages/Students';
import { Grades } from './pages/Grades';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Tạo theme tùy chỉnh
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Component bảo vệ route - Đã bỏ yêu cầu đăng nhập
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout />
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="academic-years" element={<AcademicYears />} />
              <Route path="classes" element={<Classes />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="students" element={<Students />} />
              <Route path="grades" element={<Grades />} />
              {/* Thêm các route khác tại đây */}
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;