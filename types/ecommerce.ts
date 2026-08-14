// =============================================================
// WEAR YUNG - E-Commerce Type Definitions
// Generated from Phase 1 Supabase Schema
// =============================================================

// ---- Enums ----
export type AppRole = 'customer' | 'admin';

export type ProductCategory =
  | 'clothing'
  | 'watches'
  | 'sprays'
  | 'accessories'
  | 'sneakers'
  | 'slides'
  | 'bags';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

// ---- Database Tables ----
export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  address: ShippingAddress;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  description: string | null;
  images: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined relation
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  stock_quantity: number;
  attributes: VariantAttributes;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  // Joined relation
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  created_at: string;
  // Joined relations
  variant?: ProductVariant & { product?: Product };
}

// ---- Variant Attribute Shapes ----
export interface ClothingAttributes {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
  color: string;
}

export interface FootwearAttributes {
  size_eu: number;
  size_us?: number;
  colorway: string;
}

export interface BagAttributes {
  bag_type: string;
  material: string;
  color?: string;
}

export interface WatchAttributes {
  strap: string;
  dial_mm: number;
  colorway?: string;
}

export interface SprayAttributes {
  volume: string;
  fragrance_notes: string;
}

export interface AccessoryAttributes {
  color?: string;
  material?: string;
  size?: string;
}

export type VariantAttributes =
  | ClothingAttributes
  | FootwearAttributes
  | BagAttributes
  | WatchAttributes
  | SprayAttributes
  | AccessoryAttributes
  | Record<string, unknown>;

// ---- Shipping / Address ----
export interface ShippingAddress {
  full_name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
}

// ---- Cart ----
export interface CartItem {
  variantId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  attributes: VariantAttributes;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ---- Checkout ----
export interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
  address: ShippingAddress;
}

// ---- API / Action Responses ----
export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---- Category Display Helpers ----
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  clothing: 'Clothing',
  watches: 'Watches',
  sprays: 'Sprays',
  accessories: 'Accessories',
  sneakers: 'Sneakers',
  slides: 'Slides',
  bags: 'Bags',
};

export const ALL_CATEGORIES: ProductCategory[] = [
  'clothing',
  'watches',
  'sprays',
  'accessories',
  'sneakers',
  'slides',
  'bags',
];
