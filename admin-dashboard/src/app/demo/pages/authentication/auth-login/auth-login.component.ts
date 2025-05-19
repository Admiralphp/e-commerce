// project import
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../theme/services/auth.service';

@Component({
  selector: 'app-auth-login',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent implements OnInit {
  // public properties
  loginForm!: FormGroup;
  isSubmitting = false;
  loginError = '';
  
  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
  
  private returnUrl: string = '/dashboard/default';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      email: ['admin', [Validators.required]],
      password: ['admin', [Validators.required]],
      rememberMe: [true]
    });
    
    // Get return url from route parameters or default to '/dashboard/default'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/default';
    
    // If already authenticated, redirect to return URL
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
  
  // Handle login form submission
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.loginError = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: (success) => {
        if (success) {
          // Navigate to the return URL (or dashboard by default)
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.loginError = 'Invalid username or password';
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        this.loginError = 'An error occurred during login';
        this.isSubmitting = false;
      }
    });
  }
}
