import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ProductService, Product } from '../../../../theme/services/product.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardComponent
  ],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  categories: string[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  productId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    
    // Get product ID from route params
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProductDetails(this.productId);
    });
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(cat => cat.name);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load categories. Please try again later.';
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProductDetails(id: string): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Populate form with product data
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          imageUrl: product.imageUrl
        });
        
        // Set image preview
        this.imagePreview = product.imageUrl;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load product details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading product details:', error);
      }
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server and get a URL back
      // For now, we'll just create a local preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        // In a real implementation, you would set the imageUrl field with the URL from the server
        // this.productForm.patchValue({ imageUrl: url });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // In a real implementation, you would upload the image first and then update the product
    // For now, we'll just use the existing image URL or a placeholder
    const productData = {
      ...this.productForm.value,
      imageUrl: this.productForm.value.imageUrl || this.imagePreview || 'assets/images/placeholder-product.png'
    };

    this.productService.updateProduct(this.productId, productData).subscribe({
      next: () => {
        this.successMessage = 'Product updated successfully!';
        this.isSubmitting = false;
        
        // Navigate to product list after a short delay
        setTimeout(() => {
          this.router.navigate(['/products/list']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to update product. Please try again.';
        this.isSubmitting = false;
        console.error('Error updating product:', error);
      }
    });
  }

  // Helper method for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }
}
