'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  saveCartToServer, 
  fetchCartFromServer, 
  clearCartOnServer,
  addToCartOnServer,
  removeFromCartOnServer,
  updateCartItemQuantityOnServer
} from '@/lib/api/cart';
import { useAuth } from './auth-context';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Initialize cart from server if authenticated, otherwise from local storage
  useEffect(() => {
    async function initializeCart() {
      if (isAuthenticated && user?.id) {
        // Try to get cart from server
        try {
          const serverCart = await fetchCartFromServer(user.id);
          if (serverCart.length > 0) {
            setItems(serverCart);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch cart from server:', error);
        }
      }
      
      // Fall back to local storage if not authenticated or server fetch failed
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage', error);
        }
      }
    }
    
    if (!mounted) {
      initializeCart();
      setMounted(true);
    }
  }, [mounted, isAuthenticated, user]);

  // Update local storage when cart changes
  useEffect(() => {
    if (mounted) {
      // Always update local storage
      localStorage.setItem('cart', JSON.stringify(items));
      
      // Update server if authenticated
      if (isAuthenticated && user?.id) {
        saveCartToServer(user.id, items).catch(error => {
          console.error('Failed to save cart to server:', error);
        });
      }
    }
  }, [items, mounted, isAuthenticated, user]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        };
        
        // Update server if authenticated
        if (isAuthenticated && user?.id) {
          updateCartItemQuantityOnServer(
            user.id, 
            newItem.id, 
            updatedItems[existingItemIndex].quantity
          ).catch(console.error);
        }
        
        return updatedItems;
      } else {
        // Add new item
        if (isAuthenticated && user?.id) {
          addToCartOnServer(user.id, newItem).catch(console.error);
        }
        
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (id: string) => {
    // Remove from state
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    
    // Remove from server if authenticated
    if (isAuthenticated && user?.id) {
      removeFromCartOnServer(user.id, id).catch(console.error);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    
    // Update on server if authenticated
    if (isAuthenticated && user?.id) {
      updateCartItemQuantityOnServer(user.id, id, quantity).catch(console.error);
    }
  };

  const clearCart = () => {
    setItems([]);
    
    // Clear on server if authenticated
    if (isAuthenticated && user?.id) {
      clearCartOnServer(user.id).catch(console.error);
    }
  };

  const totalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}