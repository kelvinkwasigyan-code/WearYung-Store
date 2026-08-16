'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/types/ecommerce';
import { useCartContext } from '@/context/CartContext';

export default function WishlistView() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCartContext();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wy_wishlist');
      if (saved) {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids)) {
          setWishlistIds(ids);
        }
      }
    } catch {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      return;
    }

    const fetchWishlistProducts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, variants:product_variants(*)')
        .in('id', wishlistIds)
        .eq('is_published', true);

      if (!error && data) {
        setProducts(data as Product[]);
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

  const removeFromWishlist = (id: string) => {
    const updated = wishlistIds.filter((item) => item !== id);
    setWishlistIds(updated);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      localStorage.setItem('wy_wishlist', JSON.stringify(updated));
    } catch {}
  };

  const handleQuickAdd = (product: Product) => {
    const variant = product.variants?.[0];
    if (!variant || variant.stock_quantity <= 0) return;

    addToCart({
      variantId: variant.id,
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      productImage: product.images?.[0] ?? '',
      sku: variant.sku,
      price: variant.price,
      quantity: 1,
      attributes: variant.attributes,
    });
  };

  if (isLoading) {
    return (
      <div className="container-wy" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--wy-muted)' }}>Loading your saved wishlist...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: 'var(--wy-canvas)', padding: '2.5rem 1.5rem 5rem' }}>
      <div className="container-wy">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--wy-border)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Heart size={24} className="text-[#FFC800]" fill="#FFC800" />
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              MY WISHLIST
            </h1>
          </div>
          <p style={{ color: 'var(--wy-muted)', fontSize: '0.9rem', margin: 0 }}>
            {products.length} {products.length === 1 ? 'saved piece' : 'saved pieces'}
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5rem 1.5rem',
              background: 'var(--wy-surface)',
              borderRadius: '16px',
              border: '1px solid var(--wy-border)',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 200, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                color: '#FFC800',
              }}
            >
              <Heart size={32} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: '#FFFFFF',
                marginBottom: '0.5rem',
              }}
            >
              Your Wishlist is Empty
            </h2>
            <p style={{ color: 'var(--wy-muted)', fontSize: '0.9rem', maxWidth: '380px', marginBottom: '1.75rem' }}>
              Explore our latest streetwear drops, sneakers, and accessories to save your favorites.
            </p>
            <Link
              href="/shop"
              className="btn btn-yellow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                padding: '0.75rem 1.5rem',
              }}
            >
              EXPLORE RELEASES <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {products.map((product) => {
              const variant = product.variants?.[0];
              const price = variant?.price ?? 0;
              const inStock = (variant?.stock_quantity ?? 0) > 0;
              const img = product.images?.[0] ?? '/logo.jpeg';

              return (
                <div
                  key={product.id}
                  style={{
                    background: 'var(--wy-surface)',
                    borderRadius: '14px',
                    border: '1px solid var(--wy-border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Image & Remove button */}
                  <div style={{ position: 'relative', width: '100%', height: '280px', background: '#0a0a0a' }}>
                    <Link href={`/shop/${product.slug}`}>
                      <Image
                        src={img}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      title="Remove from wishlist"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#000000',
                        border: '1px solid #27272A',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Info & Actions */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.15rem',
                            color: '#FFFFFF',
                            margin: '0 0 0.35rem',
                            lineHeight: 1.2,
                          }}
                        >
                          {product.title}
                        </h3>
                      </Link>
                      <p
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.25rem',
                          color: '#FFC800',
                          margin: 0,
                        }}
                      >
                        GH₵ {price.toLocaleString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        disabled={!inStock}
                        className="btn btn-yellow"
                        style={{
                          flex: 1,
                          padding: '0.65rem 1rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <ShoppingBag size={15} />
                        {inStock ? 'ADD TO BAG' : 'OUT OF STOCK'}
                      </button>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="btn"
                        style={{
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.82rem',
                          background: 'var(--wy-surface-raised)',
                          color: '#FFFFFF',
                          border: '1px solid var(--wy-border)',
                        }}
                      >
                        VIEW
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
