using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using QuanLySinhVienApi.Models;

namespace QuanLySinhVienApi.Repositories
{
    public class SinhVienRepository
    {
        private readonly string? _connectionString;

        public SinhVienRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public IEnumerable<SinhVien> GetAll()
        {
            using (var db = Connection)
            {
                return db.Query<SinhVien>("SELECT * FROM SinhVien");
            }
        }

        public SinhVien? GetById(int id)
        {
            using (var db = Connection)
            {
                return db.QueryFirstOrDefault<SinhVien>("SELECT * FROM SinhVien WHERE SinhVienId = @Id", new { Id = id });
            }
        }

        public int Create(SinhVien sv)
        {
            using (var db = Connection)
            {
                var sql = "INSERT INTO SinhVien (HoTen, NgaySinh, LopId) VALUES (@HoTen, @NgaySinh, @LopId)";
                return db.Execute(sql, sv);
            }
        }

        public int Update(SinhVien sv)
        {
            using (var db = Connection)
            {
                var sql = "UPDATE SinhVien SET HoTen = @HoTen, NgaySinh = @NgaySinh, LopId = @LopId WHERE SinhVienId = @SinhVienId";
                return db.Execute(sql, sv);
            }
        }

        public int Delete(int id)
        {
            using (var db = Connection)
            {
                return db.Execute("DELETE FROM SinhVien WHERE SinhVienId = @Id", new { Id = id });
            }
        }

        public IEnumerable<SinhVien> GetPagingFilteringSearching(int pageIndex, int pageSize, string keyword, int? lopId)
        {
            using (var connection = Connection)
            {
                var result = connection.Query<SinhVien>(
                    "sp_GetSinhViens_Paging_Filter_Search",
                    new { PageIndex = pageIndex, PageSize = pageSize, Keyword = keyword, LopId = lopId },
                    commandType: CommandType.StoredProcedure
                );
                return result;
            }
        }
    }
}