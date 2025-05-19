import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { OrderService, Order } from '../../../../theme/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  orderId: string = '';

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = id;
        this.loadOrder(id);
      } else {
        this.errorMessage = 'Order ID is missing';
        this.isLoading = false;
      }
    });
  }

  loadOrder(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load order details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading order:', error);
      }
    });
  }

  updateOrderStatus(newStatus: string): void {
    if (!this.order) return;
    
    this.errorMessage = '';
    this.successMessage = '';
    
    this.orderService.updateOrderStatus(this.order.id, newStatus as any).subscribe({
      next: () => {
        this.successMessage = `Order status updated to ${newStatus}`;
        if (this.order) {
          this.order.status = newStatus as any;
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to update order status';
        console.error('Error updating order status:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'processing':
        return 'bg-info text-white';
      case 'shipped':
        return 'bg-primary text-white';
      case 'delivered':
        return 'bg-success text-white';
      case 'cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  printOrder(): void {
    window.print();
  }

  // Get next status options based on current status
  get nextStatusOptions(): {value: string, label: string}[] {
    if (!this.order) return [];
    
    const options: {value: string, label: string}[] = [];
    
    switch (this.order.status) {
      case 'pending':
        options.push({ value: 'processing', label: 'Mark as Processing' });
        options.push({ value: 'cancelled', label: 'Cancel Order' });
        break;
      case 'processing':
        options.push({ value: 'shipped', label: 'Mark as Shipped' });
        options.push({ value: 'cancelled', label: 'Cancel Order' });
        break;
      case 'shipped':
        options.push({ value: 'delivered', label: 'Mark as Delivered' });
        options.push({ value: 'cancelled', label: 'Cancel Order' });
        break;
      case 'delivered':
        // No further status changes for delivered orders
        break;
      case 'cancelled':
        // No further status changes for cancelled orders
        break;
    }
    
    return options;
  }

  // Calculate subtotal (without shipping)
  get subtotal(): number {
    if (!this.order) return 0;
    
    return this.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
