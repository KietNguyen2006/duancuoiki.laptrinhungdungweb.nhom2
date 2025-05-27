namespace QuanLySinhVienApi.Models
{
    public class Account
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? PasswordHash { get; set; }
        public string? Role { get; set; }
        public int? StudentId { get; set; }
        public int? TeacherId { get; set; }
    }
}