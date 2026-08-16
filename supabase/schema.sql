-- ========================================================
-- WEAR YUNG - PHASE 1: COMPLETE DATABASE SCHEMA
-- Handles: Multi-Category Products, Auth Sync, Realtime, RLS & Atomic Stock
-- ========================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE app_role AS ENUM ('customer', 'admin');

CREATE TYPE product_category AS ENUM (
  'clothing', 
  'watches', 
  'perfumes', 
  'accessories', 
  'sneakers', 
  'slides', 
  'bags'
);

CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'failed', 'refunded');

-- 2. USER PROFILES TABLE (Auto-syncs with Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  role app_role DEFAULT 'customer'::app_role,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category product_category NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE (Category attributes stored in JSONB)
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  -- Dynamic Category Attributes JSONB Example:
  -- Clothing: {"size": "XL", "color": "Black"}
  -- Sneakers/Slides: {"size_eu": 42, "size_us": 9, "colorway": "Black/Gold"}
  -- Bags: {"bag_type": "Crossbody", "material": "Leather"}
  -- Watches: {"strap": "Steel", "dial_mm": 40}
  -- Perfumes: {"volume": "100ml", "fragrance_notes": "Woody/Citrus"}
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_email TEXT,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status order_status DEFAULT 'pending'::order_status,
  payment_status payment_status DEFAULT 'unpaid'::payment_status,
  payment_reference TEXT UNIQUE, -- Payment gateway reference (Paystack/Stripe)
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT REVIEWS TABLE
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- REALTIME SUBSCRIPTIONS
-- ========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_variants;

-- 9. USER WISHLISTS TABLE
CREATE TABLE public.user_wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wishlists ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'admin@wearyung.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'::app_role
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================
-- SECURITY POLICIES FOR USER WISHLISTS
-- ========================================================
CREATE POLICY "Users can view their own wishlists" ON public.user_wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlists" ON public.user_wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlists" ON public.user_wishlists
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view published products" ON public.products
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can write products" ON public.products
  FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view product variants" ON public.product_variants
  FOR SELECT USING (true);

CREATE POLICY "Admins can write variants" ON public.product_variants
  FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Anyone can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view reviews" ON public.product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert reviews" ON public.product_reviews
  FOR INSERT WITH CHECK (true);

-- ========================================================
-- TRIGGERS & ATOMIC FUNCTIONS
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    'customer'::app_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.decrement_stock(
  variant_id UUID, 
  qty INT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_stock INT;
BEGIN
  SELECT stock_quantity INTO v_current_stock 
  FROM public.product_variants 
  WHERE id = variant_id FOR UPDATE;

  IF v_current_stock >= qty THEN
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - qty,
        updated_at = NOW()
    WHERE id = variant_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
