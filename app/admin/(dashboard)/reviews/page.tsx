'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isAdminEmail } from '@/lib/constants';
import { Star, Trash2, Loader2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && !isAdminEmail(user.email)) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (profile?.role === 'manager') {
        router.replace('/admin/products');
        return;
      }
    }

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
          size={14}
          fill={i <= rating ? '#FFC800' : 'none'}
          color={i <= rating ? '#FFC800' : '#3F3F46'}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#FFFFFF', letterSpacing: '0.04em' }}>
          REVIEWS
        </h1>
        <p style={{ color: '#A1A1AA', fontSize: '0.875rem' }}>{reviews.length} customer reviews total</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#A1A1AA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#FFC800' }} />
            <span>Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{
            background: '#0d0d0d', border: '1px solid #27272A', borderRadius: '12px',
            padding: '3rem', textAlign: 'center', color: '#A1A1AA',
          }}>
            <Star size={36} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>No customer reviews yet.</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} style={{
              background: '#0d0d0d',
              border: '1px solid #27272A',
              borderRadius: '12px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.92rem' }}>
                    {review.author_name}
                  </span>
                  <StarRating rating={review.rating} />
                  <span style={{
                    padding: '0.2rem 0.55rem',
                    background: '#18181B',
                    borderRadius: '6px',
                    border: '1px solid #27272A',
                    fontSize: '0.72rem',
                    color: '#FFC800',
                    fontWeight: 700,
                  }}>
                    {review.products?.title || 'Unknown Product'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#D4D4D8', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  {review.comment}
                </p>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                title="Delete review"
                style={{
                  background: '#18181B',
                  border: '1px solid #27272A',
                  borderRadius: '6px',
                  padding: '0.45rem 0.65rem',
                  cursor: 'pointer',
                  color: '#EF4444',
                  flexShrink: 0,
                  transition: 'background 0.15s',
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
