USE [quanlysinhvien]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[AccountId] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](50) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](100) NULL,
	[Role] [nvarchar](50) NULL,
	[StudentId] [int] NULL,
	[TeacherId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[AccountId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Diem]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Diem](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SinhVienId] [int] NOT NULL,
	[MonHocId] [int] NOT NULL,
	[Diem] [float] NOT NULL,
	[Semester] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GiaoVien]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GiaoVien](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[HoTen] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NULL,
	[PhoneNumber] [nvarchar](20) NULL,
	[SoDienThoai] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Khoa]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Khoa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TenKhoa] [nvarchar](100) NOT NULL,
	[MoTa] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KhoaHoc]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KhoaHoc](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TenKhoaHoc] [nvarchar](100) NOT NULL,
	[NgayBatDau] [datetime] NOT NULL,
	[NgayKetThuc] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Lop]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Lop](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TenLop] [nvarchar](100) NOT NULL,
	[NamHoc] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MonHoc]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MonHoc](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SubjectName] [nvarchar](100) NOT NULL,
	[Credits] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NamHoc]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NamHoc](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TenNamHoc] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SinhVien]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SinhVien](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[HoTen] [nvarchar](100) NOT NULL,
	[NgaySinh] [date] NULL,
	[LopId] [int] NOT NULL,
	[Email] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Diem]  WITH CHECK ADD FOREIGN KEY([MonHocId])
REFERENCES [dbo].[MonHoc] ([Id])
GO
ALTER TABLE [dbo].[Diem]  WITH CHECK ADD FOREIGN KEY([SinhVienId])
REFERENCES [dbo].[SinhVien] ([Id])
GO
ALTER TABLE [dbo].[SinhVien]  WITH CHECK ADD FOREIGN KEY([LopId])
REFERENCES [dbo].[Lop] ([Id])
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteKhoa]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Xóa một khoa
CREATE PROCEDURE [dbo].[sp_DeleteKhoa]
    @Id INT
AS
BEGIN
    DELETE FROM Khoa WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Diem_Delete]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Diem_Delete]
    @Id INT
AS
BEGIN
    DELETE FROM Diem WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Diem_GetAll]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Diem_GetAll]
AS
BEGIN
    SELECT * FROM Diem
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Diem_GetById]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Diem_GetById]
    @Id INT
AS
BEGIN
    SELECT * FROM Diem WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Diem_Insert]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Stored Procedure cho bảng Diem
CREATE PROCEDURE [dbo].[sp_Diem_Insert]
    @SinhVienId INT,
    @MonHocId INT,
    @Diem FLOAT
AS
BEGIN
    INSERT INTO Diem (SinhVienId, MonHocId, Diem) VALUES (@SinhVienId, @MonHocId, @Diem)
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Diem_Update]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Diem_Update]
    @Id INT,
    @SinhVienId INT,
    @MonHocId INT,
    @Diem FLOAT
AS
BEGIN
    UPDATE Diem SET SinhVienId = @SinhVienId, MonHocId = @MonHocId, Diem = @Diem WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GetAccounts_Paging_Filter_Search]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetAccounts_Paging_Filter_Search]
    @PageIndex INT,
    @PageSize INT,
    @Keyword NVARCHAR(100) = NULL
AS
BEGIN
    DECLARE @Offset INT = (@PageIndex - 1) * @PageSize;
    
    SELECT * FROM Account
    WHERE (@Keyword IS NULL OR Username LIKE '%' + @Keyword + '%' OR Role LIKE '%' + @Keyword + '%')
    ORDER BY AccountId
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetDiems_Paging_Filter_Search]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetDiems_Paging_Filter_Search]
    @PageIndex INT,
    @PageSize INT,
    @Keyword NVARCHAR(100) = NULL
AS
BEGIN
    DECLARE @Offset INT = (@PageIndex - 1) * @PageSize;
    
    SELECT d.*, sv.HoTen as TenSinhVien, mh.TenMonHoc
    FROM Diem d
    LEFT JOIN SinhVien sv ON d.SinhVienId = sv.Id
    LEFT JOIN MonHoc mh ON d.MonHocId = mh.Id
    WHERE (@Keyword IS NULL OR sv.HoTen LIKE '%' + @Keyword + '%' OR mh.TenMonHoc LIKE '%' + @Keyword + '%')
    ORDER BY d.Id
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetGiaoViens_Paging_Filter_Search]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetGiaoViens_Paging_Filter_Search]
    @PageIndex INT,
    @PageSize INT,
    @Keyword NVARCHAR(100) = NULL
AS
BEGIN
    DECLARE @Offset INT = (@PageIndex - 1) * @PageSize;
    
    SELECT * FROM GiaoVien
    WHERE (@Keyword IS NULL OR HoTen LIKE '%' + @Keyword + '%' OR Email LIKE '%' + @Keyword + '%')
    ORDER BY Id
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetKhoas_Paging_Filter_Search]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Lấy danh sách khoa có phân trang và tìm kiếm
CREATE PROCEDURE [dbo].[sp_GetKhoas_Paging_Filter_Search]
    @PageIndex INT = 1,
    @PageSize INT = 10,
    @Keyword NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Offset INT = (@PageIndex - 1) * @PageSize;

    SELECT 
        Id,
        TenKhoa,
        MoTa
    FROM 
        Khoa
    WHERE 
        (@Keyword IS NULL OR TenKhoa LIKE N'%' + @Keyword + '%' OR MoTa LIKE N'%' + @Keyword + '%')
    ORDER BY 
        Id DESC
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*) AS TotalCount
    FROM 
        Khoa
    WHERE 
        (@Keyword IS NULL OR TenKhoa LIKE N'%' + @Keyword + '%' OR MoTa LIKE N'%' + @Keyword + '%');
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GetLops_Paging_Filter_Search]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetLops_Paging_Filter_Search]
    @PageIndex INT,
    @PageSize INT,
    @Keyword NVARCHAR(100) = NULL
AS
BEGIN
    DECLARE @Offset INT = (@PageIndex - 1) * @PageSize;
    
    SELECT * FROM Lop
    WHERE (@Keyword IS NULL OR TenLop LIKE '%' + @Keyword + '%')
    ORDER BY Id
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetSinhViens_Paging_Filter_Search]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GetSinhViens_Paging_Filter_Search]
    @PageIndex INT,
    @PageSize INT,
    @Keyword NVARCHAR(100) = NULL,
    @LopId INT = NULL
AS
BEGIN
    DECLARE @Offset INT = (@PageIndex - 1) * @PageSize;
    
    SELECT * FROM SinhVien
    WHERE (@Keyword IS NULL OR HoTen LIKE '%' + @Keyword + '%' OR Email LIKE '%' + @Keyword + '%')
      AND (@LopId IS NULL OR LopId = @LopId)
    ORDER BY Id
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GiaoVien_Delete]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GiaoVien_Delete]
    @Id INT
AS
BEGIN
    DELETE FROM GiaoVien WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GiaoVien_GetAll]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GiaoVien_GetAll]
AS
BEGIN
    SELECT * FROM GiaoVien
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GiaoVien_GetById]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GiaoVien_GetById]
    @Id INT
AS
BEGIN
    SELECT * FROM GiaoVien WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GiaoVien_Insert]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Stored Procedure cho bảng GiaoVien
CREATE PROCEDURE [dbo].[sp_GiaoVien_Insert]
    @Ten NVARCHAR(100),
    @Email NVARCHAR(100)
AS
BEGIN
    INSERT INTO GiaoVien (Ten, Email) VALUES (@Ten, @Email)
END

GO
/****** Object:  StoredProcedure [dbo].[sp_GiaoVien_Update]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_GiaoVien_Update]
    @Id INT,
    @Ten NVARCHAR(100),
    @Email NVARCHAR(100)
AS
BEGIN
    UPDATE GiaoVien SET Ten = @Ten, Email = @Email WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_InsertKhoa]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_InsertKhoa]
    @TenKhoa NVARCHAR(100),
    @MoTa NVARCHAR(255) = NULL
AS
BEGIN
    INSERT INTO Khoa (TenKhoa, MoTa)
    VALUES (@TenKhoa, @MoTa)
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Lop_Delete]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Lop_Delete]
    @Id INT
AS
BEGIN
    DELETE FROM Lop WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Lop_GetAll]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Lop_GetAll]
AS
BEGIN
    SELECT * FROM Lop
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Lop_GetById]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Lop_GetById]
    @Id INT
AS
BEGIN
    SELECT * FROM Lop WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Lop_Insert]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[sp_Lop_Insert]
    @TenLop NVARCHAR(100)
AS
BEGIN
    INSERT INTO Lop (TenLop) VALUES (@TenLop)
END

GO
/****** Object:  StoredProcedure [dbo].[sp_Lop_Update]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_Lop_Update]
    @Id INT,
    @TenLop NVARCHAR(100)
AS
BEGIN
    UPDATE Lop SET TenLop = @TenLop WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_MonHoc_Delete]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_MonHoc_Delete]
    @Id INT
AS
BEGIN
    DELETE FROM MonHoc WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_MonHoc_GetAll]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_MonHoc_GetAll]
AS
BEGIN
    SELECT * FROM MonHoc
END

GO
/****** Object:  StoredProcedure [dbo].[sp_MonHoc_GetById]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_MonHoc_GetById]
    @Id INT
AS
BEGIN
    SELECT * FROM MonHoc WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_MonHoc_Insert]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Stored Procedure cho bảng MonHoc
CREATE PROCEDURE [dbo].[sp_MonHoc_Insert]
    @TenMon NVARCHAR(100),
    @SoTinChi INT
AS
BEGIN
    INSERT INTO MonHoc (TenMon, SoTinChi) VALUES (@TenMon, @SoTinChi)
END

GO
/****** Object:  StoredProcedure [dbo].[sp_MonHoc_Update]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_MonHoc_Update]
    @Id INT,
    @TenMon NVARCHAR(100),
    @SoTinChi INT
AS
BEGIN
    UPDATE MonHoc SET TenMon = @TenMon, SoTinChi = @SoTinChi WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_SinhVien_Delete]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_SinhVien_Delete]
    @Id INT
AS
BEGIN
    DELETE FROM SinhVien WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_SinhVien_GetAll]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_SinhVien_GetAll]
AS
BEGIN
    SELECT * FROM SinhVien
END

GO
/****** Object:  StoredProcedure [dbo].[sp_SinhVien_GetById]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_SinhVien_GetById]
    @Id INT
AS
BEGIN
    SELECT * FROM SinhVien WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_SinhVien_Insert]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Stored Procedure cho bảng SinhVien
CREATE PROCEDURE [dbo].[sp_SinhVien_Insert]
    @HoTen NVARCHAR(100),
    @LopId INT,
    @Email NVARCHAR(100)
AS
BEGIN
    INSERT INTO SinhVien (HoTen, LopId, Email) VALUES (@HoTen, @LopId, @Email)
END

GO
/****** Object:  StoredProcedure [dbo].[sp_SinhVien_Update]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_SinhVien_Update]
    @Id INT,
    @HoTen NVARCHAR(100),
    @LopId INT,
    @Email NVARCHAR(100)
AS
BEGIN
    UPDATE SinhVien SET HoTen = @HoTen, LopId = @LopId, Email = @Email WHERE Id = @Id
END

GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateKhoa]    Script Date: 27/05/2025 7:08:38 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Sửa thông tin một khoa
CREATE PROCEDURE [dbo].[sp_UpdateKhoa]
    @Id INT,
    @TenKhoa NVARCHAR(100),
    @MoTa NVARCHAR(255) = NULL
AS
BEGIN
    UPDATE Khoa
    SET TenKhoa = @TenKhoa, MoTa = @MoTa
    WHERE Id = @Id
END

GO
