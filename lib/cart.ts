'use client';

import { useSyncExternalStore } from 'react';
import type { Cart, CartItem } from '@/types/ecommerce';

const CART_KEY = 'wy-cart';
const emptyCart: Cart = { items: [], total: 0, itemCount: 0 };

function parseCart(raw: string | null): Cart {
  if (!raw) return emptyCart;
  try {
    const data = JSON.parse(raw);
    const items: CartItem[] = data.items ?? [];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, total, itemCount };
  } catch {
    return emptyCart;
  }
}

let cachedCartString: string | null = null;
let cachedCart: Cart = emptyCart;

function getSnapshot(): Cart {
  if (typeof window === 'undefined') return emptyCart;
  const raw = localStorage.getItem(CART_KEY);
  if (raw !== cachedCartString) {
    cachedCartString = raw;
    cachedCart = parseCart(raw);
  }
  return cachedCart;
}

function getServerSnapshot(): Cart {
  return emptyCart;
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

export function useCart(): Cart {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addToCart(item: CartItem): void {
  if (typeof window === 'undefined') return;
  const current = getSnapshot();
  const existingIndex = current.items.findIndex(i => i.variantId === item.variantId);
  const newItems = [...current.items];

  if (existingIndex >= 0) {
    newItems[existingIndex] = {
      ...newItems[existingIndex],
      quantity: newItems[existingIndex].quantity + item.quantity,
    };
  } else {
    newItems.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify({ items: newItems }));
  emitChange();
}

export function updateCartQuantity(variantId: string, quantity: number): void {
  if (typeof window === 'undefined') return;
  const current = getSnapshot();
  const newItems = quantity <= 0
    ? current.items.filter(i => i.variantId !== variantId)
    : current.items.map(i => (i.variantId === variantId ? { ...i, quantity } : i));

  localStorage.setItem(CART_KEY, JSON.stringify({ items: newItems }));
  emitChange();
}

export function removeCartItem(variantId: string): void {
  updateCartQuantity(variantId, 0);
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
  emitChange();
}
