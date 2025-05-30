import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Visibility, VisibilityOff, Lock, Person } from '@mui/icons-material';

const validationSchema = yup.object({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

export const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.username, values.password);
        navigate('/', { replace: true });
      } catch (err) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: theme.palette.background.paper,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            overflow: 'hidden',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
            },
          }}
        >
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
              }}
            >
              <Lock sx={{ fontSize: 40 }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1,
                background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Đăng nhập
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Vui lòng đăng nhập để tiếp tục
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              id="username"
              name="username"
              label="Tên đăng nhập"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                mb: 2,
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
              <Button
                color="primary"
                size="small"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Quên mật khẩu?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
                },
              }}
            >
              Đăng nhập
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                hoặc đăng nhập bằng
              </Typography>
            </Divider>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  color: theme.palette.text.primary,
                  borderColor: alpha(theme.palette.text.primary, 0.23),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Google
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  color: theme.palette.text.primary,
                  borderColor: alpha(theme.palette.text.primary, 0.23),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Microsoft
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
