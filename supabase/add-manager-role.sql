-- ========================================================
-- WEAR YUNG: Add Manager Role, Fix Profiles & Product Visibility
-- 
-- Instructions:
-- Run this in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/atjpjuwwmlymsdkahqts/sql)
-- ========================================================

-- 1. Ensure profiles table column accepts 'admin', 'manager', 'customer'
DO $$
BEGIN
  ALTER TABLE public.profiles ALTER COLUMN role TYPE TEXT;
  ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- 2. Create helper function to check admin access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    LOWER(COALESCE((current_setting('request.jwt.claims', true)::jsonb ->> 'email'), '')) = 'wearyungworldwide@gmail.com'
    OR LOWER(COALESCE((auth.jwt() ->> 'email'), '')) = 'wearyungworldwide@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create helper function to check staff access (Admin or Manager)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fix Profile Visibility: Admins can view and manage all customer profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- 5. Fix Product Visibility: All products and variants are visible to staff & storefront
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can write products" ON public.products;
CREATE POLICY "Staff can write products" ON public.products
  FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Anyone can view product variants" ON public.product_variants;
CREATE POLICY "Anyone can view product variants" ON public.product_variants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can write variants" ON public.product_variants;
CREATE POLICY "Staff can write variants" ON public.product_variants
  FOR ALL USING (public.is_staff());

-- 6. Orders Visibility: Staff can view all orders, users can view own
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders
  FOR UPDATE USING (public.is_staff());
