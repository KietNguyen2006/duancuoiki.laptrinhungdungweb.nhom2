using Microsoft.AspNetCore.Mvc;
using QuanLySinhVienApi.Models;
using QuanLySinhVienApi.Repositories;

namespace QuanLySinhVienApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly AccountRepository _repo;

        public AccountController(AccountRepository repo)
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
            var acc = _repo.GetById(id);
            if (acc == null) return NotFound();
            return Ok(acc);
        }

        [HttpPost]
        public IActionResult Create(Account acc)
        {
            var result = _repo.Create(acc);
            if (result > 0) return Ok();
            return BadRequest();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Account acc)
        {
            acc.Id = id;
            var result = _repo.Update(acc);
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