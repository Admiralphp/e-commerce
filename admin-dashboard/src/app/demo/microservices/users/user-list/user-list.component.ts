import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { UserService, User } from '../../../../theme/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  searchQuery = '';
  errorMessage = '';
  successMessage = '';
  Math = Math; // Make Math available to the template
  
  // Filter options
  roleFilter: string = '';
  statusFilter: string = '';
  
  // Role options for dropdown
  roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'customer', label: 'Customer' }
  ];
  
  // Status options for dropdown
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active' as const, label: 'Active' },
    { value: 'inactive' as const, label: 'Inactive' },
    { value: 'suspended' as const, label: 'Suspended' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getAllUsers(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users. Please try again later.';
        this.isLoading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.loadUsers();
  }

  searchUsers(): void {
    // Reset page to first page when searching
    this.currentPage = 0;
    this.loadUsers();
  }

  updateUserStatus(userId: string, newStatus: 'active' | 'inactive' | 'suspended'): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.userService.updateUserStatus(userId, newStatus).subscribe({
      next: () => {
        this.successMessage = `User status updated to ${newStatus}`;
        
        // Update the local user status without reloading from server
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex].status = newStatus;
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to update user status';
        console.error('Error updating user status:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-congo-green text-white';
      case 'inactive':
        return 'bg-warning text-dark';
      case 'suspended':
        return 'bg-congo-red text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-congo-red text-white';
      case 'manager':
        return 'bg-congo-yellow text-dark';
      case 'customer':
        return 'bg-congo-green text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Apply filters to users
  get filteredUsers(): User[] {
    let filtered = [...this.users];
    
    // Apply role filter
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }
    
    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(user => user.status === this.statusFilter);
    }
    
    // Apply search query (search in name and email)
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }
}
