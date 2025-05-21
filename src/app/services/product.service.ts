import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5089/api/products';

  constructor(private http: HttpClient) { }

  // Phương thức private để sửa đường dẫn hình ảnh
  private fixImageUrl(product: Product): Product {
    // Kiểm tra nếu đường dẫn bắt đầu bằng '/'
    if (product.imageUrl && product.imageUrl.startsWith('/')) {
      // Loại bỏ dấu '/' ở đầu
      product.imageUrl = product.imageUrl.substring(1);
    }

    // Nếu đường dẫn không tồn tại hoặc không hợp lệ, sử dụng đường dẫn mặc định
    if (!product.imageUrl) {
      product.imageUrl = 'assets/images/products/default.jpg';
    }

    return product;
  }

  // Phương thức private để sửa đường dẫn hình ảnh cho mảng sản phẩm
  private fixImageUrls(products: Product[]): Product[] {
    return products.map(product => this.fixImageUrl(product));
  }

  // Lấy tất cả sản phẩm
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(
        map(products => this.fixImageUrls(products))
      );
  }

  // Lấy sản phẩm theo ID
  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        map(product => this.fixImageUrl(product))
      );
  }

  // Lấy sản phẩm theo danh mục
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`)
      .pipe(
        map(products => this.fixImageUrls(products))
      );
  }
}
