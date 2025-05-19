import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  lastLogin?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orders?: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  activityLog?: {
    type: string;
    description: string;
    timestamp: string;
    details?: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}

export interface UserResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.microservices.auth.baseUrl;

  constructor(private apiService: ApiService) {}

  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>(`${this.baseUrl}/me`);
  }

  getAllUsers(page: number = 1, limit: number = 10): Observable<UserResponse> {
    return this.apiService.get<UserResponse>(`${this.baseUrl}/users?page=${page}&limit=${limit}`);
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`${this.baseUrl}/users/${id}`);
  }

  updateUserRole(id: string, role: string): Observable<User> {
    return this.apiService.put<User>(`${this.baseUrl}/users/${id}/role`, { role });
  }

  updateUserStatus(id: string, status: User['status']): Observable<User> {
    return this.apiService.put<User>(`${this.baseUrl}/users/${id}/status`, { status });
  }
}
