using Microsoft.AspNetCore.Mvc;
using QuanLySinhVienApi.Models;
using QuanLySinhVienApi.Repositories;

namespace QuanLySinhVienApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LopController : ControllerBase
    {
        private readonly LopRepository _repo;

        public LopController(LopRepository repo)
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
            var lop = _repo.GetById(id);
            if (lop == null) return NotFound();
            return Ok(lop);
        }

        [HttpGet("paging")]
        public IActionResult GetPaging([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string keyword = null)
        {
            var result = _repo.GetPagingFilteringSearching(pageIndex, pageSize, keyword);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create(Class lop)
        {
            var result = _repo.Create(lop);
            if (result > 0) return Ok();
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Class lop)
        {
            lop.Id = id;
            var result = _repo.Update(lop);
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