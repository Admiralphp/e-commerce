import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ProductService } from '../../../../theme/services/product.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardComponent
  ],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  productForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  categories: string[] = [];
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
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

    // In a real implementation, you would upload the image first and then create the product
    // For now, we'll just use a placeholder image URL
    const productData = {
      ...this.productForm.value,
      imageUrl: this.productForm.value.imageUrl || 'assets/images/placeholder-product.png'
    };

    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.successMessage = 'Product created successfully!';
        this.isSubmitting = false;
        
        // Reset form after successful submission
        this.productForm.reset();
        this.imagePreview = null;
        
        // Navigate to product list after a short delay
        setTimeout(() => {
          this.router.navigate(['/products/list']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create product. Please try again.';
        this.isSubmitting = false;
        console.error('Error creating product:', error);
      }
    });
  }

  // Helper method for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }
}
