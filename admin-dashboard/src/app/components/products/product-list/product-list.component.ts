import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory: string | null = null;
  confirmingDeleteId: string | null = null;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts()
      .subscribe({
        next: (data) => {
          this.products = data;
          this.filteredProducts = data;
          this.loading = false;
        },
        error: (error) => {
          this.alertService.error('Failed to load products');
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryFilter(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
                          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  createProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(id: string): void {
    this.router.navigate(['/products/edit', id]);
  }

  confirmDelete(id: string): void {
    this.confirmingDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id)
      .subscribe({
        next: () => {
          this.alertService.success('Product deleted successfully');
          this.products = this.products.filter(p => p.id !== id);
          this.applyFilters();
          this.confirmingDeleteId = null;
        },
        error: (error) => {
          this.alertService.error('Failed to delete product');
          this.confirmingDeleteId = null;
        }
      });
  }

  formatPrice(price: number): string {
    return '$' + price.toFixed(2);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}