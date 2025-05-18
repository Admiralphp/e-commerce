import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Order, OrderStatus, OrderStatusUpdateDto } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  updatingStatus = false;
  confirmingDelete = false;
  orderStatusEnum = OrderStatus;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    } else {
      this.router.navigate(['/orders']);
    }
  }

  loadOrder(id: string): void {
    this.loading = true;
    this.orderService.getOrder(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.order = data;
        },
        error: (error) => {
          this.alertService.error('Failed to load order details');
          this.router.navigate(['/orders']);
        }
      });
  }

  updateOrderStatus(status: OrderStatus): void {
    if (!this.order) return;
    
    this.updatingStatus = true;
    
    const updateDto: OrderStatusUpdateDto = {
      id: this.order.id,
      status: status
    };
    
    this.orderService.updateOrderStatus(updateDto)
      .pipe(finalize(() => this.updatingStatus = false))
      .subscribe({
        next: (updatedOrder) => {
          this.order = updatedOrder;
          this.alertService.success(`Order status updated to ${status}`);
        },
        error: (error) => {
          this.alertService.error('Failed to update order status');
        }
      });
  }

  confirmDelete(): void {
    this.confirmingDelete = true;
  }

  cancelDelete(): void {
    this.confirmingDelete = false;
  }

  deleteOrder(): void {
    if (!this.order) return;
    
    this.orderService.deleteOrder(this.order.id)
      .subscribe({
        next: () => {
          this.alertService.success('Order deleted successfully');
          this.router.navigate(['/orders']);
        },
        error: (error) => {
          this.alertService.error('Failed to delete order');
          this.confirmingDelete = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  formatPrice(price: number): string {
    return '$' + price.toFixed(2);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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