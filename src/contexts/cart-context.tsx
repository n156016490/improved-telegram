"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ToyData } from '@/lib/toys-data';

export interface CartItem {
  toy: ToyData;
  duration: string;
  startDate: string;
  startTime: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (toy: ToyData, duration: string, startDate: string, startTime: string) => void;
  removeFromCart: (toyId: number) => void;
  updateQuantity: (toyId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('louaab-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('louaab-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (toy: ToyData, duration: string, startDate: string, startTime: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.toy.id === toy.id);
      
      if (existingItem) {
        // Mettre à jour l'item existant
        return prevItems.map(item =>
          item.toy.id === toy.id
            ? { ...item, duration, startDate, startTime, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Ajouter un nouvel item
        return [...prevItems, { toy, duration, startDate, startTime, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (toyId: number) => {
    setItems(prevItems => prevItems.filter(item => item.toy.id !== toyId));
  };

  const updateQuantity = (toyId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(toyId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.toy.id === toyId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const basePrice = parseFloat(item.toy.price?.replace(/[^\d.]/g, '') || '0');
      const durationMultiplier = parseFloat(item.duration);
      const itemTotal = basePrice * durationMultiplier * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
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
