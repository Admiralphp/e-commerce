import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { UserService, User } from '../../../../theme/services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardComponent
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  userId: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = id;
        this.loadUser(id);
      } else {
        this.errorMessage = 'User ID is missing';
        this.isLoading = false;
      }
    });
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  updateUserStatus(newStatus: 'active' | 'inactive' | 'suspended'): void {
    if (!this.user) return;
    
    this.errorMessage = '';
    this.successMessage = '';
    
    this.userService.updateUserStatus(this.user.id, newStatus).subscribe({
      next: () => {
        this.successMessage = `User status updated to ${newStatus}`;
        if (this.user) {
          this.user.status = newStatus;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  // Get available status options based on current status
  get statusOptions(): {value: 'active' | 'inactive' | 'suspended', label: string}[] {
    if (!this.user) return [];
    
    const options: {value: 'active' | 'inactive' | 'suspended', label: string}[] = [];
    
    switch (this.user.status) {
      case 'active':
        options.push({ value: 'inactive', label: 'Deactivate' });
        options.push({ value: 'suspended', label: 'Suspend' });
        break;
      case 'inactive':
        options.push({ value: 'active', label: 'Activate' });
        options.push({ value: 'suspended', label: 'Suspend' });
        break;
      case 'suspended':
        options.push({ value: 'active', label: 'Activate' });
        options.push({ value: 'inactive', label: 'Deactivate' });
        break;
    }
    
    return options;
  }
}
