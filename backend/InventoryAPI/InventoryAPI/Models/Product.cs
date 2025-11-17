using System;
using System.Text.Json.Serialization;

namespace InventoryAPI.Models
{
    public class Product
    {
        public Guid Id { get; set; }

        [JsonPropertyName("name")]
        public string ProductName { get; set; }

        [JsonPropertyName("code")]
        public string ProductCode { get; set; }

        [JsonPropertyName("categoryId")]
        public Guid CategoryId { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [JsonPropertyName("stockQuantity")]
        public int StockQuantity { get; set; }

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }
    }
}