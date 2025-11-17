using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.Models;
using InventoryAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization; 

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DataService _data;
        public ProductsController(DataService data)
        {
            _data = data;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Product>> Get() => Ok(_data.GetProducts());

        [HttpGet("category/{categoryId}")]
        public ActionResult<IEnumerable<Product>> GetByCategory(Guid categoryId)
        {
            var products = _data.GetProducts();
            var filtered = products.Where(p => p.CategoryId == categoryId).ToList();

            return Ok(filtered);
        }


        [HttpPost]
        public ActionResult<Product> Post([FromBody] Product model)
        {
            if (string.IsNullOrWhiteSpace(model.ProductName)) return BadRequest("ProductName required");
            var products = _data.GetProducts();
            model.Id = Guid.NewGuid();
            products.Add(model);
            _data.SaveProducts(products);
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }


        [HttpPut("{id}")]
        public IActionResult Put(Guid id, [FromBody] Product model)
        {
            var products = _data.GetProducts();
            var existing = products.FirstOrDefault(p => p.Id == id);
            if (existing == null) return NotFound();

            existing.ProductName = model.ProductName;
            existing.ProductCode = model.ProductCode;
            existing.CategoryId = model.CategoryId;
            existing.Price = model.Price;
            existing.StockQuantity = model.StockQuantity;
            existing.IsActive = model.IsActive;

            _data.SaveProducts(products);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var products = _data.GetProducts();
            var existing = products.FirstOrDefault(p => p.Id == id);
            if (existing == null) return NotFound();
            products.Remove(existing);
            _data.SaveProducts(products);
            return NoContent();
        }
    }
}