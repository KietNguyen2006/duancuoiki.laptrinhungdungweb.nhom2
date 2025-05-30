import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { AcademicYear, DataTableColumn } from '../types';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  year: yup.string().required('Năm học là bắt buộc'),
  semester: yup.string().required('Học kỳ là bắt buộc'),
});

const columns: DataTableColumn[] = [
  { field: 'year', headerName: 'Năm học', width: 200 },
  { field: 'semester', headerName: 'Học kỳ', width: 150 },
];

export const AcademicYears = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [open, setOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const loadAcademicYears = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/academic-years');
      setAcademicYears(response.data);
      setTotalCount(response.data.length);
    } catch (error) {
      console.error('Failed to load academic years:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAcademicYears();
  }, [loadAcademicYears]);

  const formik = useFormik({
    initialValues: {
      year: '',
      semester: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingYear) {
          await api.put(`/academic-years/${editingYear.id}`, values);
        } else {
          await api.post('/academic-years', values);
        }
        handleClose();
        loadAcademicYears();
      } catch (error) {
        console.error('Failed to save academic year:', error);
      }
    },
  });

  const handleOpen = () => {
    setEditingYear(null);
    formik.resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingYear(null);
    formik.resetForm();
  };

  const handleEdit = (id: number) => {
    const year = academicYears.find(y => y.id === id);
    if (year) {
      setEditingYear(year);
      formik.setValues({
        year: year.year,
        semester: year.semester,
      });
      setOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa năm học này?')) {
      try {
        await api.delete(`/academic-years/${id}`);
        loadAcademicYears();
      } catch (error) {
        console.error('Failed to delete academic year:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Quản lý năm học</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Thêm năm học
        </Button>
      </Box>

      <DataTable
        rows={academicYears}
        columns={columns}
        loading={loading}
        page={page}
        pageSize={rowsPerPage}
        rowCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handleRowsPerPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingYear ? 'Cập nhật năm học' : 'Thêm năm học mới'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="year"
              label="Năm học"
              placeholder="VD: 2023-2024"
              value={formik.values.year}
              onChange={formik.handleChange}
              error={formik.touched.year && Boolean(formik.errors.year)}
              helperText={formik.touched.year && formik.errors.year}
            />
            <TextField
              fullWidth
              margin="normal"
              name="semester"
              label="Học kỳ"
              select
              value={formik.values.semester}
              onChange={formik.handleChange}
              error={formik.touched.semester && Boolean(formik.errors.semester)}
              helperText={formik.touched.semester && formik.errors.semester}
            >
              <MenuItem value="HK1">Học kỳ 1</MenuItem>
              <MenuItem value="HK2">Học kỳ 2</MenuItem>
              <MenuItem value="HK3">Học kỳ hè</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingYear ? 'Cập nhật' : 'Thêm'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};