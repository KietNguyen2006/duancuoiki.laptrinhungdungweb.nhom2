using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using QuanLySinhVienApi.Models;

namespace QuanLySinhVienApi.Repositories
{
    public class MonHocRepository
    {
        private readonly string? _connectionString;

        public MonHocRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public IEnumerable<Subject> GetAll()
        {
            using (var db = Connection)
            {
                return db.Query<Subject>("SELECT * FROM MonHoc");
            }
        }

        public Subject? GetById(int id)
        {
            using (var db = Connection)
            {
                return db.QueryFirstOrDefault<Subject>("SELECT * FROM MonHoc WHERE Id = @Id", new { Id = id });
            }
        }

        public int Create(Subject monHoc)
        {
            using (var db = Connection)
            {
                var sql = "INSERT INTO MonHoc (SubjectName, Credits) VALUES (@SubjectName, @Credits)";
                return db.Execute(sql, monHoc);
            }
        }

        public int Update(Subject monHoc)
        {
            using (var db = Connection)
            {
                var sql = "UPDATE MonHoc SET SubjectName = @SubjectName, Credits = @Credits WHERE Id = @Id";
                return db.Execute(sql, new { monHoc.SubjectName, monHoc.Credits, Id = monHoc.Id });
            }
        }

        public int Delete(int id)
        {
            using (var db = Connection)
            {
                return db.Execute("DELETE FROM MonHoc WHERE Id = @Id", new { Id = id });
            }
        }

        public IEnumerable<Subject> GetPagingFilteringSearching(int pageIndex, int pageSize, string keyword)
        {
            using (var connection = Connection)
            {
                var result = connection.Query<Subject>(
                    "sp_GetMonHocs_Paging_Filter_Search",
                    new { PageIndex = pageIndex, PageSize = pageSize, Keyword = keyword },
                    commandType: CommandType.StoredProcedure
                );
                return result;
            }
        }
    }
}