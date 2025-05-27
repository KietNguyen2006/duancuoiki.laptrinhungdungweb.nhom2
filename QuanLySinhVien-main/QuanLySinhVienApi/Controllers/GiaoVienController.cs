using Microsoft.AspNetCore.Mvc;
using QuanLySinhVienApi.Models;
using QuanLySinhVienApi.Repositories;

namespace QuanLySinhVienApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GiaoVienController : ControllerBase
    {
        private readonly GiaoVienRepository _repo;

        public GiaoVienController(GiaoVienRepository repo)
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
            var gv = _repo.GetById(id);
            if (gv == null) return NotFound();
            return Ok(gv);
        }

        [HttpGet("paging")]
        public IActionResult GetPaging([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10, [FromQuery] string keyword = null)
        {
            var result = _repo.GetPagingFilteringSearching(pageIndex, pageSize, keyword);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult Create(Teacher gv)
        {
            var result = _repo.Create(gv);
            if (result > 0) return Ok();
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Teacher gv)
        {
            gv.Id = id;
            var result = _repo.Update(gv);
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