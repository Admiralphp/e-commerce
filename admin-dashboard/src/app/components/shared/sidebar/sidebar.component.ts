import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen = true;
  
  navItems: NavItem[] = [
    { label: 'Products', icon: 'products', route: '/products', active: false },
    { label: 'Orders', icon: 'orders', route: '/orders', active: false }
  ];
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveNavItem();
    });
    
    // Set initial active state
    this.updateActiveNavItem();
  }
  
  private updateActiveNavItem(): void {
    const url = this.router.url;
    this.navItems.forEach(item => {
      item.active = url.startsWith(item.route);
    });
  }
}