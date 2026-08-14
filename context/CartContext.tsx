'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useSyncExternalStore } from 'react';
import type { CartItem } from '@/types/ecommerce';

const CART_STORAGE_KEY = 'wy-cart';
const emptyItems: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = emptyItems;

function getSnapshot(): CartItem[] {
  if (typeof window === 'undefined') return emptyItems;
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    if (!raw) {
      cachedItems = emptyItems;
    } else {
      try {
        const parsed = JSON.parse(raw);
        cachedItems = Array.isArray(parsed.items) ? parsed.items : emptyItems;
      } catch {
        cachedItems = emptyItems;
      }
    }
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return emptyItems;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('wy-cart-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('wy-cart-change', callback);
  };
}

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wy-cart-change'));
  }
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addToCart = useCallback((newItem: CartItem) => {
    const current = getSnapshot();
    const existingIndex = current.findIndex((i) => i.variantId === newItem.variantId);
    let updated: CartItem[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + newItem.quantity,
      };
    } else {
      updated = [...current, newItem];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: updated }));
      emitChange();
    }
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((variantId: string) => {
    const current = getSnapshot();
    const updated = current.filter((i) => i.variantId !== variantId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: updated }));
      emitChange();
    }
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    const current = getSnapshot();
    let updated: CartItem[];
    if (quantity <= 0) {
      updated = current.filter((i) => i.variantId !== variantId);
    } else {
      updated = current.map((i) => (i.variantId === variantId ? { ...i, quantity } : i));
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: updated }));
      emitChange();
    }
  }, []);

  const clearCart = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
      emitChange();
    }
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      total,
      itemCount,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      total,
      itemCount,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}

export const useCart = useCartContext;
