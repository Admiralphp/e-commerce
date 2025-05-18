import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ProductService } from '../../../services/product.service';
import { AlertService } from '../../../services/alert.service';
import { Product, ProductCategory } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  productId: string | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  categories = Object.values(ProductCategory);

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    
    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  private initForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      imageUrl: [''],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
        },
        error: (error) => {
          this.alertService.error('Failed to load product');
          this.router.navigate(['/products']);
        }
      });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    
    if (this.isEditMode && this.productId) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  private createProduct(): void {
    this.productService.createProduct(this.productForm.value)
      .pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: () => {
          this.alertService.success('Product created successfully');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.alertService.error('Failed to create product');
        }
      });
  }

  private updateProduct(): void {
    if (!this.productId) return;
    
    const product = {
      id: this.productId,
      ...this.productForm.value
    };
    
    this.productService.updateProduct(product)
      .pipe(finalize(() => this.submitting = false))
      .subscribe({
        next: () => {
          this.alertService.success('Product updated successfully');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.alertService.error('Failed to update product');
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  // Helper for validation errors
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }
}