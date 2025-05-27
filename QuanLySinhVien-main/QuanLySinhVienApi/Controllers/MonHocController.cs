using Microsoft.AspNetCore.Mvc;
using QuanLySinhVienApi.Models;
using QuanLySinhVienApi.Repositories;

namespace QuanLySinhVienApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonHocController : ControllerBase
    {
        private readonly MonHocRepository _repo;

        public MonHocController(MonHocRepository repo)
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
            var mh = _repo.GetById(id);
            if (mh == null) return NotFound();
            return Ok(mh);
        }

        [HttpPost]
        public IActionResult Create(Subject mh)
        {
            var result = _repo.Create(mh);
            if (result > 0) return Ok();
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Subject mh)
        {
            mh.Id = id;
            var result = _repo.Update(mh);
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