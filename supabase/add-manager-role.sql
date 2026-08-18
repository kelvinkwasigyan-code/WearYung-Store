-- ========================================================
-- WEAR YUNG: Add Manager Role to Database
-- 
-- Instructions:
-- Run this in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/atjpjuwwmlymsdkahqts/sql)
-- ========================================================

-- 1. Add manager role to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';

-- 2. Create helper function to check staff access (Admin or Manager)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'wearyungworldwide@gmail.com'
    OR (auth.jwt() ->> 'email') = 'wearyungworldwide@gmail.com'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin'::app_role OR role = 'manager'::app_role)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Allow staff (Admins and Managers) to manage products and product variants
DROP POLICY IF EXISTS "Staff can write products" ON public.products;
CREATE POLICY "Staff can write products" ON public.products
  FOR ALL USING (public.is_staff());

DROP POLICY IF EXISTS "Staff can write variants" ON public.product_variants;
CREATE POLICY "Staff can write variants" ON public.product_variants
  FOR ALL USING (public.is_staff());

-- 4. Allow staff to view orders
DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
CREATE POLICY "Staff can view all orders" ON public.orders
  FOR SELECT USING (public.is_staff());

DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders
  FOR UPDATE USING (public.is_staff());
