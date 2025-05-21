export interface User {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  address?: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  address?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
