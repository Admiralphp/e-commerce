import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Order, OrderStatus } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  searchTerm = '';
  selectedStatus: OrderStatus | 'all' = 'all';
  confirmingDeleteId: string | null = null;
  confirmingProcessId: string | null = null;
  
  orderStatusEnum = OrderStatus;

  constructor(
    private orderService: OrderService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders()
      .subscribe({
        next: (data) => {
          this.orders = data;
          this.filteredOrders = data;
          this.loading = false;
        },
        error: (error) => {
          this.alertService.error('Failed to load orders');
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilter(status: OrderStatus | 'all'): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
                          order.customerEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || order.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  viewOrderDetails(id: string): void {
    this.router.navigate(['/orders', id]);
  }

  confirmProcess(id: string): void {
    this.confirmingProcessId = id;
  }

  cancelProcess(): void {
    this.confirmingProcessId = null;
  }

  processOrder(id: string): void {
    this.orderService.markAsProcessed(id)
      .subscribe({
        next: (updatedOrder) => {
          this.alertService.success('Order marked as processing');
          // Update the order in the list
          const index = this.orders.findIndex(o => o.id === id);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
          }
          this.applyFilters();
          this.confirmingProcessId = null;
        },
        error: (error) => {
          this.alertService.error('Failed to process order');
          this.confirmingProcessId = null;
        }
      });
  }

  confirmDelete(id: string): void {
    this.confirmingDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  deleteOrder(id: string): void {
    this.orderService.deleteOrder(id)
      .subscribe({
        next: () => {
          this.alertService.success('Order deleted successfully');
          this.orders = this.orders.filter(o => o.id !== id);
          this.applyFilters();
          this.confirmingDeleteId = null;
        },
        error: (error) => {
          this.alertService.error('Failed to delete order');
          this.confirmingDeleteId = null;
        }
      });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatPrice(price: number): string {
    return '$' + price.toFixed(2);
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.PROCESSING:
        return 'status-processing';
      case OrderStatus.SHIPPED:
        return 'status-shipped';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }
}