'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';
import type { ProductReview } from '@/types/ecommerce';

interface ProductReviewsProps {
  productId: string;
}

import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setIsLoading(false);
  }, [productId, supabase]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    setIsSubmitting(true);
    
    const { error } = await supabase.from('product_reviews').insert({
      product_id: productId,
      author_name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment
    });

    if (!error) {
      setNewReview({ name: '', comment: '', rating: 5 });
      fetchReviews();
    } else {
      console.error('Error submitting review:', error);
    }
    
    setIsSubmitting(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="mt-16 border-t border-zinc-800 pt-10">
      <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-8">
        Customer Reviews
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Col: Aggregated Rating & Write a Review */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl bg-[#141416] border border-zinc-800 p-6 flex flex-col items-center justify-center text-center">
            <span className="font-display text-5xl text-[#FFC800] tracking-wide mb-2">
              {averageRating}
            </span>
            <div className="flex items-center justify-center gap-1 mb-2 text-[#FFC800]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(Number(averageRating)) ? 'currentColor' : 'none'}
                  className={star <= Math.round(Number(averageRating)) ? 'text-[#FFC800]' : 'text-zinc-600'}
                />
              ))}
            </div>
            <span className="text-sm text-zinc-400">Based on {reviews.length} reviews</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-[#141416] border border-zinc-800 p-5 rounded-2xl">
            <h4 className="font-display text-lg tracking-wide text-white uppercase mb-2">Write a Review</h4>
            
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    fill={star <= newReview.rating ? 'currentColor' : 'none'}
                    className={star <= newReview.rating ? 'text-[#FFC800]' : 'text-zinc-600'}
                  />
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              className="w-full bg-[#0D0D0D] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC800] transition-colors"
              required
            />
            
            <textarea
              placeholder="Share your thoughts about this drop..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
              className="w-full bg-[#0D0D0D] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFC800] transition-colors resize-none"
              required
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-[#FFC800] text-black font-display font-bold text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Right Col: Reviews List */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {isLoading ? (
          <div className="py-8 text-center text-zinc-500 font-display">Loading reviews...</div>
        ) : reviews.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-500">No reviews yet. Be the first to review this drop!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-5 bg-[#141416] border border-zinc-800 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <User size={18} />
                    </div>
                    <div>
                      <h5 className="text-white font-medium text-sm">{review.author_name}</h5>
                      <span className="text-xs text-zinc-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#FFC800]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        className={i < review.rating ? 'text-[#FFC800]' : 'text-zinc-700'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mt-1">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
