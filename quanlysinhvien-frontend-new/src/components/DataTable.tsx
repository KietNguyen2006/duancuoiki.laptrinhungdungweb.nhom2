import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Column {
  field: string;
  headerName: string;
  width: number;
  valueGetter?: (params: any) => any;
}

interface DataTableProps {
  rows: any[];
  columns: Column[];
  loading?: boolean;
  page?: number;
  pageSize?: number;
  rowCount?: number;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  loading = false,
  page = 0,
  pageSize = 10,
  rowCount,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(event.target.value, 10));
    }
  };

  const getValue = (row: any, column: Column) => {
    if (column.valueGetter) {
      return column.valueGetter({ row });
    }
    return row[column.field];
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  style={{ width: column.width, fontWeight: 'bold' }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell style={{ width: 120 }}>Thao tác</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const idField = Object.keys(row).find(key => key.toLowerCase().includes('id'));
                const id = idField ? row[idField] : null;
                
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                    {columns.map((column) => (
                      <TableCell key={column.field}>{getValue(row, column)}</TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell>
                        {onEdit && (
                          <IconButton
                            color="primary"
                            onClick={() => onEdit(id)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton
                            color="error"
                            onClick={() => onDelete(id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {rowCount !== undefined && onPageChange && onPageSizeChange && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowCount}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      )}
    </Paper>
  );
};
