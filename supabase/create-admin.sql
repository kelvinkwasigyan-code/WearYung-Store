-- ========================================================
-- WEAR YUNG: Set wearyungworldwide@gmail.com as Sole Admin & Revoke Old Admin
-- 
-- Instructions:
-- Run this script in your Supabase Dashboard > SQL Editor
-- (https://supabase.com/dashboard/project/atjpjuwwmlymsdkahqts/sql)
-- ========================================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Demote any old admin account(s)
UPDATE public.profiles
SET role = 'customer'
WHERE id IN (
  SELECT id FROM auth.users WHERE LOWER(email) = 'admin@wearyung.com'
);

-- 2. Insert or Update wearyungworldwide@gmail.com in auth.users with password Admin@123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'wearyungworldwide@gmail.com',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"WEAR YUNG Admin","role":"admin"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO UPDATE
SET 
  encrypted_password = crypt('Admin@123', gen_salt('bf')),
  email_confirmed_at = now(),
  raw_user_meta_data = '{"full_name":"WEAR YUNG Admin","role":"admin"}'::jsonb,
  updated_at = now();

-- 3. Insert or update identity in auth.identities (required by Supabase Auth v2)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  id,
  id,
  json_build_object('sub', id::text, 'email', email),
  'email',
  email,
  now(),
  now(),
  now()
FROM auth.users
WHERE LOWER(email) = 'wearyungworldwide@gmail.com'
ON CONFLICT (provider, provider_id) DO NOTHING;

-- 4. Ensure profile has admin role for wearyungworldwide@gmail.com
INSERT INTO public.profiles (id, role, full_name, phone_number)
SELECT id, 'admin', 'WEAR YUNG Admin', '+233 55 000 0000'
FROM auth.users
WHERE LOWER(email) = 'wearyungworldwide@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', full_name = 'WEAR YUNG Admin';
