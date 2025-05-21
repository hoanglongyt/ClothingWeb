import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Khôi phục giỏ hàng từ localStorage nếu có
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  // Lấy tất cả sản phẩm trong giỏ hàng
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: Product, quantity: number = 1, size: string, color: string): void {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (cùng size và color)
    const existingItem = this.cartItems.find(
      item => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      // Nếu đã có, tăng số lượng
      existingItem.quantity += quantity;
    } else {
      // Nếu chưa có, thêm mới
      this.cartItems.push({ product, quantity, size, color });
    }

    // Cập nhật BehaviorSubject và lưu vào localStorage
    this.cartSubject.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity(index: number, quantity: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems[index].quantity = quantity;
      this.cartSubject.next(this.cartItems);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(index: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems.splice(index, 1);
      this.cartSubject.next(this.cartItems);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  // Xóa toàn bộ giỏ hàng
  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    localStorage.removeItem('cart');
  }

  // Tính tổng tiền giỏ hàng
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  // Lấy tổng số lượng sản phẩm trong giỏ hàng
  getCartItemCount(): number {
    return this.cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}
