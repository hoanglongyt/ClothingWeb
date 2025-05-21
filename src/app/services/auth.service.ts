import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5089/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Khôi phục thông tin người dùng từ localStorage nếu có
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }

  // Lấy thông tin người dùng hiện tại
  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Lấy token hiện tại
  public get token(): string | null {
    return this.tokenSubject.value;
  }

  // Kiểm tra người dùng đã đăng nhập chưa
  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Kiểm tra người dùng có phải là admin không
  public get isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin || false;
  }

  // Đăng ký
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => this.setAuthData(response))
      );
  }

  // Đăng nhập
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => this.setAuthData(response))
      );
  }

  // Đăng xuất
  logout(): void {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Cập nhật BehaviorSubject
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  // Lưu thông tin xác thực
  private setAuthData(response: AuthResponse): void {
    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    
    // Cập nhật BehaviorSubject
    this.currentUserSubject.next(response.user);
    this.tokenSubject.next(response.token);
  }
}
