using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClothingShopAPI.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [NotMapped] // This will be stored in ProductSize table
        public List<string> Size { get; set; } = new List<string>();

        [NotMapped] // This will be stored in ProductColor table
        public List<string> Color { get; set; } = new List<string>();

        public bool InStock { get; set; } = true;

        public int StockQuantity { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<ProductSize>? ProductSizes { get; set; }
        public virtual ICollection<ProductColor>? ProductColors { get; set; }
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
    }
}
