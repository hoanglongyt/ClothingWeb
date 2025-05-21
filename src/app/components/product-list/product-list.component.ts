import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Lấy danh sách sản phẩm
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;

      // Lấy danh sách danh mục từ sản phẩm
      const categorySet = new Set<string>();
      products.forEach(product => categorySet.add(product.category));
      this.categories = Array.from(categorySet);

      // Kiểm tra xem có tham số category trong URL không
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategory = params['category'];
          this.filterProducts();
        }
      });
    });
  }

  // Lọc sản phẩm theo danh mục và từ khóa tìm kiếm
  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      // Lọc theo danh mục nếu có chọn danh mục
      const categoryMatch = this.selectedCategory ?
        product.category === this.selectedCategory : true;

      // Lọc theo từ khóa tìm kiếm
      const searchMatch = this.searchTerm ?
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;

      return categoryMatch && searchMatch;
    });
  }

  // Xử lý khi thay đổi danh mục
  onCategoryChange(): void {
    this.filterProducts();
  }

  // Xử lý khi thay đổi từ khóa tìm kiếm
  onSearchChange(): void {
    this.filterProducts();
  }
}
