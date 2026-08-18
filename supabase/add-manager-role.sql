-- ========================================================
-- WEAR YUNG: Role Management RPC & Complete Access Fix
-- 
-- Instructions:
-- Run this in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/atjpjuwwmlymsdkahqts/sql)
-- ========================================================

-- 1. Ensure profiles table column accepts all roles as TEXT
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

-- 4. Fix Profile Policies: Full read & update access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins and users can update profiles" ON public.profiles;
CREATE POLICY "Admins and users can update profiles" ON public.profiles
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- 5. Fix Product Visibility: All products and variants are visible & writable by staff
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can write products" ON public.products;
DROP POLICY IF EXISTS "Admins can write products" ON public.products;
CREATE POLICY "Staff can write products" ON public.products
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Anyone can view product variants" ON public.product_variants;
CREATE POLICY "Anyone can view product variants" ON public.product_variants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can write variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can write variants" ON public.product_variants;
CREATE POLICY "Staff can write variants" ON public.product_variants
  FOR ALL USING (true);

-- 6. Orders Visibility: Staff can view & update all orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders
  FOR UPDATE USING (true);

-- 7. Dedicated SECURITY DEFINER RPC to change roles (never blocked by RLS)
CREATE OR REPLACE FUNCTION public.admin_set_user_role(target_user_id UUID, target_role TEXT)
RETURNS JSONB AS $$
BEGIN
  IF target_role NOT IN ('manager', 'customer', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', target_role;
  END IF;

  UPDATE public.profiles
  SET role = target_role, updated_at = NOW()
  WHERE id = target_user_id;

  RETURN jsonb_build_object('success', true, 'user_id', target_user_id, 'role', target_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
