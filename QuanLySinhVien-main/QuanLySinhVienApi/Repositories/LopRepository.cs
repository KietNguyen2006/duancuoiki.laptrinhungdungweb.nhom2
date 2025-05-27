using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using QuanLySinhVienApi.Models;

namespace QuanLySinhVienApi.Repositories
{
    public class LopRepository
    {
        private readonly string? _connectionString;

        public LopRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public IEnumerable<Class> GetAll()
        {
            using (var db = Connection)
            {
                return db.Query<Class>("SELECT * FROM Lop");
            }
        }

        public Class? GetById(int id)
        {
            using (var db = Connection)
            {
                return db.QueryFirstOrDefault<Class>("SELECT * FROM Lop WHERE Id = @Id", new { Id = id });
            }
        }

        public int Create(Class lop)
        {
            using (var db = Connection)
            {
                var sql = "INSERT INTO Lop (TenLop, NamHoc) VALUES (@TenLop, @NamHoc)";
                return db.Execute(sql, lop);
            }
        }

        public int Update(Class lop)
        {
            using (var db = Connection)
            {
                var sql = "UPDATE Lop SET TenLop = @TenLop, NamHoc = @NamHoc WHERE Id = @Id";
                return db.Execute(sql, lop);
            }
        }

        public int Delete(int id)
        {
            using (var db = Connection)
            {
                return db.Execute("DELETE FROM Lop WHERE Id = @Id", new { Id = id });
            }
        }

        public IEnumerable<Class> GetPagingFilteringSearching(int pageIndex, int pageSize, string keyword)
        {
            using (var connection = Connection)
            {
                var result = connection.Query<Class>(
                    "sp_GetLops_Paging_Filter_Search",
                    new { PageIndex = pageIndex, PageSize = pageSize, Keyword = keyword },
                    commandType: CommandType.StoredProcedure
                );
                return result;
            }
        }
    }
}