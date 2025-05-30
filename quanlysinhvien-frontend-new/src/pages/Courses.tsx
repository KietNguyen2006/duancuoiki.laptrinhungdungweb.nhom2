import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { Course, Teacher, DataTableColumn } from '../types';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Tên khóa học là bắt buộc'),
  code: yup.string().required('Mã khóa học là bắt buộc'),
  teacherId: yup.number().required('Giáo viên là bắt buộc'),
  credit: yup.number().required('Số tín chỉ là bắt buộc').min(1, 'Số tín chỉ phải lớn hơn 0'),
});

const columns: DataTableColumn[] = [
  { field: 'code', headerName: 'Mã khóa học', width: 200 },
  { field: 'name', headerName: 'Tên khóa học', width: 200 },
  { field: 'teacherName', headerName: 'Giáo viên', width: 200 },
  { field: 'credit', headerName: 'Số tín chỉ', width: 100 },
];

export const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    try {
      const response = await api.get('/courses', {
        params: {
          page,
          size: rowsPerPage,
        },
      });
      setCourses(response.data.content);
      setTotalCount(response.data.totalElements);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const loadTeachers = async () => {
    try {
      const response = await api.get('/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to load teachers:', error);
    }
  };

  useEffect(() => {
    loadCourses();
    loadTeachers();
  }, [page, rowsPerPage]);

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      teacherId: '',
      credit: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const submitData = {
          ...values,
          teacherId: parseInt(values.teacherId, 10),
          credit: parseInt(values.credit, 10),
        };
        if (editingCourse) {
          await api.put(`/courses/${editingCourse.id}`, submitData);
        } else {
          await api.post('/courses', submitData);
        }
        loadCourses();
        handleClose();
      } catch (error) {
        console.error('Failed to save course:', error);
      }
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCourse(null);
    formik.resetForm();
  };

  const handleEdit = (id: number) => {
    const course = courses.find(c => c.id === id);
    if (course) {
      setEditingCourse(course);
      formik.setValues({
        name: course.name,
        code: course.code,
        teacherId: course.teacherId.toString(),
        credit: course.credit.toString(),
      });
      setOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await api.delete(`/courses/${id}`);
        loadCourses();
      } catch (error) {
        console.error('Failed to delete course:', error);
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
        <Typography variant="h5">Danh sách khóa học</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Thêm khóa học
        </Button>
      </Box>

      <DataTable
        rows={courses}
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
          <DialogTitle>
            {editingCourse ? 'Sửa thông tin khóa học' : 'Thêm khóa học mới'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Tên khóa học"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              name="code"
              label="Mã khóa học"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
            <TextField
              fullWidth
              margin="normal"
              name="teacherId"
              label="Giáo viên"
              select
              value={formik.values.teacherId}
              onChange={formik.handleChange}
              error={formik.touched.teacherId && Boolean(formik.errors.teacherId)}
              helperText={formik.touched.teacherId && formik.errors.teacherId}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="credit"
              label="Số tín chỉ"
              value={formik.values.credit}
              onChange={formik.handleChange}
              error={formik.touched.credit && Boolean(formik.errors.credit)}
              helperText={formik.touched.credit && formik.errors.credit}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained">
              {editingCourse ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
