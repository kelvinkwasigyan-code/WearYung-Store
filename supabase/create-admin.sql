-- ========================================================
-- WEAR YUNG: Create or Promote Admin Account
-- Email: wearyungworldwide@gmail.com
-- Password: Admin@123
-- Run this in your Supabase Dashboard > SQL Editor
-- ========================================================

-- 1. Ensure the user profile has 'admin' role if the account already exists
UPDATE public.profiles
SET role = 'admin', full_name = 'WEAR YUNG Admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE LOWER(email) = 'wearyungworldwide@gmail.com'
);

-- 2. If the user doesn't exist yet in auth.users, you can create them directly via Supabase Dashboard (Authentication > Users > Add user)
-- or execute the function below:
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO new_user_id FROM auth.users WHERE LOWER(email) = 'wearyungworldwide@gmail.com';
  
  IF new_user_id IS NOT NULL THEN
    -- Update existing profile
    INSERT INTO public.profiles (id, role, full_name, phone_number)
    VALUES (new_user_id, 'admin', 'WEAR YUNG Admin', '+233 55 000 0000')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    RAISE NOTICE 'Existing user % updated to admin role.', new_user_id;
  ELSE
    RAISE NOTICE 'User wearyungworldwide@gmail.com does not exist in auth.users yet. Please create it in Supabase Auth Dashboard with password Admin@123 or sign up once.';
  END IF;
END $$;
