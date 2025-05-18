import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Order, OrderStatus, OrderStatusUpdateDto } from '../models/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL)
      .pipe(
        map(orders => orders.map(o => ({
          ...o,
          createdAt: new Date(o.createdAt),
          updatedAt: new Date(o.updatedAt)
        }))),
        catchError(this.handleError)
      );
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${id}`)
      .pipe(
        map(order => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  updateOrderStatus(updateDto: OrderStatusUpdateDto): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/${updateDto.id}/status`, { status: updateDto.status })
      .pipe(
        map(order => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  markAsProcessed(id: string): Observable<Order> {
    return this.updateOrderStatus({ id, status: OrderStatus.PROCESSING });
  }

  deleteOrder(id: string): Observable<void> {
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