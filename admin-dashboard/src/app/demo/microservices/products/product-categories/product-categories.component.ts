import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Project imports
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ProductService, ProductCategory } from '../../../../theme/services/product.service';

@Component({
  selector: 'app-product-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardComponent
  ],
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: ProductCategory[] = [];
  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  editMode = false;
  editCategoryId = '';

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load categories. Please try again later.';
        this.isLoading = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const categoryData = {
      name: this.categoryForm.value.name
    };

    if (this.editMode) {
      // Update existing category
      this.updateCategory(this.editCategoryId, categoryData);
    } else {
      // Create new category
      this.createCategory(categoryData);
    }
  }

  createCategory(categoryData: any): void {
    // In a real implementation, this would call an API endpoint to create a category
    // For demonstration purposes, we'll simulate a successful creation
    setTimeout(() => {
      // Simulate a new category with an ID
      const newCategory = {
        id: 'temp-' + Date.now(),
        name: categoryData.name
      };
      
      this.categories.push(newCategory);
      this.successMessage = 'Category created successfully!';
      this.isSubmitting = false;
      this.resetForm();
    }, 1000);
  }

  updateCategory(id: string, categoryData: any): void {
    // In a real implementation, this would call an API endpoint to update a category
    // For demonstration purposes, we'll simulate a successful update
    setTimeout(() => {
      const index = this.categories.findIndex(cat => cat.id === id);
      if (index !== -1) {
        this.categories[index] = {
          ...this.categories[index],
          name: categoryData.name
        };
      }
      
      this.successMessage = 'Category updated successfully!';
      this.isSubmitting = false;
      this.resetForm();
      this.exitEditMode();
    }, 1000);
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      // In a real implementation, this would call an API endpoint to delete a category
      // For demonstration purposes, we'll simulate a successful deletion
      setTimeout(() => {
        this.categories = this.categories.filter(cat => cat.id !== id);
        this.successMessage = 'Category deleted successfully!';
        
        // If we were editing this category, exit edit mode
        if (this.editMode && this.editCategoryId === id) {
          this.exitEditMode();
        }
      }, 500);
    }
  }

  editCategory(category: ProductCategory): void {
    this.editMode = true;
    this.editCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name
    });
  }

  exitEditMode(): void {
    this.editMode = false;
    this.editCategoryId = '';
    this.resetForm();
  }

  resetForm(): void {
    this.categoryForm.reset();
  }

  // Helper method for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }
}
