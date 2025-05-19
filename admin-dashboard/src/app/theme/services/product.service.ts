import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductCategory {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.microservices.products.baseUrl;

  constructor(private apiService: ApiService) {}

  getAllProducts(page: number = 1, limit: number = 10): Observable<ProductResponse> {
    return this.apiService.get<ProductResponse>(`${this.baseUrl}?page=${page}&limit=${limit}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.apiService.get<ProductCategory[]>(`${this.baseUrl}/categories`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.apiService.post<Product>(`${this.baseUrl}`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.apiService.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.baseUrl}/${id}`);
  }
}
