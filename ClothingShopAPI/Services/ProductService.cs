using ClothingShopAPI.Models;
using ClothingShopAPI.Repositories;
using ClothingShopAPI.Data;

namespace ClothingShopAPI.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ApplicationDbContext _context;

        public ProductService(IProductRepository productRepository, ApplicationDbContext context)
        {
            _productRepository = productRepository;
            _context = context;

            // Kiểm tra và tạo dữ liệu mẫu nếu chưa có
            EnsureSampleDataCreatedAsync().GetAwaiter().GetResult();
        }

        private async Task EnsureSampleDataCreatedAsync()
        {
            // Kiểm tra xem đã có sản phẩm nào chưa
            var products = await _productRepository.GetAllAsync();
            if (!products.Any())
            {
                // Tạo dữ liệu mẫu
                var sampleProducts = new List<Product>
                {
                    new Product
                    {
                        Name = "Áo thun nam basic",
                        Description = "Áo thun nam chất liệu cotton 100%, thoáng mát",
                        Price = 199000,
                        ImageUrl = "/assets/images/products/ao-thun-nam.jpg",
                        Category = "Áo nam",
                        Size = new List<string> { "S", "M", "L", "XL" },
                        Color = new List<string> { "Đen", "Trắng", "Xám" },
                        InStock = true,
                        StockQuantity = 100
                    },
                    new Product
                    {
                        Name = "Quần jean nữ ống rộng",
                        Description = "Quần jean nữ ống rộng, phong cách hiện đại",
                        Price = 450000,
                        ImageUrl = "/assets/images/products/quan-jean-nu.jpg",
                        Category = "Quần nữ",
                        Size = new List<string> { "S", "M", "L" },
                        Color = new List<string> { "Xanh nhạt", "Xanh đậm" },
                        InStock = true,
                        StockQuantity = 50
                    },
                    new Product
                    {
                        Name = "Áo sơ mi nam dài tay",
                        Description = "Áo sơ mi nam dài tay, chất liệu lụa cao cấp",
                        Price = 350000,
                        ImageUrl = "/assets/images/products/ao-so-mi-nam.jpg",
                        Category = "Áo nam",
                        Size = new List<string> { "M", "L", "XL", "XXL" },
                        Color = new List<string> { "Trắng", "Xanh nhạt", "Đen" },
                        InStock = true,
                        StockQuantity = 75
                    },
                    new Product
                    {
                        Name = "Váy liền thân nữ",
                        Description = "Váy liền thân nữ, thiết kế thanh lịch, phù hợp đi làm và dạo phố",
                        Price = 550000,
                        ImageUrl = "/assets/images/products/vay-lien-than.jpg",
                        Category = "Váy nữ",
                        Size = new List<string> { "S", "M", "L" },
                        Color = new List<string> { "Đen", "Đỏ", "Hồng" },
                        InStock = true,
                        StockQuantity = 30
                    }
                };

                // Thêm vào database
                foreach (var product in sampleProducts)
                {
                    await _productRepository.AddAsync(product);
                }
            }
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            return await _productRepository.GetProductsByCategoryAsync(category);
        }

        public async Task<IEnumerable<string>> GetAllCategoriesAsync()
        {
            return await _productRepository.GetAllCategoriesAsync();
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            return await _productRepository.AddAsync(product);
        }

        public async Task<bool> UpdateProductAsync(int id, Product product)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
                return false;

            product.Id = id;
            await _productRepository.UpdateAsync(product);
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return false;

            await _productRepository.DeleteAsync(id);
            return true;
        }
    }
}
