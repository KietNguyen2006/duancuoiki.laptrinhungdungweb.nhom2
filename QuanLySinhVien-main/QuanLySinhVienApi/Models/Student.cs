namespace QuanLySinhVienApi.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public bool Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public int ClassId { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
    }
}