'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from 'lucide-react';
import Image from 'next/image';

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', slug: '', category: 'clothing', description: '', images: '', is_published: true,
    price: '', stock_quantity: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(id, price, stock_quantity)')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ title: '', slug: '', category: 'clothing', description: '', images: '', is_published: true, price: '', stock_quantity: '' });
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    const variant = p.product_variants?.[0];
    setForm({
      title: p.title, slug: p.slug, category: p.category,
      description: p.description || '', images: p.images?.join(', ') || '',
      is_published: p.is_published,
      price: variant?.price?.toString() || '',
      stock_quantity: variant?.stock_quantity?.toString() || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const productPayload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
      category: form.category as any,
      description: form.description,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      is_published: form.is_published,
    };

    if (editingProduct) {
      await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
      if (editingProduct.product_variants?.[0]) {
        await supabase.from('product_variants').update({
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stock_quantity),
        }).eq('id', editingProduct.product_variants[0].id);
      }
    } else {
      const { data: newProduct } = await supabase.from('products').insert(productPayload).select().single();
      if (newProduct && form.price) {
        await supabase.from('product_variants').insert({
          product_id: newProduct.id,
          sku: `${productPayload.slug}-default`,
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stock_quantity) || 0,
          attributes: {},
        });
      }
    }

    await fetchProducts();
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_published: !current }).eq('id', id);
    fetchProducts();
  };

  const categories = ['clothing', 'watches', 'perfumes', 'accessories', 'sneakers', 'slides', 'bags'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#fff', letterSpacing: '0.04em' }}>
            PRODUCTS
          </h1>
          <p style={{ color: '#555', fontSize: '0.875rem' }}>{products.length} products total</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.25rem',
            background: '#FFC800', color: '#000',
            border: 'none', borderRadius: '8px',
            fontFamily: 'var(--font-display)', fontSize: '0.9rem',
            letterSpacing: '0.06em', cursor: 'pointer',
          }}
        >
          <Plus size={16} /> ADD PRODUCT
        </button>
      </div>

      {/* Products Table */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>No products yet. Add your first one!</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', color: '#444', fontWeight: 500, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const image = p.images?.[0];
                  const price = p.product_variants?.[0]?.price;
                  const stock = p.product_variants?.[0]?.stock_quantity;
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #111' }}>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#1a1a1a', flexShrink: 0 }}>
                            {image && <img src={image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <div>
                            <p style={{ color: '#e0e0e0', fontWeight: 500 }}>{p.title}</p>
                            <p style={{ color: '#444', fontSize: '0.75rem' }}>{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', background: '#1a1a1a', borderRadius: '4px', color: '#888', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#FFC800', fontWeight: 600 }}>
                        {price != null ? `GH₵ ${price}` : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: stock === 0 ? '#ef4444' : stock < 5 ? '#f59e0b' : '#10b981' }}>
                        {stock ?? '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <button onClick={() => togglePublish(p.id, p.is_published)} title={p.is_published ? 'Unpublish' : 'Publish'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.is_published ? '#10b981' : '#555', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                          {p.is_published ? <><Eye size={14} /> Live</> : <><EyeOff size={14} /> Hidden</>}
                        </button>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openEdit(p)} style={{ background: '#1a1a1a', border: 'none', borderRadius: '6px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#888' }}>
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} style={{ background: '#1a1a1a', border: 'none', borderRadius: '6px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Slide-in Form */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={() => setShowForm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '100%', maxWidth: '480px',
            background: '#0d0d0d',
            borderLeft: '1px solid #1a1a1a',
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff' }}>
                {editingProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}>
                <X size={20} />
              </button>
            </div>

            {[
              { label: 'Title', key: 'title', type: 'text', placeholder: 'e.g. Premium Hoodie' },
              { label: 'Slug (auto-generated if empty)', key: 'slug', type: 'text', placeholder: 'e.g. premium-hoodie' },
              { label: 'Description', key: 'description', type: 'textarea', placeholder: 'Product description...' },
              { label: 'Image URLs (comma-separated)', key: 'images', type: 'text', placeholder: 'https://..., https://...' },
              { label: 'Price (GH₵)', key: 'price', type: 'number', placeholder: '0.00' },
              { label: 'Stock Quantity', key: 'stock_quantity', type: 'number', placeholder: '0' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    rows={3}
                    className="input-wy"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                ) : (
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input-wy"
                    style={{ width: '100%' }}
                  />
                )}
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="input-wy"
                style={{ width: '100%' }}
              >
                {categories.map(c => (
                  <option key={c} value={c} style={{ background: '#0d0d0d' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                style={{ accentColor: '#FFC800', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#888' }}>Published (visible on storefront)</span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving || !form.title}
              style={{
                padding: '0.875rem',
                background: saving ? '#555' : '#FFC800',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                letterSpacing: '0.06em',
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {saving ? 'SAVING...' : <><Check size={16} /> {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
