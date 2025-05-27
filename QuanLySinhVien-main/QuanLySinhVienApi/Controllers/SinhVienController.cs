using Microsoft.AspNetCore.Mvc;
using QuanLySinhVienApi.Models;
using QuanLySinhVienApi.Repositories;

namespace QuanLySinhVienApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SinhVienController : ControllerBase
    {
        private readonly SinhVienRepository _repo;

        public SinhVienController(SinhVienRepository repo)
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
            var sv = _repo.GetById(id);
            if (sv == null) return NotFound();
            return Ok(sv);
        }

        [HttpGet("paging")]
        public IActionResult GetPaging([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string keyword = null, [FromQuery] int? lopId = null)
        {
            var result = _repo.GetPagingFilteringSearching(pageIndex, pageSize, keyword, lopId);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create(SinhVien sv)
        {
            var result = _repo.Create(sv);
            if (result > 0) return Ok();
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, SinhVien sv)
        {
            sv.SinhVienId = id;
            var result = _repo.Update(sv);
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