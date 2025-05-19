import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

import { ProductService, Product } from '../../../../theme/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  searchQuery = '';
  errorMessage = '';
  successMessage = '';
  Math = Math; // Make Math available to the template

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService.getAllProducts(this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load products. Please try again later.';
          this.isLoading = false;
          console.error('Error loading products:', error);
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.loadProducts();
  }

  searchProducts(): void {
    // Implement search functionality
    this.currentPage = 0;
    this.loadProducts();
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.errorMessage = '';
      this.successMessage = '';
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully';
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete product';
          console.error('Error deleting product:', error);
        }
      });
    }
  }
}
