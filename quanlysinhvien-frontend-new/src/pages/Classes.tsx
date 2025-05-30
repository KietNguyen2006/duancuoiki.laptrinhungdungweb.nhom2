import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  InputAdornment,
  TablePagination,
  Alert,
  Snackbar,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  Class as ClassIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { Lop, GiaoVien } from '../types';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  tenLop: yup.string().required('Tên lớp là bắt buộc'),
  giaoVienId: yup.number().required('Giáo viên chủ nhiệm là bắt buộc'),
});

export const Classes = () => {
  const [classes, setClasses] = useState<Lop[]>([]);
  const [teachers, setTeachers] = useState<GiaoVien[]>([]);
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Lop | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Lọc lớp học dựa trên từ khóa tìm kiếm
  const filteredClasses = classes.filter(cls => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const teacher = teachers.find(t => t.giaoVienId === cls.giaoVienId);
    const teacherName = teacher ? teacher.hoTen.toLowerCase() : '';
    
    return (
      cls.tenLop?.toLowerCase().includes(searchLower) ||
      teacherName.includes(searchLower)
    );
  });

  // Phân trang
  const paginatedClasses = filteredClasses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setPage(0);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get<Lop[]>('/Lop');
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      showSnackbar('Lỗi khi tải danh sách lớp học', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get<GiaoVien[]>('/GiaoVien');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      showSnackbar('Lỗi khi tải danh sách giáo viên', 'error');
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const handleOpenDialog = (classItem?: Lop) => {
    if (classItem) {
      setEditingClass(classItem);
      formik.setValues({
        tenLop: classItem.tenLop,
        giaoVienId: classItem.giaoVienId,
      });
    } else {
      setEditingClass(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này? Thao tác này không thể hoàn tác.')) {
      try {
        await api.delete(`/Lop/${id}`);
        showSnackbar('Xóa lớp học thành công', 'success');
        fetchClasses();
      } catch (error) {
        console.error('Failed to delete class:', error);
        showSnackbar('Lỗi khi xóa lớp học', 'error');
      }
    }
  };

  const formik = useFormik<{tenLop: string, giaoVienId: number}>({
    initialValues: {
      tenLop: '',
      giaoVienId: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        if (editingClass) {
          await api.put(`/Lop/${editingClass.lopId}`, {
            ...values,
            lopId: editingClass.lopId,
          });
          showSnackbar('Cập nhật thông tin lớp học thành công', 'success');
        } else {
          await api.post('/Lop', values);
          showSnackbar('Thêm mới lớp học thành công', 'success');
        }
        handleCloseDialog();
        fetchClasses();
      } catch (error) {
        console.error('Failed to save class:', error);
        showSnackbar(
          editingClass 
            ? 'Cập nhật thông tin thất bại' 
            : 'Thêm mới lớp học thất bại', 
          'error'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });



  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            <ClassIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2rem' }} />
            Quản lý Lớp học
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1 }}
          >
            Thêm lớp học
          </Button>
        </Box>

        {/* Thanh tìm kiếm */}
        <Box mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm lớp học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
              maxWidth: 400,
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DataTable
              rows={paginatedClasses}
              columns={[
                { field: 'lopId', headerName: 'ID', width: 70 },
                { field: 'tenLop', headerName: 'Tên lớp', width: 200 },
                { 
                  field: 'giaoVienId', 
                  headerName: 'Giáo viên chủ nhiệm', 
                  width: 200,
                  valueGetter: (params: any) => {
                    const teacher = teachers.find(t => t.giaoVienId === params.row.giaoVienId);
                    return teacher ? teacher.hoTen : 'Chưa có';
                  }
                },
              ]}
              page={page}
              pageSize={rowsPerPage}
              rowCount={filteredClasses.length}
              onPageChange={handleChangePage}
              onPageSizeChange={handleChangeRowsPerPage}
              onEdit={(id) => {
                const cls = classes.find(c => c.lopId === id);
                if (cls) handleOpenDialog(cls);
              }}
              onDelete={handleDelete}
              loading={loading}
            />
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredClasses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} trong ${count !== -1 ? count : `nhiều hơn ${to}`}`}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </Paper>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingClass ? 'Sửa lớp học' : 'Thêm lớp học'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              id="tenLop"
              name="tenLop"
              label="Tên lớp"
              value={formik.values.tenLop}
              onChange={formik.handleChange}
              error={formik.touched.tenLop && Boolean(formik.errors.tenLop)}
              helperText={formik.touched.tenLop && formik.errors.tenLop}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="giaoVienId-label">Giáo viên chủ nhiệm</InputLabel>
              <Select
                labelId="giaoVienId-label"
                id="giaoVienId"
                name="giaoVienId"
                value={formik.values.giaoVienId}
                onChange={formik.handleChange}
                error={formik.touched.giaoVienId && Boolean(formik.errors.giaoVienId)}
                label="Giáo viên chủ nhiệm"
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.giaoVienId} value={teacher.giaoVienId}>
                    {teacher.hoTen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              Lưu
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
