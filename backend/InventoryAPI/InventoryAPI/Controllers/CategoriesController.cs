using InventoryAPI.Models;
using InventoryAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly DataService _data;
        public CategoriesController(DataService data) { _data = data; }

        [HttpGet]
        public ActionResult<IEnumerable<Category>> Get() => Ok(_data.GetCategories());

        [HttpPost]
        public ActionResult<Category> Post([FromBody] Category model)
        {
            if (string.IsNullOrWhiteSpace(model.Name)) return BadRequest("Name required");
            var cats = _data.GetCategories();
            model.Id = Guid.NewGuid();
            cats.Add(model);
            _data.SaveCategories(cats);
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public IActionResult Put(Guid id, [FromBody] Category model)
        {
            var cats = _data.GetCategories();
            var existing = cats.FirstOrDefault(c => c.Id == id);
            if (existing == null) return NotFound();
            existing.Name = model.Name;
            _data.SaveCategories(cats);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var cats = _data.GetCategories();
            var prods = _data.GetProducts();
            if (prods.Any(p => p.CategoryId == id))
                return BadRequest("Cannot delete: products use this category.");
            var existing = cats.FirstOrDefault(c => c.Id == id);
            if (existing == null) return NotFound();
            cats.Remove(existing);
            _data.SaveCategories(cats);
            return NoContent();
        }
    }
}
