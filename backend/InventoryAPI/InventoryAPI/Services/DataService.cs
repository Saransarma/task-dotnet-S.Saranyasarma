using InventoryAPI.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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

            if (!File.Exists(_filePath))
            {
                var init = new { Products = new List<Product>(), Categories = new List<Category>() };
                File.WriteAllText(_filePath, JsonConvert.SerializeObject(init, Formatting.Indented));
            }
        }

        private dynamic ReadRaw()
        {
            _lock.EnterReadLock();
            try
            {
                var json = File.ReadAllText(_filePath);
                return JsonConvert.DeserializeObject<dynamic>(json);
            }
            finally
            {
                _lock.ExitReadLock();
            }
        }

        private void WriteAll(List<Product> products, List<Category> categories)
        {
            _lock.EnterWriteLock();
            try
            {
                var wrapper = new { products, categories };
                File.WriteAllText(_filePath, JsonConvert.SerializeObject(wrapper, Formatting.Indented));
            }
            finally
            {
                _lock.ExitWriteLock();
            }
        }


        public (List<Product> products, List<Category> categories) GetAll()
        {
            var raw = ReadRaw();
            var p = JsonConvert.DeserializeObject<List<Product>>(JsonConvert.SerializeObject(raw.products));
            var c = JsonConvert.DeserializeObject<List<Category>>(JsonConvert.SerializeObject(raw.categories));
            return (p, c);
        }

        public List<Product> GetProducts()=>GetAll().products;

        public List<Category> GetCategories()=>GetAll().categories;

        public void SaveProducts(List<Product> products)
        {
            var c = GetCategories();
            WriteAll(products, c);
        }

        public void SaveCategories(List<Category> categories)
        {
            var p = GetProducts();
            WriteAll(p, categories);
        }


    }
}
