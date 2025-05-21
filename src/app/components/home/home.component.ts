import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: string[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Lấy danh sách sản phẩm nổi bật (4 sản phẩm đầu tiên)
    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 4);

      // Lấy danh sách danh mục từ sản phẩm
      const categorySet = new Set<string>();
      products.forEach(product => categorySet.add(product.category));
      this.categories = Array.from(categorySet);
    });
  }
}
