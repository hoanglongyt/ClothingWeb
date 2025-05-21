import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService, Order } from '../../services/order.service';
import { CartItem } from '../../models/cart-item.model';

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  orderPlaced: boolean = false;

  customerInfo: CustomerInfo = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'cod'
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy thông tin giỏ hàng
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();

      // Nếu giỏ hàng trống, chuyển hướng về trang giỏ hàng
      if (items.length === 0 && !this.orderPlaced) {
        this.router.navigate(['/cart']);
      }
    });
  }

  // Xử lý khi gửi form thanh toán
  onSubmit(): void {
    // Kiểm tra thông tin khách hàng
    if (this.validateForm()) {
      // Tạo đối tượng đơn hàng
      const order: Order = {
        customerName: this.customerInfo.fullName,
        customerEmail: this.customerInfo.email,
        customerPhone: this.customerInfo.phone,
        customerAddress: this.customerInfo.address,
        customerCity: this.customerInfo.city,
        paymentMethod: this.customerInfo.paymentMethod,
        totalAmount: this.totalPrice,
        items: this.cartItems
      };

      // Gửi đơn hàng đến API
      this.orderService.createOrder(order).subscribe({
        next: (response) => {
          console.log('Đặt hàng thành công:', response);

          // Đánh dấu đã đặt hàng thành công
          this.orderPlaced = true;

          // Xóa giỏ hàng
          this.cartService.clearCart();
        },
        error: (error) => {
          console.error('Lỗi khi đặt hàng:', error);
          alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
        }
      });
    }
  }

  // Kiểm tra thông tin form
  validateForm(): boolean {
    // Kiểm tra các trường bắt buộc
    if (!this.customerInfo.fullName ||
        !this.customerInfo.email ||
        !this.customerInfo.phone ||
        !this.customerInfo.address ||
        !this.customerInfo.city) {
      alert('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.customerInfo.email)) {
      alert('Email không hợp lệ');
      return false;
    }

    // Kiểm tra định dạng số điện thoại
    const phonePattern = /^[0-9]{10,11}$/;
    if (!phonePattern.test(this.customerInfo.phone)) {
      alert('Số điện thoại không hợp lệ');
      return false;
    }

    return true;
  }
}
