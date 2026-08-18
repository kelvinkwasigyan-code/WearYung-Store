-- ========================================================
-- WEAR YUNG: Backfill & Sync All Existing Customers to Profiles
-- 
-- Instructions:
-- Run this script in your Supabase Dashboard > SQL Editor
-- (https://supabase.com/dashboard/project/atjpjuwwmlymsdkahqts/sql)
-- ========================================================

-- 1. Ensure public.profiles has email column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Backfill profiles from auth.users (all registered users)
INSERT INTO public.profiles (id, email, full_name, phone_number, role, created_at)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Customer'),
  COALESCE(u.raw_user_meta_data->>'phone_number', ''),
  CASE 
    WHEN LOWER(u.email) = 'wearyungworldwide@gmail.com' THEN 'admin'::app_role
    ELSE 'customer'::app_role
  END,
  u.created_at
FROM auth.users u
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  full_name = CASE 
    WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = '' OR public.profiles.full_name = 'Anonymous User' OR public.profiles.full_name = 'Customer'
    THEN EXCLUDED.full_name
    ELSE public.profiles.full_name
  END,
  phone_number = CASE 
    WHEN public.profiles.phone_number IS NULL OR public.profiles.phone_number = ''
    THEN EXCLUDED.phone_number
    ELSE public.profiles.phone_number
  END,
  role = CASE 
    WHEN LOWER(EXCLUDED.email) = 'wearyungworldwide@gmail.com' THEN 'admin'::app_role
    ELSE public.profiles.role
  END;

-- 3. Sync customer names & phones from order history into profiles where available
UPDATE public.profiles p
SET 
  full_name = COALESCE(NULLIF(p.full_name, ''), NULLIF(o.customer_name, ''), p.full_name),
  phone_number = COALESCE(NULLIF(p.phone_number, ''), NULLIF(o.customer_phone, ''), p.phone_number)
FROM (
  SELECT DISTINCT ON (user_id) 
    user_id, customer_name, customer_phone 
  FROM public.orders 
  WHERE user_id IS NOT NULL 
  ORDER BY user_id, created_at DESC
) o
WHERE p.id = o.user_id;

-- 4. Verify trigger is up to date for all future registrations
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
      WHEN LOWER(new.email) = 'wearyungworldwide@gmail.com' THEN 'admin'::app_role
      ELSE 'customer'::app_role
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
