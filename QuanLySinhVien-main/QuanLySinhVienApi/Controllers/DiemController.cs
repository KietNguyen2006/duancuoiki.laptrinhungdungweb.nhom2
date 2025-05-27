using Microsoft.AspNetCore.Mvc;
using QuanLySinhVienApi.Models;
using QuanLySinhVienApi.Repositories;

namespace QuanLySinhVienApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiemController : ControllerBase
    {
        private readonly DiemRepository _repo;

        public DiemController(DiemRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _repo.GetAll();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var diem = _repo.GetById(id);
            if (diem == null) return NotFound();
            return Ok(diem);
        }

        [HttpPost]
        public IActionResult Create(Score diem)
        {
            var result = _repo.Create(diem);
            if (result > 0) return Ok();
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Score diem)
        {
            diem.Id = id;
            var result = _repo.Update(diem);
            if (result > 0) return Ok();
            return NotFound();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var result = _repo.Delete(id);
            if (result > 0) return Ok();
            return NotFound();
        }
    }
}