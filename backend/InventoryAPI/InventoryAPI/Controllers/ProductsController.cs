using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.Models;
using InventoryAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization; // Import is not needed here, but kept in mind

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
        // This will now return camelCase properties thanks to the [JsonPropertyName] attributes
        public ActionResult<IEnumerable<Product>> Get() => Ok(_data.GetProducts());

        [HttpPost]
        // The model binder will correctly populate 'model' from the camelCase JSON payload
        public ActionResult<Product> Post([FromBody] Product model)
        {
            // Use the actual property name from the model (ProductName) for server-side checks
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

            // The model is correctly populated from the frontend's camelCase payload
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