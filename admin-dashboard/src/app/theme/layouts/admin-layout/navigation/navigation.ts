export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'products',
    title: 'Products',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'product-list',
        title: 'Product List',
        type: 'item',
        classes: 'nav-item',
        url: '/products/list',
        icon: 'shopping-cart',
        breadcrumbs: false
      },
      {
        id: 'product-add',
        title: 'Add Product',
        type: 'item',
        classes: 'nav-item',
        url: '/products/add',
        icon: 'plus-circle',
        breadcrumbs: false
      },
      {
        id: 'product-categories',
        title: 'Categories',
        type: 'item',
        classes: 'nav-item',
        url: '/products/categories',
        icon: 'tag',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'orders',
    title: 'Orders',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'order-list',
        title: 'Order List',
        type: 'item',
        classes: 'nav-item',
        url: '/orders/list',
        icon: 'shopping',
        breadcrumbs: false
      },
      {
        id: 'order-details',
        title: 'Order Analytics',
        type: 'item',
        classes: 'nav-item',
        url: '/orders/analytics',
        icon: 'bar-chart',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'users',
    title: 'Users',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'user-list',
        title: 'User List',
        type: 'item',
        classes: 'nav-item',
        url: '/users/list',
        icon: 'user',
        breadcrumbs: false
      },
      {
        id: 'user-roles',
        title: 'User Roles',
        type: 'item',
        classes: 'nav-item',
        url: '/users/roles',
        icon: 'lock',
        breadcrumbs: false
      }
    ]
  },
];
