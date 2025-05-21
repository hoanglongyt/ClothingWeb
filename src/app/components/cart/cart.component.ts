import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Đăng ký theo dõi thay đổi giỏ hàng
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  // Tính tổng tiền giỏ hàng
  calculateTotal(): void {
    this.totalPrice = this.cartService.getTotalPrice();
  }

  // Cập nhật số lượng sản phẩm
  updateQuantity(index: number, quantity: number): void {
    if (quantity < 1) quantity = 1;
    this.cartService.updateQuantity(index, quantity);
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  // Xóa toàn bộ giỏ hàng
  clearCart(): void {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
      this.cartService.clearCart();
    }
  }
}
