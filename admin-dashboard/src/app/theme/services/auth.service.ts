import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

interface User {
  username: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is already logged in from previous session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // For demo purposes only - in production, this should call an actual API
    if (username === 'admin' && password === 'admin') {
      const user: User = {
        username: username,
        isAdmin: true
      };
      
      // Store user details and token in local storage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', 'demo-token');
      
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      
      // Return success after a simulated delay
      return of(true).pipe(
        delay(1000) // Simulate server delay
      );
    }
    
    return of(false);
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
