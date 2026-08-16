-- ========================================================
-- WEAR YUNG - Lookbook Database Setup
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ========================================================

-- 1. Create lookbooks table
CREATE TABLE IF NOT EXISTS public.lookbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  season TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL CHECK (aspect_ratio IN ('tall', 'wide', 'square')),
  description TEXT,
  tagged_items JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.lookbooks ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
DROP POLICY IF EXISTS "Anyone can view published lookbooks" ON public.lookbooks;
CREATE POLICY "Anyone can view published lookbooks"
  ON public.lookbooks
  FOR SELECT
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage lookbooks" ON public.lookbooks;
CREATE POLICY "Admins can manage lookbooks"
  ON public.lookbooks
  FOR ALL
  USING (public.is_admin());

-- 4. Initial Seed Data (Optional - just to have something to see)
INSERT INTO public.lookbooks (title, season, category, image_url, aspect_ratio, description, tagged_items, is_published)
VALUES 
(
  'THE NOIR MATRIX',
  'VOL. 01 — DROP 04',
  'STREETWEAR & WATCHES',
  'https://images.unsplash.com/photo-1550614000-4b95dd247594?auto=format&fit=crop&w=1000&q=80',
  'tall',
  'Heavyweight silhouette paired with metallic contrast accents for cold city nights.',
  '[{"name": "Pitch Black Heavyweight Hoodie", "price": "GH₵ 45,000", "category": "clothing", "slug": "heavyweight-oversized-hoodie"}, {"name": "Aura Gold Chrono Watch", "price": "GH₵ 120,000", "category": "watches", "slug": "luxury-chrono-watch"}]'::jsonb,
  true
),
(
  'URBAN MINIMALIST',
  'VOL. 01 — DROP 03',
  'TAILORED ESSENTIALS',
  'https://images.unsplash.com/photo-1523398002811-999aa8e9ddaa?auto=format&fit=crop&w=1000&q=80',
  'square',
  'Deconstructed modern tailoring styled with luxury horology.',
  '[{"name": "Oversized Raw Edge Blazer", "price": "GH₵ 78,000", "category": "clothing", "slug": "clothing"}, {"name": "Obsidian Diver Automatic", "price": "GH₵ 165,000", "category": "watches", "slug": "watches"}]'::jsonb,
  true
),
(
  'NEO-STREET COMFORT',
  'VOL. 01 — DROP 02',
  'FOOTWEAR & BAGS',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
  'wide',
  'Aggressive runner sole profile balanced with utilitarian leather crossbody bag.',
  '[{"name": "Vortex Runner V2 Triple White", "price": "GH₵ 85,000", "category": "sneakers", "slug": "sneakers"}, {"name": "Tactical Leather Crossbody Bag", "price": "GH₵ 42,000", "category": "bags", "slug": "bags"}]'::jsonb,
  true
)
ON CONFLICT DO NOTHING;
