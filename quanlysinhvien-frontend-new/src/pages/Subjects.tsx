import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField
} from '@mui/material';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { MonHoc } from '../types';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  tenMonHoc: yup.string().required('Tên môn học là bắt buộc'),
  soTinChi: yup.number().required('Số tín chỉ là bắt buộc').min(1, 'Số tín chỉ phải lớn hơn 0'),
});

export const Subjects = () => {
  const [subjects, setSubjects] = useState<MonHoc[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<MonHoc | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await api.get<MonHoc[]>('/MonHoc');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenDialog = (subject?: MonHoc) => {
    if (subject) {
      setEditingSubject(subject);
      formik.setValues({
        tenMonHoc: subject.tenMonHoc,
        soTinChi: subject.soTinChi,
      });
    } else {
      setEditingSubject(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      try {
        await api.delete(`/MonHoc/${id}`);
        fetchSubjects();
      } catch (error) {
        console.error('Failed to delete subject:', error);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      tenMonHoc: '',
      soTinChi: 1,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingSubject) {
          await api.put(`/MonHoc/${editingSubject.monHocId}`, {
            ...values,
            monHocId: editingSubject.monHocId,
          });
        } else {
          await api.post('/MonHoc', values);
        }
        handleCloseDialog();
        fetchSubjects();
      } catch (error) {
        console.error('Failed to save subject:', error);
      }
    },
  });

  const columns = [
    { field: 'monHocId', headerName: 'ID', width: 70 },
    { field: 'tenMonHoc', headerName: 'Tên môn học', width: 300 },
    { field: 'soTinChi', headerName: 'Số tín chỉ', width: 150 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý môn học</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Thêm môn học
        </Button>
      </Box>

      <DataTable
        rows={subjects}
        columns={columns}
        loading={loading}
        onEdit={(id) => {
          const subject = subjects.find((s) => s.monHocId === id);
          if (subject) handleOpenDialog(subject);
        }}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingSubject ? 'Sửa môn học' : 'Thêm môn học'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              id="tenMonHoc"
              name="tenMonHoc"
              label="Tên môn học"
              value={formik.values.tenMonHoc}
              onChange={formik.handleChange}
              error={formik.touched.tenMonHoc && Boolean(formik.errors.tenMonHoc)}
              helperText={formik.touched.tenMonHoc && formik.errors.tenMonHoc}
            />
            <TextField
              fullWidth
              margin="normal"
              id="soTinChi"
              name="soTinChi"
              label="Số tín chỉ"
              type="number"
              value={formik.values.soTinChi}
              onChange={formik.handleChange}
              error={formik.touched.soTinChi && Boolean(formik.errors.soTinChi)}
              helperText={formik.touched.soTinChi && formik.errors.soTinChi}
              InputProps={{ inputProps: { min: 1 } }}
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
