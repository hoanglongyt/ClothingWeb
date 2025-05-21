import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    address: '',
    phone: ''
  };

  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Nếu đã đăng nhập, chuyển hướng đến trang chủ
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    // Kiểm tra mật khẩu xác nhận
    if (this.registerRequest.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Đang gửi yêu cầu đăng ký:', this.registerRequest);

    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        console.log('Đăng ký thành công:', response);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Lỗi đăng ký:', error);
        this.isLoading = false;

        if (error.status === 0) {
          this.errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (error.status === 500) {
          this.errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
        } else {
          this.errorMessage = error.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        }
      }
    });
  }
}
