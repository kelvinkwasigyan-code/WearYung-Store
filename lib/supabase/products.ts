import { createClient } from '@/lib/supabase/server';
import type { Product, ProductVariant, ProductReview } from '@/types/ecommerce';

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
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
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
    return null;
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
