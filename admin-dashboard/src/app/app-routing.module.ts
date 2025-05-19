// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';
import { AuthGuard } from './theme/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      // Product routes
      {
        path: 'products/list',
        loadComponent: () => import('./demo/microservices/products/product-list/product-list.component').then((c) => c.ProductListComponent)
      },
      {
        path: 'products/add',
        loadComponent: () => import('./demo/microservices/products/product-add/product-add.component').then((c) => c.ProductAddComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./demo/microservices/products/product-edit/product-edit.component').then((c) => c.ProductEditComponent)
      },
      {
        path: 'products/categories',
        loadComponent: () => import('./demo/microservices/products/product-categories/product-categories.component').then((c) => c.ProductCategoriesComponent)
      },
      // Order routes
      {
        path: 'orders/list',
        loadComponent: () => import('./demo/microservices/orders/order-list/order-list.component').then((c) => c.OrderListComponent)
      },
      {
        path: 'orders/detail/:id',
        loadComponent: () => import('./demo/microservices/orders/order-detail/order-detail.component').then((c) => c.OrderDetailComponent)
      },
      {
        path: 'orders/analytics',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      // User routes
      {
        path: 'users/list',
        loadComponent: () => import('./demo/microservices/users/user-list/user-list.component').then((c) => c.UserListComponent)
      },
      {
        path: 'users/detail/:id',
        loadComponent: () => import('./demo/microservices/users/user-detail/user-detail.component').then((c) => c.UserDetailComponent)
      },
      {
        path: 'users/roles',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/component/basic-component/color/color.component').then((c) => c.ColorComponent)
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/component/basic-component/typography/typography.component').then((c) => c.TypographyComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    // Check if there's a stored token on application init
    const token = localStorage.getItem('token');
    
    // If token exists, the user is likely already authenticated
    if (token) {
      // The AuthGuard will handle the actual validation and redirection
      console.log('User has existing authentication token');
    }
  }
}
