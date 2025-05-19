'use client';

// Order API functions - Integration with order microservice

// API URL
const API_URL = 'http://api.phoneaccessories.local/api';

// Types for order operations
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

/**
 * Create a new order (checkout process)
 */
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to create an order');
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const data = await response.json();
    return data.data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get all orders for the current user
 */
export async function getUserOrders(): Promise<Order[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to view your orders');
    }

    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch orders');
    }

    const data = await response.json();
    return data.data.orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to view order details');
    }

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch order details');
    }

    const data = await response.json();
    return data.data.order;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to cancel an order');
    }

    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel order');
    }

    const data = await response.json();
    return data.data.order;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}

/**
 * Admin: Get all orders (admin only)
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in as admin to view all orders');
    }

    const response = await fetch(`${API_URL}/orders/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch all orders');
    }

    const data = await response.json();
    return data.data.orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
}

/**
 * Admin: Update order status (admin only)
 */
export async function updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<Order> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in as admin to update order status');
    }

    const response = await fetch(`${API_URL}/orders/admin/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update order status');
    }

    const data = await response.json();
    return data.data.order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
