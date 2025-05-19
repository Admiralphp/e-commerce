import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { OrderService, Order } from '../../../../theme/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  searchQuery = '';
  errorMessage = '';
  successMessage = '';
  Math = Math; // Make Math available to the template
  
  // Filter options
  statusFilter: string = '';
  dateFilter: string = '';
  
  // Status options for dropdown
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.orderService.getAllOrders(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.loadOrders();
  }

  searchOrders(): void {
    // Reset page to first page when searching
    this.currentPage = 0;
    this.loadOrders();
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.orderService.updateOrderStatus(orderId, newStatus as any).subscribe({
      next: () => {
        this.successMessage = `Order status updated to ${newStatus}`;
        
        // Update the local order status without reloading from server
        const orderIndex = this.orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = newStatus as any;
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

  // Apply filters to orders
  get filteredOrders(): Order[] {
    let filtered = [...this.orders];
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }
    
    // Apply search query (search in order ID and customer name)
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) || 
        order.shippingAddress.name.toLowerCase().includes(query)
      );
    }
    
    // Apply date filter (today, this week, this month)
    if (this.dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (this.dateFilter) {
        case 'today':
          filtered = filtered.filter(order => new Date(order.createdAt) >= today);
          break;
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          filtered = filtered.filter(order => new Date(order.createdAt) >= weekStart);
          break;
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= monthStart);
          break;
      }
    }
    
    return filtered;
  }
}
