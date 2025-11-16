using InventoryAPI.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading;

namespace InventoryAPI.Services
{
    public class DataService
    {
        private readonly string _filePath;
        private readonly ReaderWriterLockSlim _lock = new ReaderWriterLockSlim();

        public DataService(string filePath)
        {
            _filePath = filePath;

            var directory = Path.GetDirectoryName(_filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(_filePath))
            {
                var init = new DataWrapper
                {
                    Products = new List<Product>(),
                    Categories = new List<Category>()
                };

                File.WriteAllText(_filePath, JsonConvert.SerializeObject(init, Formatting.Indented));
            }
        }

        private class DataWrapper
        {
            public List<Product> Products { get; set; }
            public List<Category> Categories { get; set; }
        }

        private DataWrapper ReadAll()
        {
            _lock.EnterReadLock();
            try
            {
                var json = File.ReadAllText(_filePath);
                return JsonConvert.DeserializeObject<DataWrapper>(json);
            }
            finally
            {
                _lock.ExitReadLock();
            }
        }

        private void WriteAll(DataWrapper wrapper)
        {
            _lock.EnterWriteLock();
            try
            {
                File.WriteAllText(_filePath, JsonConvert.SerializeObject(wrapper, Formatting.Indented));
            }
            finally
            {
                _lock.ExitWriteLock();
            }
        }

        public List<Product> GetProducts()
        {
            return ReadAll().Products;
        }

        public List<Category> GetCategories()
        {
            return ReadAll().Categories;
        }

        public void SaveProducts(List<Product> products)
        {
            var wrapper = ReadAll();
            wrapper.Products = products;
            WriteAll(wrapper);
        }

        public void SaveCategories(List<Category> categories)
        {
            var wrapper = ReadAll();
            wrapper.Categories = categories;
            WriteAll(wrapper);
        }
    }
}
