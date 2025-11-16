using System;
using System.Text.Json.Serialization;

namespace InventoryAPI.Models
{
    public class Product
    {
        // No attribute needed if the frontend uses 'id' (which it does)
        public Guid Id { get; set; }

        // CRITICAL FIX: Maps frontend 'name' to backend 'ProductName'
        [JsonPropertyName("name")]
        public string ProductName { get; set; }

        // CRITICAL FIX: Maps frontend 'code' to backend 'ProductCode'
        [JsonPropertyName("code")]
        public string ProductCode { get; set; }

        // Mappings for the other properties
        [JsonPropertyName("categoryId")]
        public Guid CategoryId { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        // CRITICAL FIX: Maps frontend 'stockQuantity' to backend 'StockQuantity'
        [JsonPropertyName("stockQuantity")]
        public int StockQuantity { get; set; }

        // CRITICAL FIX: Maps frontend 'isActive' to backend 'IsActive'
        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; }
    }
}