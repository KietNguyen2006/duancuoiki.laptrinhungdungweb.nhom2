import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { api } from '../services/api';

interface SinhVien {
  id: number;
  hoTen: string;
  email?: string;
  dienThoai?: string;
  diaChi?: string;
  lopId: number;
  maSinhVien?: string;
  lop?: {
    id: number;
    tenLop: string;
  };
}

const validationSchema = yup.object({
  hoTen: yup.string().required('Họ tên là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  dienThoai: yup.string().matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  diaChi: yup.string(),
  lopId: yup.number().required('Vui lòng chọn lớp')
});

const Students: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [students, setStudents] = useState<SinhVien[]>([]);
  const [classes, setClasses] = useState<{id: number, tenLop: string}[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<SinhVien | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchStudents = async (pageIndex: number, pageSize: number, search: string) => {
    setLoading(true);
    try {
      const response = await api.get('/SinhVien', {
        params: {
          page: pageIndex + 1,
          pageSize,
          search
        }
      });
      setStudents(response.data.items);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sinh viên:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tải danh sách sinh viên',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/Lop');
      setClasses(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách lớp:', error);
    }
  };

  useEffect(() => {
    fetchStudents(page, rowsPerPage, searchTerm);
    fetchClasses();
  }, [page, rowsPerPage, searchTerm]);

  const formik = useFormik({
    initialValues: {
      hoTen: '',
      email: '',
      dienThoai: '',
      diaChi: '',
      lopId: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingStudent) {
          await api.put(`/SinhVien/${editingStudent.id}`, values);
          setSnackbar({
            open: true,
            message: 'Cập nhật sinh viên thành công',
            severity: 'success'
          });
        } else {
          await api.post('/SinhVien', values);
          setSnackbar({
            open: true,
            message: 'Thêm mới sinh viên thành công',
            severity: 'success'
          });
        }
        handleCloseDialog();
        fetchStudents(page, rowsPerPage, searchTerm);
      } catch (error) {
        console.error('Lỗi khi lưu sinh viên:', error);
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi lưu sinh viên',
          severity: 'error'
        });
      }
    },
  });

  const handleOpenDialog = (student: SinhVien | null = null) => {
    if (student) {
      setEditingStudent(student);
      formik.setValues({
        hoTen: student.hoTen,
        email: student.email || '',
        dienThoai: student.dienThoai || '',
        diaChi: student.diaChi || '',
        lopId: student.lopId?.toString() || ''
      });
    } else {
      setEditingStudent(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        await api.delete(`/SinhVien/${id}`);
        setSnackbar({
          open: true,
          message: 'Xóa sinh viên thành công',
          severity: 'success'
        });
        fetchStudents(page, rowsPerPage, searchTerm);
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi xóa sinh viên',
          severity: 'error'
        });
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 70,
      renderCell: (params) => (
        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
          {params.row.hoTen?.charAt(0) || 'S'}
        </Avatar>
      ),
      sortable: false,
    },
    {
      field: 'hoTen',
      headerName: 'Họ tên',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body1" fontWeight={500}>{params.row.hoTen}</Typography>
          <Typography variant="body2" color="text.secondary">
            {params.row.maSinhVien || ''}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          {params.row.email || 'Chưa có email'}
        </Box>
      ),
    },
    {
      field: 'dienThoai',
      headerName: 'Điện thoại',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          {params.row.dienThoai || 'Chưa có'}
        </Box>
      ),
    },
    {
      field: 'lop',
      headerName: 'Lớp',
      width: 150,
      renderCell: (params) => (
        <Chip
          icon={<SchoolIcon fontSize="small" />}
          label={params.row.lop?.tenLop || 'Chưa phân lớp'}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDialog(params.row);
              }}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row.id);
              }}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Quản lý Sinh viên
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Thêm mới
          </Button>
        </Box>

        <Paper
  elevation={0}
  sx={{
    p: 2,
    mb: 3,
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  }}
>
  <Box>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Tìm kiếm sinh viên..."
      value={searchTerm}
      onChange={handleSearch}
      InputProps={{
        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          bgcolor: 'background.paper'
        }
      }}
    />
  </Box>
</Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <DataGrid
          rows={students}
          columns={columns}
          paginationModel={{ page, pageSize: rowsPerPage }}
          pageSizeOptions={[5, 10, 25]}
          rowCount={totalItems}
          paginationMode="server"
          onPaginationModelChange={(model: GridPaginationModel) => {
            setPage(model.page);
            setRowsPerPage(model.pageSize);
          }}
          loading={loading}
          disableRowSelectionOnClick
          onRowClick={(params) => navigate(`/students/${params.row.id}`)}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            }
          }}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingStudent ? 'Chỉnh sửa sinh viên' : 'Thêm mới sinh viên'}
        </DialogTitle>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <DialogContent>
  <Box sx={{ mt: 1 }}>
    {/* Họ tên */}
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        id="hoTen"
        name="hoTen"
        label="Họ và tên"
        value={formik.values.hoTen}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.hoTen && Boolean(formik.errors.hoTen)}
        helperText={formik.touched.hoTen && formik.errors.hoTen}
      />
    </Box>

    {/* Email và Điện thoại */}
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          id="dienThoai"
          name="dienThoai"
          label="Điện thoại"
          value={formik.values.dienThoai}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.dienThoai && Boolean(formik.errors.dienThoai)}
          helperText={formik.touched.dienThoai && formik.errors.dienThoai}
        />
      </Box>
    </Box>

    {/* Địa chỉ */}
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        id="diaChi"
        name="diaChi"
        label="Địa chỉ"
        value={formik.values.diaChi}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.diaChi && Boolean(formik.errors.diaChi)}
        helperText={formik.touched.diaChi && formik.errors.diaChi}
        multiline
        rows={2}
      />
    </Box>

    {/* Lớp */}
    <Box sx={{ mb: 2 }}>
      <FormControl
        fullWidth
        variant="outlined"
        error={formik.touched.lopId && Boolean(formik.errors.lopId)}
      >
        <InputLabel id="lop-label">Lớp</InputLabel>
        <Select
          labelId="lop-label"
          id="lopId"
          name="lopId"
          value={formik.values.lopId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Lớp"
        >
          {classes.map((lop) => (
            <MenuItem key={lop.id} value={lop.id}>
              {lop.tenLop}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.lopId && formik.errors.lopId && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            {formik.errors.lopId}
          </Typography>
        )}
      </FormControl>
    </Box>
  </Box>
</DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Students;