export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SinhVien {
  sinhVienId: number;
  hoTen: string;
  email: string;
  dienThoai: string;
  diaChi: string;
  lopId: number;
  tenLop?: string;
}

export interface GiaoVien {
  giaoVienId: number;
  hoTen: string;
  email: string;
  dienThoai: string;
  diaChi: string;
}

export interface MonHoc {
  monHocId: number;
  tenMonHoc: string;
  soTinChi: number;
}

export interface Lop {
  lopId: number;
  tenLop: string;
  giaoVienId: number;
  tenGiaoVien?: string;
}

export interface Diem {
  diemId: number;
  sinhVienId: number;
  monHocId: number;
  hocKy: number;
  diemQuaTrinh: number;
  diemCuoiKy: number;
  tenSinhVien?: string;
  tenMonHoc?: string;
}

export interface PagingResult<T> {
  items: T[];
  totalRecords: number;
  pageSize: number;
  pageIndex: number;
  totalPages: number;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  teacherId: number;
  teacherName: string;
  credit: number;
  academicYear?: string;
}

export interface AcademicYear {
  id: number;
  year: string;
  semester: string;
}

export interface DataTableColumn {
  field: string;
  headerName: string;
  width: number;
}