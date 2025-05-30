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
  MenuItem
} from '@mui/material';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { Diem, SinhVien, MonHoc } from '../types';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  sinhVienId: yup.number().required('Sinh viên là bắt buộc'),
  monHocId: yup.number().required('Môn học là bắt buộc'),
  hocKy: yup.number().required('Học kỳ là bắt buộc').min(1, 'Học kỳ phải lớn hơn 0'),
  diemQuaTrinh: yup.number().required('Điểm quá trình là bắt buộc').min(0, 'Điểm không được âm').max(10, 'Điểm tối đa là 10'),
  diemCuoiKy: yup.number().required('Điểm cuối kỳ là bắt buộc').min(0, 'Điểm không được âm').max(10, 'Điểm tối đa là 10'),
});

export const Grades = () => {
  const [grades, setGrades] = useState<Diem[]>([]);
  const [students, setStudents] = useState<SinhVien[]>([]);
  const [subjects, setSubjects] = useState<MonHoc[]>([]);
  const [open, setOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Diem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await api.get<Diem[]>('/Diem');
      setGrades(response.data);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get<SinhVien[]>('/SinhVien');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get<MonHoc[]>('/MonHoc');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    fetchSubjects();
  }, []);

  const handleOpenDialog = (grade?: Diem) => {
    if (grade) {
      setEditingGrade(grade);
      formik.setValues({
        sinhVienId: grade.sinhVienId,
        monHocId: grade.monHocId,
        hocKy: grade.hocKy,
        diemQuaTrinh: grade.diemQuaTrinh,
        diemCuoiKy: grade.diemCuoiKy,
      });
    } else {
      setEditingGrade(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa điểm này?')) {
      try {
        await api.delete(`/Diem/${id}`);
        fetchGrades();
      } catch (error) {
        console.error('Failed to delete grade:', error);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      sinhVienId: 0,
      monHocId: 0,
      hocKy: 1,
      diemQuaTrinh: 0,
      diemCuoiKy: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingGrade) {
          await api.put(`/Diem/${editingGrade.diemId}`, {
            ...values,
            diemId: editingGrade.diemId,
          });
        } else {
          await api.post('/Diem', values);
        }
        handleCloseDialog();
        fetchGrades();
      } catch (error) {
        console.error('Failed to save grade:', error);
      }
    },
  });

  const columns = [
    { field: 'diemId', headerName: 'ID', width: 70 },
    { field: 'tenSinhVien', headerName: 'Sinh viên', width: 200 },
    { field: 'tenMonHoc', headerName: 'Môn học', width: 200 },
    { field: 'hocKy', headerName: 'Học kỳ', width: 100 },
    { field: 'diemQuaTrinh', headerName: 'Điểm quá trình', width: 150 },
    { field: 'diemCuoiKy', headerName: 'Điểm cuối kỳ', width: 150 },
    { 
      field: 'diemTongKet', 
      headerName: 'Điểm tổng kết', 
      width: 150,
      valueGetter: (params: any) => {
        const row = params.row as Diem;
        return ((row.diemQuaTrinh * 0.3) + (row.diemCuoiKy * 0.7)).toFixed(1);
      }
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý điểm</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Thêm điểm
        </Button>
      </Box>

      <DataTable
        rows={grades}
        columns={columns}
        loading={loading}
        onEdit={(id) => {
          const grade = grades.find((g) => g.diemId === id);
          if (grade) handleOpenDialog(grade);
        }}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingGrade ? 'Sửa điểm' : 'Thêm điểm'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="sinhVienId-label">Sinh viên</InputLabel>
              <Select
                labelId="sinhVienId-label"
                id="sinhVienId"
                name="sinhVienId"
                value={formik.values.sinhVienId}
                onChange={formik.handleChange}
                error={formik.touched.sinhVienId && Boolean(formik.errors.sinhVienId)}
                label="Sinh viên"
              >
                {students.map((student) => (
                  <MenuItem key={student.sinhVienId} value={student.sinhVienId}>
                    {student.hoTen}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="monHocId-label">Môn học</InputLabel>
              <Select
                labelId="monHocId-label"
                id="monHocId"
                name="monHocId"
                value={formik.values.monHocId}
                onChange={formik.handleChange}
                error={formik.touched.monHocId && Boolean(formik.errors.monHocId)}
                label="Môn học"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.monHocId} value={subject.monHocId}>
                    {subject.tenMonHoc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              id="hocKy"
              name="hocKy"
              label="Học kỳ"
              type="number"
              value={formik.values.hocKy}
              onChange={formik.handleChange}
              error={formik.touched.hocKy && Boolean(formik.errors.hocKy)}
              helperText={formik.touched.hocKy && formik.errors.hocKy}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              fullWidth
              margin="normal"
              id="diemQuaTrinh"
              name="diemQuaTrinh"
              label="Điểm quá trình"
              type="number"
              value={formik.values.diemQuaTrinh}
              onChange={formik.handleChange}
              error={formik.touched.diemQuaTrinh && Boolean(formik.errors.diemQuaTrinh)}
              helperText={formik.touched.diemQuaTrinh && formik.errors.diemQuaTrinh}
              InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
            />
            <TextField
              fullWidth
              margin="normal"
              id="diemCuoiKy"
              name="diemCuoiKy"
              label="Điểm cuối kỳ"
              type="number"
              value={formik.values.diemCuoiKy}
              onChange={formik.handleChange}
              error={formik.touched.diemCuoiKy && Boolean(formik.errors.diemCuoiKy)}
              helperText={formik.touched.diemCuoiKy && formik.errors.diemCuoiKy}
              InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
            />
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
