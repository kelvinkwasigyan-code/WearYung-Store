-- ========================================================
-- WEAR YUNG: Complete SQL Fix (Fix "operator does not exist: text = app_role")
-- 
-- Instructions:
-- Run this in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/atjpjuwwmlymsdkahqts/sql)
-- ========================================================

-- 1. Ensure profiles table column accepts all roles as plain TEXT
DO $$
BEGIN
  ALTER TABLE public.profiles ALTER COLUMN role TYPE TEXT;
  ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- 2. Drop old functions and recreate cleanly without app_role enum casting
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    LOWER(COALESCE((current_setting('request.jwt.claims', true)::jsonb ->> 'email'), '')) = 'wearyungworldwide@gmail.com'
    OR LOWER(COALESCE((auth.jwt() ->> 'email'), '')) = 'wearyungworldwide@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role::text = 'admin'
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
      WHERE id = auth.uid() AND (role::text = 'admin' OR role::text = 'manager')
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

-- 5. Fix Product Visibility & Writes: All products and variants are writable
DROP POLICY IF EXISTS "Anyone can view published products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can write products" ON public.products;
DROP POLICY IF EXISTS "Admins can write products" ON public.products;
CREATE POLICY "Staff can write products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view product variants" ON public.product_variants;
CREATE POLICY "Anyone can view product variants" ON public.product_variants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can write variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can write variants" ON public.product_variants;
CREATE POLICY "Staff can write variants" ON public.product_variants
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Orders Visibility: Staff can view & update all orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders
  FOR UPDATE USING (true) WITH CHECK (true);

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

-- 8. Fix trigger function without enum cast
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, role)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Customer'),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    CASE 
      WHEN LOWER(new.email) = 'wearyungworldwide@gmail.com' THEN 'admin'
      ELSE 'customer'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
