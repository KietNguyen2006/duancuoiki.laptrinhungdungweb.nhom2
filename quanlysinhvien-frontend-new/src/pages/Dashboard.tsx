import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, SxProps, Theme, CircularProgress } from '@mui/material';
import { api } from '../services/api';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Class as ClassIcon,
  CalendarMonth as CalendarIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = React.memo(({ title, value, icon, color }: StatCardProps) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRadius: 2,
      boxShadow: 2,
      '&:hover': {
        boxShadow: 4,
      },
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </Box>
      <Box
        sx={{
          padding: '12px',
          borderRadius: '50%',
          backgroundColor: `${color}20`,
          color: color,
        }}
      >
        {icon}
      </Box>
    </Box>
  </Paper>
));

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  averageScore: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalClasses: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all data in parallel
        const [studentsRes, teachersRes, coursesRes, classesRes] = await Promise.all([
          api.get('/SinhVien'),
          api.get('/GiaoVien'),
          api.get('/MonHoc'),
          api.get('/Lop')
        ]);

        // Calculate average score (mock data - replace with actual API call if available)
        const averageScore = 8.2; // This should be fetched from API

        setStats({
          totalStudents: studentsRes.data.length,
          totalTeachers: teachersRes.data.length,
          totalCourses: coursesRes.data.length,
          totalClasses: classesRes.data.length,
          averageScore,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format stats for display
  const statsData = [
    { 
      title: 'Tổng sinh viên', 
      value: stats.totalStudents.toLocaleString(), 
      icon: <PeopleIcon />, 
      color: '#1976d2' 
    },
    { 
      title: 'Tổng giáo viên', 
      value: stats.totalTeachers.toLocaleString(), 
      icon: <SchoolIcon />, 
      color: '#9c27b0' 
    },
    { 
      title: 'Môn học', 
      value: stats.totalCourses.toLocaleString(), 
      icon: <BookIcon />, 
      color: '#2e7d32' 
    },
    { 
      title: 'Lớp học', 
      value: stats.totalClasses.toLocaleString(), 
      icon: <ClassIcon />, 
      color: '#ed6c02' 
    },
    { 
      title: 'Năm học', 
      value: '2024-2025', 
      icon: <CalendarIcon />, 
      color: '#d32f2f' 
    },
    { 
      title: 'Điểm TB toàn trường', 
      value: stats.averageScore.toFixed(1), 
      icon: <AssessmentIcon />, 
      color: '#0288d1' 
    },
  ];

  // Styles
  const paperStyle: SxProps<Theme> = {
    p: 3,
    height: '100%',
    borderRadius: 2,
    boxShadow: 2
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tổng quan hệ thống
      </Typography>
      <Typography color="textSecondary" paragraph>
        Chào mừng bạn quay trở lại! Dưới đây là tổng quan về hệ thống.
      </Typography>

      {/* Thống kê chính - Sử dụng CSS Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mt: 2
          }}
        >
          {statsData.map((stat, index) => (
            <Box key={index}>
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Hoạt động và thông báo - Sử dụng CSS Grid */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
          mt: 3
        }}
      >
        <Paper sx={paperStyle}>
          <Typography variant="h6" gutterBottom>
            Hoạt động gần đây
          </Typography>
          <Typography color="textSecondary" paragraph>
            Biểu đồ hoạt động sẽ được hiển thị tại đây...
          </Typography>
        </Paper>
        <Paper sx={paperStyle}>
          <Typography variant="h6" gutterBottom>
            Thông báo
          </Typography>
          <Typography color="textSecondary" paragraph>
            Không có thông báo mới.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export { Dashboard };
