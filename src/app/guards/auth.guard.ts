import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn) {
      return true;
    }
    
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return this.router.createUrlTree(['/login']);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.isLoggedIn && this.authService.isAdmin) {
      return true;
    }
    
    // Nếu không phải admin, chuyển hướng đến trang chủ
    return this.router.createUrlTree(['/']);
  }
}
