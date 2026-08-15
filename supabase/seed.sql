-- ========================================================
-- WEAR YUNG - SEED DATA
-- Run this script in your Supabase SQL Editor to populate 
-- your live database with initial mock products and variants.
-- ========================================================

-- Clear existing data if necessary (Optional, comment out if you want to keep existing)
-- DELETE FROM public.product_reviews;
-- DELETE FROM public.product_variants;
-- DELETE FROM public.products;

-- 1. Insert Products
INSERT INTO public.products (id, title, slug, category, description, images, is_published)
VALUES 
  ('a1b2c3d4-0000-0000-0000-111111111111', 'Heavyweight Oversized Hoodie', 'heavyweight-oversized-hoodie', 'clothing', 'The ultimate streetwear staple. 450GSM organic cotton with a boxy fit.', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80'], true),
  ('a1b2c3d4-0000-0000-0000-222222222222', 'Cargo Utility Pants', 'cargo-utility-pants', 'clothing', 'Tactical design meets everyday comfort. Multiple secure pockets.', ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'], true),
  ('a1b2c3d4-0000-0000-0000-333333333333', 'Luxury Chrono Watch', 'luxury-chrono-watch', 'watches', 'Precision movement with a sapphire crystal face and steel band.', ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=80'], true),
  ('a1b2c3d4-0000-0000-0000-444444444444', 'Street Runner Sneakers', 'street-runner-sneakers', 'sneakers', 'Breathable mesh and responsive cushioning for all-day city walking.', ARRAY['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'], true),
  ('a1b2c3d4-0000-0000-0000-555555555555', 'Graphic Acid-Wash Tee', 'graphic-acid-wash-tee', 'clothing', 'Vintage wash with bold contrasting graphics.', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'], true),
  ('a1b2c3d4-0000-0000-0000-666666666666', 'Crossbody Sling Bag', 'crossbody-sling-bag', 'bags', 'Keep your essentials close and secure.', ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'], true);

-- 2. Insert Variants (Link to products via product_id)
INSERT INTO public.product_variants (product_id, sku, price, stock_quantity, attributes)
VALUES 
  ('a1b2c3d4-0000-0000-0000-111111111111', 'HOODIE-BLK-L', 750.00, 50, '{"size": "L", "color": "Black"}'::jsonb),
  ('a1b2c3d4-0000-0000-0000-222222222222', 'CARGO-OLV-M', 600.00, 30, '{"size": "M", "color": "Olive"}'::jsonb),
  ('a1b2c3d4-0000-0000-0000-333333333333', 'WATCH-SLV-42', 2500.00, 15, '{"strap": "Steel", "dial_mm": 42}'::jsonb),
  ('a1b2c3d4-0000-0000-0000-444444444444', 'SNEAK-WHT-43', 1200.00, 45, '{"size_eu": 43, "colorway": "White/Grey"}'::jsonb),
  ('a1b2c3d4-0000-0000-0000-555555555555', 'TEE-ACD-M', 350.00, 100, '{"size": "M", "color": "Acid Grey"}'::jsonb),
  ('a1b2c3d4-0000-0000-0000-666666666666', 'BAG-BLK-OS', 450.00, 80, '{"bag_type": "Sling", "material": "Nylon"}'::jsonb);

-- 3. Insert Mock Reviews
INSERT INTO public.product_reviews (product_id, author_name, rating, comment)
VALUES
  ('a1b2c3d4-0000-0000-0000-111111111111', 'David O.', 5, 'The quality on this is insane. Fits perfectly and the material feels super premium. Definitely coming back for more drops.'),
  ('a1b2c3d4-0000-0000-0000-111111111111', 'Sarah M.', 4, 'Really love the design. Shipping was fast. Deducted one star just because I wish it came in more colorways!'),
  ('a1b2c3d4-0000-0000-0000-333333333333', 'Kwame A.', 5, 'Absolutely stunning watch. Keeps perfect time and gets compliments everywhere I go.');
