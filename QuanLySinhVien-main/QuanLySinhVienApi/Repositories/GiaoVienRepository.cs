using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using QuanLySinhVienApi.Models;

namespace QuanLySinhVienApi.Repositories
{
    public class GiaoVienRepository
    {
        private readonly string? _connectionString;

        public GiaoVienRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public IEnumerable<Teacher> GetAll()
        {
            using (var db = Connection)
            {
                return db.Query<Teacher>("SELECT * FROM GiaoVien");
            }
        }

        public Teacher? GetById(int id)
        {
            using (var db = Connection)
            {
                return db.QueryFirstOrDefault<Teacher>("SELECT * FROM GiaoVien WHERE GiaoVienId = @Id", new { Id = id });
            }
        }

        public int Create(Teacher giaoVien)
        {
            using (var db = Connection)
            {
                var sql = "INSERT INTO GiaoVien (FullName, Email, PhoneNumber) VALUES (@FullName, @Email, @PhoneNumber)";
                return db.Execute(sql, giaoVien);
            }
        }

        public int Update(Teacher giaoVien)
        {
            using (var db = Connection)
            {
                var sql = "UPDATE GiaoVien SET FullName = @FullName, Email = @Email, PhoneNumber = @PhoneNumber WHERE GiaoVienId = @Id";
                return db.Execute(sql, giaoVien);
            }
        }

        public int Delete(int id)
        {
            using (var db = Connection)
            {
                return db.Execute("DELETE FROM GiaoVien WHERE GiaoVienId = @Id", new { Id = id });
            }
        }

        public IEnumerable<Teacher> GetPagingFilteringSearching(int pageIndex, int pageSize, string keyword)
        {
            using (var connection = Connection)
            {
                var result = connection.Query<Teacher>(
                    "sp_GetGiaoViens_Paging_Filter_Search",
                    new { PageIndex = pageIndex, PageSize = pageSize, Keyword = keyword },
                    commandType: CommandType.StoredProcedure
                );
                return result;
            }
        }
    }
}