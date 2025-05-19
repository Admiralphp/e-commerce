import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  image?: string;
  options?: Record<string, string>;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  zipCode?: string;
  country: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  paymentDetails?: {
    cardType?: string;
    lastFour?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory?: {
    status: string;
    timestamp: string;
    comment?: string;
  }[];
  isPaid: boolean;
  paidAt?: string;
  shippingCost: number;
  tax?: number;
  discount?: number;
  notes?: string;
  orders?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.microservices.orders.baseUrl;

  constructor(private apiService: ApiService) {}

  getAllOrders(page: number = 1, limit: number = 10): Observable<OrderResponse> {
    return this.apiService.get<OrderResponse>(`${this.baseUrl}/admin/all?page=${page}&limit=${limit}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`${this.baseUrl}/${id}`);
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<Order> {
    return this.apiService.put<Order>(`${this.baseUrl}/admin/${id}`, { status });
  }

  cancelOrder(id: string): Observable<Order> {
    return this.apiService.put<Order>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
