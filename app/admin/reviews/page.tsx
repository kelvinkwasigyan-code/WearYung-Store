'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('product_reviews')
      .select('*, products(title)')
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    await supabase.from('product_reviews').delete().eq('id', id);
    fetchReviews();
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={13}
          fill={i <= rating ? '#FFC800' : 'none'}
          color={i <= rating ? '#FFC800' : '#333'}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#fff', letterSpacing: '0.04em' }}>
          REVIEWS
        </h1>
        <p style={{ color: '#555', fontSize: '0.875rem' }}>{reviews.length} reviews total</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>Loading...</div>
        ) : reviews.length === 0 ? (
          <div style={{
            background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px',
            padding: '3rem', textAlign: 'center', color: '#444',
          }}>
            <Star size={36} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <p>No reviews yet</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} style={{
              background: '#0d0d0d',
              border: '1px solid #1a1a1a',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: '#e0e0e0', fontSize: '0.9rem' }}>
                    {review.author_name}
                  </span>
                  <StarRating rating={review.rating} />
                  <span style={{
                    padding: '0.15rem 0.5rem',
                    background: '#1a1a1a',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    color: '#FFC800',
                  }}>
                    {review.products?.title || 'Unknown Product'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#444' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {review.comment}
                </p>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                title="Delete review"
                style={{
                  background: '#1a1a1a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.6rem',
                  cursor: 'pointer',
                  color: '#ef4444',
                  flexShrink: 0,
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
