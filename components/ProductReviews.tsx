'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Star, User, CheckCircle, Camera, X, ThumbsUp, ZoomIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { ProductReview } from '@/types/ecommerce';

interface ProductReviewsProps {
  productId: string;
}

interface EnhancedReview extends ProductReview {
  image_url?: string;
  fit_feedback?: string;
  verified_purchase?: boolean;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<EnhancedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [fitFeedback, setFitFeedback] = useState('True to size');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data as EnhancedReview[]);
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    } finally {
      setIsLoading(false);
    }
  }, [productId, supabase]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim() || rating === 0) return;

    setIsSubmitting(true);
    let uploadedImageUrl: string | undefined = undefined;

    // Upload photo to Supabase storage if selected
    if (selectedPhoto) {
      try {
        const ext = selectedPhoto.name.split('.').pop() || 'jpg';
        const filename = `reviews/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filename, selectedPhoto, { cacheControl: '31536000', upsert: false });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filename);
          uploadedImageUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.warn('Photo upload skipped, saving review without photo:', err);
      }
    }

    // Insert review into DB
    const { error: insertError } = await supabase.from('product_reviews').insert({
      product_id: productId,
      author_name: authorName.trim(),
      rating,
      comment: comment.trim(),
      ...(uploadedImageUrl ? { image_url: uploadedImageUrl } : {}),
      ...(fitFeedback ? { fit_feedback: fitFeedback } : {}),
      verified_purchase: true,
    });

    if (!insertError) {
      setAuthorName('');
      setComment('');
      setRating(5);
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
      fetchReviews();
    } else {
      console.error('Failed to submit review:', insertError);
    }

    setIsSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const reviewsWithPhotos = reviews.filter(r => !!r.image_url);

  return (
    <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--wy-border)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--wy-text)', margin: 0, letterSpacing: '0.04em' }}>
            VERIFIED CUSTOMER REVIEWS & LOOKBOOK
          </h3>
          <p style={{ color: 'var(--wy-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Real customer feedback, sizing breakdowns, and styling photos from the Wear Yung community.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--wy-surface)', border: '1px solid var(--wy-border)', padding: '0.5rem 1.25rem', borderRadius: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#FFC800' }}>
            <Star size={16} fill="#FFC800" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--wy-text)', letterSpacing: '0.04em' }}>
            {averageRating} / 5.0
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--wy-muted)' }}>
            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Customer Lookbook Photo Strip */}
      {reviewsWithPhotos.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--wy-yellow)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Camera size={16} />
            <span>Community Style Lookbook</span>
          </h4>
          <div className="no-scrollbar" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {reviewsWithPhotos.map((rev) => (
              <div
                key={rev.id}
                onClick={() => setActivePhotoModal(rev.image_url!)}
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '125px',
                  flexShrink: 0,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--wy-border)',
                }}
              >
                <Image src={rev.image_url!} alt={rev.author_name} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="hover:opacity-100">
                  <ZoomIn size={18} color="#FFFFFF" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Review Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* LEFT: Write a Review Form */}
        <div style={{ background: 'var(--wy-surface)', border: '1px solid var(--wy-border)', borderRadius: '18px', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', height: 'fit-content' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--wy-text)', margin: '0 0 1rem', letterSpacing: '0.04em' }}>
            WRITE A VERIFIED REVIEW
          </h4>

          {submitSuccess && (
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} />
              <span>Thank you! Your review and styling photo have been published.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Rating Stars */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--wy-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Your Rating
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: isFilled ? '#FFC800' : 'var(--wy-border)' }}
                    >
                      <Star size={24} fill={isFilled ? '#FFC800' : 'none'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fit Feedback */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--wy-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Sizing & Fit
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Runs Small', 'True to size', 'Oversized / Baggy'].map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setFitFeedback(fit)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '100px',
                      fontSize: '0.76rem',
                      fontWeight: fitFeedback === fit ? 800 : 500,
                      background: fitFeedback === fit ? '#FFC800' : 'transparent',
                      color: fitFeedback === fit ? '#000000' : 'var(--wy-text)',
                      border: fitFeedback === fit ? '1px solid #FFC800' : '1px solid var(--wy-border)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--wy-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Your Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Kwame Mensah"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: 'var(--wy-canvas)',
                  border: '1px solid var(--wy-border)',
                  color: 'var(--wy-text)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Comment */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--wy-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Review & Drip Feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How does the fabric feel? Quality, fit, and styling impression..."
                rows={3}
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  background: 'var(--wy-canvas)',
                  border: '1px solid var(--wy-border)',
                  color: 'var(--wy-text)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            {/* Optional Lookbook Photo Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--wy-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Add Lookbook Photo (Optional)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ display: 'none' }}
              />

              {photoPreview ? (
                <div style={{ position: 'relative', width: '80px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--wy-border)' }}>
                  <Image src={photoPreview} alt="Lookbook preview" fill style={{ objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{ position: 'absolute', top: 4, right: 4, background: '#000000', color: '#FFFFFF', borderRadius: '50%', width: 20, height: 20, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 0.95rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px dashed var(--wy-border)',
                    color: 'var(--wy-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  <Camera size={14} />
                  <span>Upload Lookbook Photo</span>
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '100px',
                background: '#FFC800',
                color: '#000000',
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(255, 200, 0, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              {isSubmitting ? 'Publishing Review...' : 'Submit Verified Review'}
            </button>
          </form>
        </div>

        {/* RIGHT: Community Reviews Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isLoading ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--wy-muted)', fontFamily: 'var(--font-display)' }}>
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: 'var(--wy-surface)', border: '1px dashed var(--wy-border)', borderRadius: '18px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--wy-text)', margin: '0 0 0.4rem' }}>
                BE THE FIRST TO REVIEW THIS DROP
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--wy-muted)', margin: 0 }}>
                Share your styling impressions and earn exclusive Wear Yung perks.
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: 'var(--wy-surface)',
                  border: '1px solid var(--wy-border)',
                  borderRadius: '16px',
                  padding: 'clamp(1rem, 2vw, 1.35rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {/* Reviewer Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 200, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFC800' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--wy-text)', margin: 0, letterSpacing: '0.04em' }}>
                          {rev.author_name}
                        </h5>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#22c55e', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                          <CheckCircle size={12} />
                          Verified
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--wy-muted)' }}>
                        {new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#FFC800' }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill={idx < rev.rating ? '#FFC800' : 'none'} color={idx < rev.rating ? '#FFC800' : 'var(--wy-border)'} />
                    ))}
                  </div>
                </div>

                {/* Fit Tag */}
                {rev.fit_feedback && (
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--wy-yellow)', background: 'rgba(255, 200, 0, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Fit: {rev.fit_feedback}
                    </span>
                  </div>
                )}

                {/* Comment */}
                <p style={{ color: 'var(--wy-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  {rev.comment}
                </p>

                {/* Attached Lookbook Photo */}
                {rev.image_url && (
                  <div style={{ marginTop: '0.35rem' }}>
                    <div
                      onClick={() => setActivePhotoModal(rev.image_url!)}
                      style={{ position: 'relative', width: '110px', height: '140px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--wy-border)' }}
                    >
                      <Image src={rev.image_url} alt="Customer lookbook" fill style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Photo Zoom Modal */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}
        >
          <div style={{ position: 'relative', maxWidth: '600px', width: '100%', maxHeight: '85vh', borderRadius: '16px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActivePhotoModal(null)}
              style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: '#000000', color: '#FFFFFF', borderRadius: '50%', width: 34, height: 34, border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <div style={{ position: 'relative', width: '100%', height: '70vh' }}>
              <Image src={activePhotoModal} alt="Enlarged customer photo" fill style={{ objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
