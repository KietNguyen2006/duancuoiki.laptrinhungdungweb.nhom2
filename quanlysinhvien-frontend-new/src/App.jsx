import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Subjects } from './pages/Subjects';
import { Grades } from './pages/Grades';
import { Classes } from './pages/Classes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/students" />} />
                      <Route path="/students" element={<Students />} />
                      <Route path="/teachers" element={<Teachers />} />
                      <Route path="/subjects" element={<Subjects />} />
                      <Route path="/grades" element={<Grades />} />
                      <Route path="/classes" element={<Classes />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
