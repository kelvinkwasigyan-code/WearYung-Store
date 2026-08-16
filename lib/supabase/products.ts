import { createClient } from '@/lib/supabase/server';
import type { Product, ProductVariant, ProductReview } from '@/types/ecommerce';

export const FALLBACK_PRODUCTS: Product[] = [
  // --- CLOTHING: HOODIES ---
  {
    id: 'a1b2c3d4-0000-0000-0000-111111111111',
    title: 'Heavyweight Oversized Hoodie',
    slug: 'heavyweight-oversized-hoodie',
    category: 'clothing',
    description: 'The ultimate streetwear staple. 450GSM organic French terry cotton with a relaxed boxy fit and double-layered hood.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.8,
    review_count: 14,
    variants: [
      {
        id: 'var-1',
        product_id: 'a1b2c3d4-0000-0000-0000-111111111111',
        sku: 'HOODIE-BLK-L',
        price: 750.00,
        stock_quantity: 50,
        attributes: { size: 'L', color: 'Midnight Black', clothing_type: 'hoodie' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-111111111112',
    title: 'Washed Boxy Zip Hoodie',
    slug: 'washed-boxy-zip-hoodie',
    category: 'clothing',
    description: 'Sun-faded vintage treatment with heavy two-way custom silver zipper and dropped armholes.',
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.9,
    review_count: 9,
    variants: [
      {
        id: 'var-1b',
        product_id: 'a1b2c3d4-0000-0000-0000-111111111112',
        sku: 'ZIP-WASH-M',
        price: 820.00,
        stock_quantity: 35,
        attributes: { size: 'M', color: 'Vintage Charcoal', clothing_type: 'hoodie' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },

  // --- CLOTHING: JEANS & PANTS ---
  {
    id: 'a1b2c3d4-0000-0000-0000-222222222222',
    title: 'Slim Stretch Cargo Combat Pants',
    slug: 'slim-stretch-cargo-pants',
    category: 'clothing',
    description: 'Tapered slim fit cargo trousers featuring tactical utility pockets, reinforced knee panels, and adjustable ankle cuffs.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.8,
    review_count: 14,
    variants: [
      {
        id: 'var-2',
        product_id: 'a1b2c3d4-0000-0000-0000-222222222222',
        sku: 'CARGO-OLV-M',
        price: 600.00,
        stock_quantity: 30,
        attributes: { size: 'M', color: 'Military Olive', clothing_type: 'jeans_pants', fit: 'slim' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-222222222223',
    title: 'Baggy Raw Denim Skater Jeans',
    slug: 'baggy-raw-denim-jeans',
    category: 'clothing',
    description: '14oz rigid Japanese selvedge denim. Loose relaxed cut with heavy contrast gold stitching.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 5.0,
    review_count: 11,
    variants: [
      {
        id: 'var-2b',
        product_id: 'a1b2c3d4-0000-0000-0000-222222222223',
        sku: 'DENIM-RAW-32',
        price: 680.00,
        stock_quantity: 40,
        attributes: { size: '32', color: 'Indigo Raw', clothing_type: 'jeans_pants', fit: 'baggy' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },

  // --- CLOTHING: TOPS & SLEEVES ---
  {
    id: 'a1b2c3d4-0000-0000-0000-555555555555',
    title: 'Graphic Acid-Wash Vintage Tee',
    slug: 'graphic-acid-wash-tee',
    category: 'clothing',
    description: 'Custom mineral wash with high-density distressed screen-printed graphics. 240GSM heavyweight jersey.',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.6,
    review_count: 6,
    variants: [
      {
        id: 'var-5',
        product_id: 'a1b2c3d4-0000-0000-0000-555555555555',
        sku: 'TEE-ACD-M',
        price: 350.00,
        stock_quantity: 100,
        attributes: { size: 'M', color: 'Charcoal Acid', clothing_type: 'tops_sleeves', sleeve_type: 'tops' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-555555555556',
    title: 'Heavyweight Long Sleeve Waffle Shirt',
    slug: 'heavyweight-long-sleeve-waffle-shirt',
    category: 'clothing',
    description: 'Thermal textured 320GSM long sleeve shirt featuring ribbed cuffs and a relaxed streetwear silhouette.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.9,
    review_count: 18,
    variants: [
      {
        id: 'var-5b',
        product_id: 'a1b2c3d4-0000-0000-0000-555555555556',
        sku: 'SLV-WHT-L',
        price: 420.00,
        stock_quantity: 75,
        attributes: { size: 'L', color: 'Chalk White', clothing_type: 'tops_sleeves', sleeve_type: 'sleeves' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },

  // --- ACCESSORIES & FOOTWEAR ---
  {
    id: 'a1b2c3d4-0000-0000-0000-333333333333',
    title: 'Luxury Chrono Steel Watch',
    slug: 'luxury-chrono-watch',
    category: 'watches',
    description: 'Precision Japanese automatic movement with a scratch-resistant sapphire crystal face and brushed stainless steel links.',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 5.0,
    review_count: 19,
    variants: [
      {
        id: 'var-3',
        product_id: 'a1b2c3d4-0000-0000-0000-333333333333',
        sku: 'WATCH-SLV-42',
        price: 2500.00,
        stock_quantity: 15,
        attributes: { strap: 'Steel', dial_mm: 42 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-444444444444',
    title: 'Street Runner V2 Sneakers',
    slug: 'street-runner-sneakers',
    category: 'sneakers',
    description: 'Ultra-lightweight mesh and responsive dual-density cushioning engineered for all-day city locomotion.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.7,
    review_count: 12,
    variants: [
      {
        id: 'var-4',
        product_id: 'a1b2c3d4-0000-0000-0000-444444444444',
        sku: 'SNEAK-WHT-43',
        price: 1200.00,
        stock_quantity: 45,
        attributes: { size_eu: 43, colorway: 'Pure White / Wolf Grey' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'a1b2c3d4-0000-0000-0000-666666666666',
    title: 'Crossbody Tactical Sling Bag',
    slug: 'crossbody-sling-bag',
    category: 'bags',
    description: 'Cordura water-resistant nylon with waterproof taped zippers and quick-release magnetic Fidlock buckle.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    average_rating: 4.9,
    review_count: 15,
    variants: [
      {
        id: 'var-6',
        product_id: 'a1b2c3d4-0000-0000-0000-666666666666',
        sku: 'BAG-BLK-OS',
        price: 450.00,
        stock_quantity: 80,
        attributes: { bag_type: 'Sling', material: 'Ballistic Nylon' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  }
];

// Data fetching layer
export async function getProducts(options?: { category?: string, limit?: number }) {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*),
      reviews:product_reviews(rating)
    `)
    .eq('is_published', true);

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    let filtered = FALLBACK_PRODUCTS;
    if (options?.category) {
      filtered = filtered.filter(p => p.category === options.category);
    }
    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }
    return filtered;
  }

  // Transform data to match frontend types
  return data.map((item: any) => {
    const reviews = item.reviews || [];
    const average_rating = reviews.length > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
      : 0;

    return {
      ...item,
      average_rating,
      review_count: reviews.length
    } as Product;
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) {
    const fallback = FALLBACK_PRODUCTS.find(p => p.slug === slug);
    return fallback || null;
  }

  // Get reviews separately for accurate counting/aggregation
  const { data: reviews } = await supabase
    .from('product_reviews')
    .select('rating')
    .eq('product_id', data.id);

  const reviewData = reviews || [];
  const average_rating = reviewData.length > 0
    ? reviewData.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewData.length
    : 0;

  return {
    ...data,
    average_rating,
    review_count: reviewData.length
  } as Product;
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data as ProductReview[];
}
