import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product, ProductCreateDto, ProductUpdateDto } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL)
      .pipe(
        map(products => products.map(p => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }))),
        catchError(this.handleError)
      );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`)
      .pipe(
        map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  createProduct(product: ProductCreateDto): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product)
      .pipe(
        map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  updateProduct(product: ProductUpdateDto): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${product.id}`, product)
      .pipe(
        map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    const errorMessage = error.error?.message || 'Something went wrong';
    return throwError(() => new Error(errorMessage));
  }
}