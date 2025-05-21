import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  cartItemCount: number = 0;
  currentUser: User | null = null;
  isLoggedIn: boolean = false;
  isUserMenuVisible: boolean = false;
  hideMenuTimeout: any = null;
  menuHideDelay: number = 400; // Thời gian delay khi di chuột ra khỏi menu (ms)

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Đăng ký theo dõi số lượng sản phẩm trong giỏ hàng
    this.cartService.getCartItems().subscribe(() => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });

    // Kiểm tra trạng thái đăng nhập
    this.checkLoginStatus();
  }

  // Kiểm tra trạng thái đăng nhập
  private checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.currentUser = this.authService.currentUser;
  }

  // Hiển thị menu người dùng
  showUserMenu(): void {
    // Xóa timeout ẩn menu nếu có
    if (this.hideMenuTimeout) {
      clearTimeout(this.hideMenuTimeout);
      this.hideMenuTimeout = null;
    }
    this.isUserMenuVisible = true;
  }

  // Ẩn menu người dùng với thời gian delay
  hideUserMenuWithDelay(): void {
    // Thiết lập timeout để ẩn menu sau một khoảng thời gian
    this.hideMenuTimeout = setTimeout(() => {
      this.isUserMenuVisible = false;
    }, this.menuHideDelay);
  }

  // Đăng xuất
  logout(): void {
    this.authService.logout();
    this.checkLoginStatus();
    this.isUserMenuVisible = false;
    this.router.navigate(['/']);
  }
}
