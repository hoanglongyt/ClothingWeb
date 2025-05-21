using Microsoft.EntityFrameworkCore;
using ClothingShopAPI.Models;
using BCrypt.Net;

namespace ClothingShopAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public async Task SeedDataAsync()
        {
            // Kiểm tra xem đã có dữ liệu trong database chưa
            if (!Users.Any() && !Products.Any())
            {
                await SeedUsersAsync();
                await SeedProductsAsync();
                await SaveChangesAsync();
            }
        }

        private async Task SeedUsersAsync()
        {
            // Thêm user admin
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                FullName = "Admin User",
                Address = "123 Admin St",
                Phone = "0987654321",
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };

            // Thêm user khách hàng
            var customerUser = new User
            {
                Username = "customer",
                Email = "customer@example.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("customer123"),
                FullName = "Customer User",
                Address = "456 Customer St",
                Phone = "0123456789",
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };

            await Users.AddRangeAsync(adminUser, customerUser);
        }

        private async Task SeedProductsAsync()
        {
            // Tạo danh sách sản phẩm
            var products = new List<Product>
            {
                new Product
                {
                    Name = "Áo thun nam basic",
                    Description = "Áo thun nam chất liệu cotton 100%, thoáng mát",
                    Price = 199000,
                    ImageUrl = "/assets/images/products/ao-thun-nam.jpg",
                    Category = "Áo nam",
                    InStock = true,
                    StockQuantity = 100,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Quần jean nữ ống rộng",
                    Description = "Quần jean nữ ống rộng, phong cách hiện đại",
                    Price = 450000,
                    ImageUrl = "/assets/images/products/quan-jean-nu.jpg",
                    Category = "Quần nữ",
                    InStock = true,
                    StockQuantity = 50,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Áo sơ mi nam dài tay",
                    Description = "Áo sơ mi nam dài tay, chất liệu lụa cao cấp",
                    Price = 350000,
                    ImageUrl = "/assets/images/products/ao-so-mi-nam.jpg",
                    Category = "Áo nam",
                    InStock = true,
                    StockQuantity = 75,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Váy liền thân nữ",
                    Description = "Váy liền thân nữ, thiết kế thanh lịch, phù hợp đi làm và dạo phố",
                    Price = 550000,
                    ImageUrl = "/assets/images/products/vay-lien-than.jpg",
                    Category = "Váy nữ",
                    InStock = true,
                    StockQuantity = 30,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await Products.AddRangeAsync(products);
            await SaveChangesAsync();

            // Thêm kích thước và màu sắc cho sản phẩm
            var product1 = await Products.FirstOrDefaultAsync(p => p.Name == "Áo thun nam basic");
            if (product1 != null)
            {
                var sizes = new List<ProductSize>
                {
                    new ProductSize { ProductId = product1.Id, Size = "S" },
                    new ProductSize { ProductId = product1.Id, Size = "M" },
                    new ProductSize { ProductId = product1.Id, Size = "L" },
                    new ProductSize { ProductId = product1.Id, Size = "XL" }
                };

                var colors = new List<ProductColor>
                {
                    new ProductColor { ProductId = product1.Id, Color = "Đen" },
                    new ProductColor { ProductId = product1.Id, Color = "Trắng" },
                    new ProductColor { ProductId = product1.Id, Color = "Xám" }
                };

                await ProductSizes.AddRangeAsync(sizes);
                await ProductColors.AddRangeAsync(colors);
            }

            var product2 = await Products.FirstOrDefaultAsync(p => p.Name == "Quần jean nữ ống rộng");
            if (product2 != null)
            {
                var sizes = new List<ProductSize>
                {
                    new ProductSize { ProductId = product2.Id, Size = "S" },
                    new ProductSize { ProductId = product2.Id, Size = "M" },
                    new ProductSize { ProductId = product2.Id, Size = "L" }
                };

                var colors = new List<ProductColor>
                {
                    new ProductColor { ProductId = product2.Id, Color = "Xanh nhạt" },
                    new ProductColor { ProductId = product2.Id, Color = "Xanh đậm" }
                };

                await ProductSizes.AddRangeAsync(sizes);
                await ProductColors.AddRangeAsync(colors);
            }

            var product3 = await Products.FirstOrDefaultAsync(p => p.Name == "Áo sơ mi nam dài tay");
            if (product3 != null)
            {
                var sizes = new List<ProductSize>
                {
                    new ProductSize { ProductId = product3.Id, Size = "M" },
                    new ProductSize { ProductId = product3.Id, Size = "L" },
                    new ProductSize { ProductId = product3.Id, Size = "XL" },
                    new ProductSize { ProductId = product3.Id, Size = "XXL" }
                };

                var colors = new List<ProductColor>
                {
                    new ProductColor { ProductId = product3.Id, Color = "Trắng" },
                    new ProductColor { ProductId = product3.Id, Color = "Xanh nhạt" },
                    new ProductColor { ProductId = product3.Id, Color = "Đen" }
                };

                await ProductSizes.AddRangeAsync(sizes);
                await ProductColors.AddRangeAsync(colors);
            }

            var product4 = await Products.FirstOrDefaultAsync(p => p.Name == "Váy liền thân nữ");
            if (product4 != null)
            {
                var sizes = new List<ProductSize>
                {
                    new ProductSize { ProductId = product4.Id, Size = "S" },
                    new ProductSize { ProductId = product4.Id, Size = "M" },
                    new ProductSize { ProductId = product4.Id, Size = "L" }
                };

                var colors = new List<ProductColor>
                {
                    new ProductColor { ProductId = product4.Id, Color = "Đen" },
                    new ProductColor { ProductId = product4.Id, Color = "Đỏ" },
                    new ProductColor { ProductId = product4.Id, Color = "Hồng" }
                };

                await ProductSizes.AddRangeAsync(sizes);
                await ProductColors.AddRangeAsync(colors);
            }
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<ProductSize> ProductSizes { get; set; }
        public DbSet<ProductColor> ProductColors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductSize>()
                .HasOne(ps => ps.Product)
                .WithMany(p => p.ProductSizes)
                .HasForeignKey(ps => ps.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductColor>()
                .HasOne(pc => pc.Product)
                .WithMany(p => p.ProductColors)
                .HasForeignKey(pc => pc.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
