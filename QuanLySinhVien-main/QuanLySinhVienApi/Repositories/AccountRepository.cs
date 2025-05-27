using Dapper;
using System.Data;
using Microsoft.Data.SqlClient;
using QuanLySinhVienApi.Models;

namespace QuanLySinhVienApi.Repositories
{
    public class AccountRepository
    {
        private readonly string? _connectionString;

        public AccountRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public IEnumerable<Account> GetAll()
        {
            using (var db = Connection)
            {
                return db.Query<Account>("SELECT * FROM Account");
            }
        }

        public Account? GetById(int id)
        {
            using (var db = Connection)
            {
                return db.QueryFirstOrDefault<Account>("SELECT * FROM Account WHERE AccountId = @Id", new { Id = id });
            }
        }

        public int Create(Account account)
        {
            using (var db = Connection)
            {
                var sql = "INSERT INTO Account (Username, PasswordHash, Role, StudentId, TeacherId) VALUES (@Username, @PasswordHash, @Role, @StudentId, @TeacherId)";
                return db.Execute(sql, account);
            }
        }

        public int Update(Account account)
        {
            using (var db = Connection)
            {
                var sql = "UPDATE Account SET Username = @Username, PasswordHash = @PasswordHash, Role = @Role, StudentId = @StudentId, TeacherId = @TeacherId WHERE AccountId = @Id";
                return db.Execute(sql, account);
            }
        }

        public int Delete(int id)
        {
            using (var db = Connection)
            {
                return db.Execute("DELETE FROM Account WHERE AccountId = @Id", new { Id = id });
            }
        }

        public IEnumerable<Account> GetPagingFilteringSearching(int pageIndex, int pageSize, string keyword)
        {
            using (var connection = Connection)
            {
                var result = connection.Query<Account>(
                    "sp_GetAccounts_Paging_Filter_Search",
                    new { PageIndex = pageIndex, PageSize = pageSize, Keyword = keyword },
                    commandType: CommandType.StoredProcedure
                );
                return result;
            }
        }
    }
}