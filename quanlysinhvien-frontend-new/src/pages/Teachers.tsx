import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../services/api';

interface GiaoVien {
  giaoVienId: number;
  hoTen: string;
  email: string;
  dienThoai: string;
  diaChi?: string;
  gioiTinh: string;
  ngaySinh: string;
}

interface TeacherFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const validationSchema = Yup.object({
  fullName: Yup.string().required('Họ tên là bắt buộc'),
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phoneNumber: Yup.string().required('Điện thoại là bắt buộc'),
  address: Yup.string(),
  gender: Yup.string().required('Giới tính là bắt buộc'),
  dateOfBirth: Yup.string().required('Ngày sinh là bắt buộc'),
});

const Teachers: React.FC = () => {
  // State management
  const [teachers, setTeachers] = useState<GiaoVien[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<GiaoVien | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success' as const
  });

  // Snackbar handlers
  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Dialog handlers
  const handleOpenDialog = (teacher: GiaoVien | null = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      formik.setValues({
        fullName: teacher.hoTen,
        email: teacher.email,
        phoneNumber: teacher.dienThoai,
        address: teacher.diaChi || '',
        gender: teacher.gioiTinh as 'MALE' | 'FEMALE',
        dateOfBirth: teacher.ngaySinh
      });
    } else {
      setEditingTeacher(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // CRUD operations
  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        await api.delete(`/GiaoVien/${id}`);
        setTeachers(teachers.filter(teacher => teacher.giaoVienId !== id));
        showSnackbar('Xóa giáo viên thành công', 'success');
      } catch (error) {
        console.error('Failed to delete teacher:', error);
        showSnackbar('Lỗi khi xóa giáo viên', 'error');
      }
    }
  };

  // Formik form
  const formik = useFormik<TeacherFormValues>({
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      gender: 'MALE',
      dateOfBirth: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSaving(true);
        if (editingTeacher) {
          // Update existing teacher
          const response = await api.put(`/GiaoVien/${editingTeacher.giaoVienId}`, {
            hoTen: values.fullName,
            email: values.email,
            dienThoai: values.phoneNumber,
            diaChi: values.address,
            gioiTinh: values.gender,
            ngaySinh: values.dateOfBirth
          });
          setTeachers(teachers.map(t => 
            t.giaoVienId === editingTeacher.giaoVienId ? response.data : t
          ));
          showSnackbar('Cập nhật giáo viên thành công', 'success');
        } else {
          // Add new teacher
          const response = await api.post('/GiaoVien', {
            hoTen: values.fullName,
            email: values.email,
            dienThoai: values.phoneNumber,
            diaChi: values.address,
            gioiTinh: values.gender,
            ngaySinh: values.dateOfBirth
          });
          setTeachers([...teachers, response.data]);
          showSnackbar('Thêm giáo viên thành công', 'success');
        }
        handleCloseDialog();
        resetForm();
      } catch (error) {
        console.error('Error saving teacher:', error);
        showSnackbar('Đã xảy ra lỗi khi lưu giáo viên', 'error');
      } finally {
        setSaving(false);
      }
    },
  });

  // Fetch teachers data
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get<GiaoVien[]>('/GiaoVien');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      showSnackbar('Lỗi khi tải danh sách giáo viên', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => {
    const searchLower = searchTerm.toLowerCase();
    return (
      teacher.hoTen?.toLowerCase().includes(searchLower) ||
      teacher.email?.toLowerCase().includes(searchLower) ||
      teacher.dienThoai?.includes(searchTerm) ||
      teacher.diaChi?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const paginatedTeachers = filteredTeachers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Quản lý Giáo viên
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog(null)}
          >
            Thêm giáo viên
          </Button>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          placeholder="Tìm kiếm giáo viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Điện thoại</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTeachers.map((teacher) => (
                  <TableRow key={teacher.giaoVienId}>
                    <TableCell>{teacher.hoTen}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.dienThoai}</TableCell>
                    <TableCell>{teacher.diaChi || '-'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(teacher)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(teacher.giaoVienId)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTeacher ? 'Chỉnh sửa giáo viên' : 'Thêm giáo viên mới'}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Họ và tên"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Số điện thoại"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Địa chỉ"
                name="address"
                multiline
                rows={2}
                value={formik.values.address}
                onChange={formik.handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  label="Giới tính"
                >
                  <MenuItem value="MALE">Nam</MenuItem>
                  <MenuItem value="FEMALE">Nữ</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Ngày sinh"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
              />
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button 
            onClick={() => formik.handleSubmit()} 
            variant="contained"
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Teachers;
