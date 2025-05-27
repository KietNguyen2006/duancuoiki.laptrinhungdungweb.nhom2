namespace QuanLySinhVienApi.Models
{
    public class Score
    {
        public int Id { get; set; }
        public int SinhVienId { get; set; }
        public int MonHocId { get; set; }
        public float? Diem { get; set; }
        public int Semester { get; set; }
    }
}