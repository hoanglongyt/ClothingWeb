using ClothingShopAPI.Data;
using ClothingShopAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ClothingShopAPI.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _dbSet
                .Include(p => p.ProductSizes)
                .Include(p => p.ProductColors)
                .ToListAsync();
        }

        public override async Task<Product?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.ProductSizes)
                .Include(p => p.ProductColors)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            return await _dbSet
                .Include(p => p.ProductSizes)
                .Include(p => p.ProductColors)
                .Where(p => p.Category == category)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetAllCategoriesAsync()
        {
            return await _dbSet
                .Select(p => p.Category)
                .Distinct()
                .ToListAsync();
        }

        public override async Task<Product> AddAsync(Product product)
        {
            // Xử lý thêm sizes và colors
            if (product.Size != null && product.Size.Count > 0)
            {
                product.ProductSizes = product.Size.Select(s => new ProductSize { Size = s }).ToList();
            }

            if (product.Color != null && product.Color.Count > 0)
            {
                product.ProductColors = product.Color.Select(c => new ProductColor { Color = c }).ToList();
            }

            return await base.AddAsync(product);
        }

        public override async Task UpdateAsync(Product product)
        {
            // Lấy sản phẩm hiện tại từ database
            var existingProduct = await _dbSet
                .Include(p => p.ProductSizes)
                .Include(p => p.ProductColors)
                .FirstOrDefaultAsync(p => p.Id == product.Id);

            if (existingProduct != null)
            {
                // Cập nhật thông tin cơ bản
                _context.Entry(existingProduct).CurrentValues.SetValues(product);

                // Cập nhật sizes
                if (product.Size != null)
                {
                    // Xóa sizes cũ
                    _context.ProductSizes.RemoveRange(existingProduct.ProductSizes);

                    // Thêm sizes mới
                    existingProduct.ProductSizes = product.Size.Select(s => new ProductSize { Size = s, ProductId = product.Id }).ToList();
                }

                // Cập nhật colors
                if (product.Color != null)
                {
                    // Xóa colors cũ
                    _context.ProductColors.RemoveRange(existingProduct.ProductColors);

                    // Thêm colors mới
                    existingProduct.ProductColors = product.Color.Select(c => new ProductColor { Color = c, ProductId = product.Id }).ToList();
                }

                // Cập nhật thời gian
                existingProduct.UpdatedAt = DateTime.UtcNow;

                await SaveChangesAsync();
            }
        }
    }

    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
        Task<IEnumerable<string>> GetAllCategoriesAsync();
    }
}
