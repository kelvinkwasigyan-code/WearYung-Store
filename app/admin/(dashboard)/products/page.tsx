'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Upload,
  ImagePlus, GripVertical, DollarSign, Package, Tag, FileText,
  ToggleLeft, ToggleRight, Loader2, AlertCircle, CheckCircle2,
  ChevronDown, Search,
} from 'lucide-react';

// ─── Shared field styles ──────────────────────────────────────
const LABEL: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', color: '#71717A',
  textTransform: 'uppercase', letterSpacing: '0.1em',
  marginBottom: '0.45rem', fontWeight: 700,
};
const INPUT: React.CSSProperties = {
  width: '100%', padding: '0.75rem 0.9rem',
  background: '#18181B', border: '1px solid #27272A',
  borderRadius: '8px', color: '#FFFFFF', fontSize: '0.88rem',
  outline: 'none', transition: 'border-color 0.2s',
};
const ROW: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
};

// ─── Image Upload Component ───────────────────────────────────
function ImageUploader({
  images,
  setImages,
}: {
  images: { url: string; uploading?: boolean; file?: File }[];
  setImages: React.Dispatch<React.SetStateAction<{ url: string; uploading?: boolean; file?: File }[]>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    const tempId = URL.createObjectURL(file);
    setImages(prev => [...prev, { url: tempId, uploading: true, file }]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setImages(prev =>
        prev.map(img =>
          img.url === tempId ? { url: data.url, uploading: false } : img
        )
      );
    } catch (err: any) {
      console.error('Upload error:', err);
      setImages(prev => prev.filter(img => img.url !== tempId));
      alert(`Upload failed: ${err.message}`);
    }
  }, [setImages]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) uploadFile(file);
    });
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label style={LABEL}>
        <ImagePlus size={12} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
        Product Images
      </label>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
          gap: '0.6rem',
          marginBottom: '0.75rem',
        }}>
          {images.map((img, i) => (
            <div
              key={img.url + i}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: '8px',
                overflow: 'hidden',
                border: i === 0 ? '2px solid #FFC800' : '1px solid #27272A',
                background: '#18181B',
              }}
            >
              {img.uploading ? (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '0.3rem',
                }}>
                  <Loader2 size={18} className="spin" style={{ color: '#FFC800', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.6rem', color: '#71717A' }}>Uploading</span>
                </div>
              ) : (
                <img
                  src={img.url}
                  alt={`Product ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              {/* Cover badge on first image */}
              {i === 0 && !img.uploading && (
                <div style={{
                  position: 'absolute', top: '4px', left: '4px',
                  background: '#FFC800', color: '#000',
                  fontSize: '0.55rem', fontWeight: 800,
                  padding: '1px 5px', borderRadius: '3px',
                  letterSpacing: '0.06em',
                }}>
                  COVER
                </div>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ef4444',
                }}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#FFC800' : '#27272A'}`,
          borderRadius: '10px',
          padding: images.length > 0 ? '1rem' : '2rem 1rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? 'rgba(255,200,0,0.04)' : '#111113',
          transition: 'all 0.2s',
        }}
      >
        <Upload size={images.length > 0 ? 18 : 28} style={{ color: dragOver ? '#FFC800' : '#3F3F46', margin: '0 auto 0.5rem' }} />
        <p style={{ fontSize: '0.82rem', color: '#71717A', margin: 0 }}>
          {images.length > 0 ? 'Add more photos' : 'Drag & drop product photos here'}
        </p>
        <p style={{ fontSize: '0.7rem', color: '#3F3F46', marginTop: '0.3rem' }}>
          JPG, PNG, WebP • Max 5MB each
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.85rem 1.25rem',
      background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
      borderRadius: '10px',
      color: type === 'success' ? '#34D399' : '#F87171',
      fontSize: '0.85rem',
      zIndex: 200,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

// ─── Main Admin Products Page ─────────────────────────────────
export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Form state
  const [form, setForm] = useState({
    title: '', slug: '', category: 'clothing',
    description: '', is_published: true,
    price: '', compare_at_price: '',
    stock_quantity: '',
    sku: '',
    clothing_type: '',
    size: '',
    color: '',
  });
  const [formImages, setFormImages] = useState<{ url: string; uploading?: boolean; file?: File }[]>([]);

  const categories = ['clothing', 'watches', 'perfumes', 'accessories', 'sneakers', 'slides', 'bags'];

  const clothingTypes = [
    { value: '', label: 'Select type...' },
    { value: 'hoodie', label: 'Hoodies & Sweats' },
    { value: 'jeans', label: 'Jeans & Pants' },
    { value: 'tops', label: 'Tees & Tops' },
    { value: 'jacket', label: 'Jackets & Outerwear' },
    { value: 'shorts', label: 'Shorts' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(id, sku, price, stock_quantity, attributes)')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm({
      title: '', slug: '', category: 'clothing',
      description: '', is_published: true,
      price: '', compare_at_price: '',
      stock_quantity: '',
      sku: '',
      clothing_type: '',
      size: '',
      color: '',
    });
    setFormImages([]);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    const variant = p.product_variants?.[0];
    const attrs = variant?.attributes || {};
    setForm({
      title: p.title,
      slug: p.slug,
      category: p.category,
      description: p.description || '',
      is_published: p.is_published,
      price: variant?.price?.toString() || '',
      compare_at_price: '',
      stock_quantity: variant?.stock_quantity?.toString() || '',
      sku: variant?.sku || '',
      clothing_type: attrs.clothing_type || '',
      size: attrs.size || attrs.size_eu?.toString() || '',
      color: attrs.color || attrs.colorway || '',
    });
    setFormImages((p.images || []).map((url: string) => ({ url })));
    setShowForm(true);
  };

  const handleSave = async () => {
    // Validate
    if (!form.title.trim()) return;
    const hasUploading = formImages.some(img => img.uploading);
    if (hasUploading) {
      setToast({ message: 'Please wait for all images to finish uploading.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const imageUrls = formImages.map(img => img.url);
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const productPayload = {
        title: form.title.trim(),
        slug,
        category: form.category as any,
        description: form.description.trim() || null,
        images: imageUrls,
        is_published: form.is_published,
      };

      // Build variant attributes based on category
      const attributes: Record<string, any> = {};
      if (form.color) attributes.color = form.color;
      if (form.category === 'clothing') {
        if (form.size) attributes.size = form.size;
        if (form.clothing_type) attributes.clothing_type = form.clothing_type;
      } else if (['sneakers', 'slides'].includes(form.category)) {
        if (form.size) attributes.size_eu = parseInt(form.size);
        if (form.color) attributes.colorway = form.color;
      }

      if (editingProduct) {
        // Update product
        await supabase.from('products').update(productPayload).eq('id', editingProduct.id);

        // Update or create variant
        if (editingProduct.product_variants?.[0]) {
          await supabase.from('product_variants').update({
            price: parseFloat(form.price) || 0,
            stock_quantity: parseInt(form.stock_quantity) || 0,
            sku: form.sku || `${slug}-default`,
            attributes,
          }).eq('id', editingProduct.product_variants[0].id);
        } else if (form.price) {
          await supabase.from('product_variants').insert({
            product_id: editingProduct.id,
            sku: form.sku || `${slug}-default`,
            price: parseFloat(form.price) || 0,
            stock_quantity: parseInt(form.stock_quantity) || 0,
            attributes,
          });
        }

        setToast({ message: `"${form.title}" updated successfully!`, type: 'success' });
      } else {
        // Create product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(productPayload)
          .select()
          .single();

        if (error) throw error;

        if (newProduct) {
          await supabase.from('product_variants').insert({
            product_id: newProduct.id,
            sku: form.sku || `${slug}-default`,
            price: parseFloat(form.price) || 0,
            stock_quantity: parseInt(form.stock_quantity) || 0,
            attributes,
          });
        }

        setToast({ message: `"${form.title}" created successfully!`, type: 'success' });
      }

      await fetchProducts();
      setShowForm(false);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save product', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await supabase.from('products').delete().eq('id', id);
    setToast({ message: `"${title}" deleted.`, type: 'success' });
    fetchProducts();
  };

  const togglePublish = async (id: string, current: boolean, title: string) => {
    await supabase.from('products').update({ is_published: !current }).eq('id', id);
    setToast({ message: `"${title}" ${!current ? 'published' : 'hidden'}.`, type: 'success' });
    fetchProducts();
  };

  // Filter products
  const filtered = products.filter(p => {
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalStock = products.reduce((acc, p) => acc + (p.product_variants?.[0]?.stock_quantity || 0), 0);
  const publishedCount = products.filter(p => p.is_published).length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          color: '#fff', letterSpacing: '0.04em',
        }}>
          PRODUCTS
        </h1>
        <p style={{ color: '#52525B', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Manage your catalog — {products.length} products • {publishedCount} published • {totalStock} total units
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Products', value: products.length, color: '#FFC800' },
          { label: 'Published', value: publishedCount, color: '#10B981' },
          { label: 'Hidden', value: products.length - publishedCount, color: '#71717A' },
          { label: 'Total Stock', value: totalStock, color: '#3B82F6' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#0D0D0D', border: '1px solid #1A1A1A',
            borderRadius: '10px', padding: '1rem 1.25rem',
          }}>
            <p style={{ fontSize: '0.65rem', color: '#52525B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{stat.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color, fontFamily: 'var(--font-display)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ ...INPUT, paddingLeft: '2.4rem' }}
            onFocus={e => e.target.style.borderColor = '#FFC800'}
            onBlur={e => e.target.style.borderColor = '#27272A'}
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ ...INPUT, width: 'auto', minWidth: '140px', cursor: 'pointer' }}
        >
          <option value="all" style={{ background: '#18181B' }}>All Categories</option>
          {categories.map(c => (
            <option key={c} value={c} style={{ background: '#18181B' }}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.25rem',
            background: '#FFC800', color: '#000',
            border: 'none', borderRadius: '8px',
            fontFamily: 'var(--font-display)', fontSize: '0.85rem',
            letterSpacing: '0.06em', cursor: 'pointer',
            fontWeight: 700,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e6b400'}
          onMouseLeave={e => e.currentTarget.style.background = '#FFC800'}
        >
          <Plus size={16} /> ADD PRODUCT
        </button>
      </div>

      {/* Products Table */}
      <div style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#3F3F46', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#3F3F46' }}>
            {searchQuery || filterCategory !== 'all' ? 'No products match your filters.' : 'No products yet. Add your first one!'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1A1A1A' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '0.8rem 1.25rem', textAlign: 'left',
                      color: '#3F3F46', fontWeight: 600, fontSize: '0.68rem',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const image = p.images?.[0];
                  const price = p.product_variants?.[0]?.price;
                  const stock = p.product_variants?.[0]?.stock_quantity;
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid #111', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#111113'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '44px', height: '44px',
                            borderRadius: '8px', overflow: 'hidden',
                            background: '#1A1A1A', flexShrink: 0,
                            border: '1px solid #27272A',
                          }}>
                            {image && <img src={image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <div>
                            <p style={{ color: '#E4E4E7', fontWeight: 600 }}>{p.title}</p>
                            <p style={{ color: '#3F3F46', fontSize: '0.72rem', marginTop: '1px' }}>{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{
                          padding: '0.25rem 0.6rem',
                          background: '#1A1A1A', borderRadius: '5px',
                          color: '#71717A', fontSize: '0.72rem',
                          textTransform: 'capitalize', fontWeight: 500,
                          border: '1px solid #27272A',
                        }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#FFC800', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
                        {price != null ? `GH₵ ${parseFloat(price).toFixed(2)}` : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{
                          color: stock === 0 ? '#EF4444' : stock < 5 ? '#F59E0B' : '#10B981',
                          fontWeight: 600,
                        }}>
                          {stock ?? '—'}
                        </span>
                        {stock != null && stock < 5 && stock > 0 && (
                          <span style={{ fontSize: '0.65rem', color: '#F59E0B', marginLeft: '0.4rem' }}>LOW</span>
                        )}
                        {stock === 0 && (
                          <span style={{ fontSize: '0.65rem', color: '#EF4444', marginLeft: '0.4rem' }}>OUT</span>
                        )}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <button
                          onClick={() => togglePublish(p.id, p.is_published, p.title)}
                          title={p.is_published ? 'Unpublish' : 'Publish'}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: p.is_published ? '#10B981' : '#52525B',
                            display: 'flex', alignItems: 'center',
                            gap: '0.35rem', fontSize: '0.78rem', fontWeight: 500,
                          }}
                        >
                          {p.is_published
                            ? <><ToggleRight size={18} /> Live</>
                            : <><ToggleLeft size={18} /> Hidden</>
                          }
                        </button>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEdit(p)}
                            title="Edit"
                            style={{
                              background: '#1A1A1A', border: '1px solid #27272A',
                              borderRadius: '6px', padding: '0.4rem 0.55rem',
                              cursor: 'pointer', color: '#A1A1AA',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#FFC800'; e.currentTarget.style.borderColor = '#FFC800'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#A1A1AA'; e.currentTarget.style.borderColor = '#27272A'; }}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            title="Delete"
                            style={{
                              background: '#1A1A1A', border: '1px solid #27272A',
                              borderRadius: '6px', padding: '0.4rem 0.55rem',
                              cursor: 'pointer', color: '#A1A1AA',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#EF4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#A1A1AA'; e.currentTarget.style.borderColor = '#27272A'; }}
                          >
                            <Trash2 size={13} />
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

      {/* ─── Slide-in Add/Edit Form ─────────────────────────── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div
            onClick={() => setShowForm(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '100%', maxWidth: '540px',
            background: '#0A0A0A',
            borderLeft: '1px solid #1A1A1A',
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Form Header */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 1.75rem',
              background: '#0A0A0A',
              borderBottom: '1px solid #1A1A1A',
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem', color: '#fff',
                  letterSpacing: '0.04em',
                }}>
                  {editingProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
                </h2>
                <p style={{ fontSize: '0.72rem', color: '#52525B', marginTop: '0.15rem' }}>
                  {editingProduct ? `Editing: ${editingProduct.title}` : 'Fill in the details to add a new product'}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: '#18181B', border: '1px solid #27272A',
                  borderRadius: '8px', padding: '0.4rem',
                  cursor: 'pointer', color: '#71717A',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#71717A'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

              {/* ─── Section: Basic Info ─── */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={12} /> Basic Information
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={LABEL}>Product Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Premium Oversized Hoodie"
                      style={INPUT}
                      onFocus={e => e.target.style.borderColor = '#FFC800'}
                      onBlur={e => e.target.style.borderColor = '#27272A'}
                    />
                  </div>

                  <div style={ROW}>
                    <div>
                      <label style={LABEL}>Slug</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                        placeholder="auto-generated"
                        style={{ ...INPUT, color: '#71717A' }}
                        onFocus={e => { e.target.style.borderColor = '#FFC800'; e.target.style.color = '#fff'; }}
                        onBlur={e => { e.target.style.borderColor = '#27272A'; e.target.style.color = '#71717A'; }}
                      />
                    </div>
                    <div>
                      <label style={LABEL}>SKU</label>
                      <input
                        type="text"
                        value={form.sku}
                        onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                        placeholder="auto-generated"
                        style={{ ...INPUT, color: '#71717A' }}
                        onFocus={e => { e.target.style.borderColor = '#FFC800'; e.target.style.color = '#fff'; }}
                        onBlur={e => { e.target.style.borderColor = '#27272A'; e.target.style.color = '#71717A'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={LABEL}>Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Premium quality streetwear crafted for the bold..."
                      rows={4}
                      style={{ ...INPUT, resize: 'vertical', lineHeight: 1.5 }}
                      onFocus={e => e.target.style.borderColor = '#FFC800'}
                      onBlur={e => e.target.style.borderColor = '#27272A'}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#1A1A1A' }} />

              {/* ─── Section: Images ─── */}
              <ImageUploader images={formImages} setImages={setFormImages} />

              {/* Divider */}
              <div style={{ height: '1px', background: '#1A1A1A' }} />

              {/* ─── Section: Category & Attributes ─── */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Tag size={12} /> Category & Attributes
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={LABEL}>Category *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{ ...INPUT, cursor: 'pointer' }}
                    >
                      {categories.map(c => (
                        <option key={c} value={c} style={{ background: '#18181B' }}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clothing-specific fields */}
                  {form.category === 'clothing' && (
                    <div style={ROW}>
                      <div>
                        <label style={LABEL}>Clothing Type</label>
                        <select
                          value={form.clothing_type}
                          onChange={e => setForm(f => ({ ...f, clothing_type: e.target.value }))}
                          style={{ ...INPUT, cursor: 'pointer' }}
                        >
                          {clothingTypes.map(ct => (
                            <option key={ct.value} value={ct.value} style={{ background: '#18181B' }}>
                              {ct.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={LABEL}>Size</label>
                        <select
                          value={form.size}
                          onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                          style={{ ...INPUT, cursor: 'pointer' }}
                        >
                          <option value="" style={{ background: '#18181B' }}>Select size...</option>
                          {sizes.map(s => (
                            <option key={s} value={s} style={{ background: '#18181B' }}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Footwear-specific fields */}
                  {['sneakers', 'slides'].includes(form.category) && (
                    <div>
                      <label style={LABEL}>Size (EU)</label>
                      <input
                        type="number"
                        value={form.size}
                        onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                        placeholder="e.g. 42"
                        style={INPUT}
                        onFocus={e => e.target.style.borderColor = '#FFC800'}
                        onBlur={e => e.target.style.borderColor = '#27272A'}
                      />
                    </div>
                  )}

                  <div>
                    <label style={LABEL}>Color / Colorway</label>
                    <input
                      type="text"
                      value={form.color}
                      onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      placeholder="e.g. Midnight Black"
                      style={INPUT}
                      onFocus={e => e.target.style.borderColor = '#FFC800'}
                      onBlur={e => e.target.style.borderColor = '#27272A'}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#1A1A1A' }} />

              {/* ─── Section: Pricing & Stock ─── */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={12} /> Pricing & Inventory
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={ROW}>
                    <div>
                      <label style={LABEL}>Price (GH₵) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="0.00"
                        style={INPUT}
                        onFocus={e => e.target.style.borderColor = '#FFC800'}
                        onBlur={e => e.target.style.borderColor = '#27272A'}
                      />
                    </div>
                    <div>
                      <label style={LABEL}>Compare-at Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.compare_at_price}
                        onChange={e => setForm(f => ({ ...f, compare_at_price: e.target.value }))}
                        placeholder="Original price"
                        style={{ ...INPUT, color: '#71717A' }}
                        onFocus={e => { e.target.style.borderColor = '#FFC800'; e.target.style.color = '#fff'; }}
                        onBlur={e => { e.target.style.borderColor = '#27272A'; e.target.style.color = '#71717A'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={LABEL}>Stock Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock_quantity}
                      onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))}
                      placeholder="0"
                      style={INPUT}
                      onFocus={e => e.target.style.borderColor = '#FFC800'}
                      onBlur={e => e.target.style.borderColor = '#27272A'}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#1A1A1A' }} />

              {/* ─── Section: Visibility ─── */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Eye size={12} /> Visibility
                </p>

                <label style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  cursor: 'pointer',
                  padding: '0.85rem 1rem',
                  background: '#18181B',
                  borderRadius: '8px',
                  border: '1px solid #27272A',
                }}>
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                    style={{ accentColor: '#FFC800', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.88rem', color: form.is_published ? '#10B981' : '#71717A', fontWeight: 600 }}>
                      {form.is_published ? 'Published — visible on storefront' : 'Hidden — not visible to customers'}
                    </span>
                    <p style={{ fontSize: '0.72rem', color: '#3F3F46', marginTop: '2px' }}>
                      Toggle to control visibility on the store
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Sticky Save Footer */}
            <div style={{
              position: 'sticky', bottom: 0,
              padding: '1.25rem 1.75rem',
              background: '#0A0A0A',
              borderTop: '1px solid #1A1A1A',
              display: 'flex', gap: '0.75rem',
            }}>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1, padding: '0.85rem',
                  background: '#18181B', color: '#A1A1AA',
                  border: '1px solid #27272A', borderRadius: '8px',
                  fontFamily: 'var(--font-display)', fontSize: '0.88rem',
                  letterSpacing: '0.06em', cursor: 'pointer',
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                style={{
                  flex: 2, padding: '0.85rem',
                  background: saving || !form.title.trim() ? '#3F3F46' : '#FFC800',
                  color: '#000', border: 'none', borderRadius: '8px',
                  fontFamily: 'var(--font-display)', fontSize: '0.88rem',
                  letterSpacing: '0.06em', fontWeight: 700,
                  cursor: saving || !form.title.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  transition: 'background 0.2s',
                }}
              >
                {saving ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> SAVING...</>
                ) : (
                  <><Check size={16} /> {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Spin keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
