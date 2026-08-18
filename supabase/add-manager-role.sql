-- ========================================================
-- WEAR YUNG: Add Manager Role & Robust Staff Permissions
-- 
-- Instructions:
-- Run this in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/atjpjuwwmlymsdkahqts/sql)
-- ========================================================

-- 1. Add manager role to enum & ensure text compatibility
DO $$
BEGIN
  BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
  END;
END $$;

-- 2. Ensure profiles table column accepts 'manager' without enum constraint errors
DO $$
BEGIN
  ALTER TABLE public.profiles ALTER COLUMN role TYPE TEXT;
  ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- 3. Create helper function to check staff access (Admin or Manager)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'wearyungworldwide@gmail.com'
    OR (auth.jwt() ->> 'email') = 'wearyungworldwide@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Allow staff (Admins and Managers) to manage products and product variants
DROP POLICY IF EXISTS "Staff can write products" ON public.products;
CREATE POLICY "Staff can write products" ON public.products
  FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Staff can write variants" ON public.product_variants;
CREATE POLICY "Staff can write variants" ON public.product_variants
  FOR ALL USING (public.is_staff());

-- 5. Allow staff to view & update orders
DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
CREATE POLICY "Staff can view all orders" ON public.orders
  FOR SELECT USING (public.is_staff());

DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders
  FOR UPDATE USING (public.is_staff());
