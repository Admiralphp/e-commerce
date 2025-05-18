'use client';

import { CartItem } from '@/context/cart-context';

// API URL
const API_URL = 'http://api.phoneaccessories.local/api';

// Cart API functions
export async function saveCartToServer(userId: string, items: CartItem[]): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, items }),
    });

    if (!response.ok) {
      throw new Error('Failed to save cart');
    }
  } catch (error) {
    console.error('Error saving cart to server:', error);
    // Just log the error but don't throw - we still have local cart data
  }
}

export async function fetchCartFromServer(userId: string): Promise<CartItem[]> {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    const data = await response.json();
    return data.data.cart.items || [];
  } catch (error) {
    console.error('Error fetching cart from server:', error);
    // Return empty array to fallback to local storage
    return [];
  }
}

export async function clearCartOnServer(userId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart on server:', error);
    // Just log the error but don't throw
  }
}

export async function addToCartOnServer(userId: string, item: CartItem): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: item.id,
        quantity: item.quantity
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
  } catch (error) {
    console.error('Error adding item to cart on server:', error);
    // Just log the error but don't throw
  }
}

export async function removeFromCartOnServer(userId: string, itemId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
  } catch (error) {
    console.error('Error removing item from cart on server:', error);
    // Just log the error but don't throw
  }
}

export async function updateCartItemQuantityOnServer(userId: string, itemId: string, quantity: number): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update item quantity');
    }
  } catch (error) {
    console.error('Error updating item quantity on server:', error);
    // Just log the error but don't throw
  }
}
