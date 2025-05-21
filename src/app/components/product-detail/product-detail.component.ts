import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantity: number = 1;
  selectedSize: string = '';
  selectedColor: string = '';
  errorMessage: string = '';
  addedToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Lấy id sản phẩm từ URL
    this.route.paramMap.subscribe(params => {
      const productId = Number(params.get('id'));
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  // Lấy thông tin sản phẩm từ service
  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(product => {
      if (product) {
        this.product = product;
        // Mặc định chọn size và màu đầu tiên
        if (product.size.length > 0) {
          this.selectedSize = product.size[0];
        }
        if (product.color.length > 0) {
          this.selectedColor = product.color[0];
        }
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(): void {
    if (!this.product) return;

    // Kiểm tra đã chọn size và màu chưa
    if (!this.selectedSize || !this.selectedColor) {
      this.errorMessage = 'Vui lòng chọn size và màu sắc';
      return;
    }

    // Kiểm tra số lượng
    if (this.quantity < 1) {
      this.errorMessage = 'Số lượng phải lớn hơn 0';
      return;
    }

    // Thêm vào giỏ hàng
    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedSize,
      this.selectedColor
    );

    // Hiển thị thông báo thành công
    this.errorMessage = '';
    this.addedToCart = true;

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      this.addedToCart = false;
    }, 3000);
  }

  // Tăng số lượng
  increaseQuantity(): void {
    this.quantity++;
  }

  // Giảm số lượng
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
