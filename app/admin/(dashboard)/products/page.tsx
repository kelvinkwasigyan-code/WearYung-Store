'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { compressImage } from '@/lib/image-compression';
import {
  saveProductAction,
  deleteProductAction,
  togglePublishProductAction,
  fetchAdminProductsAction,
} from '@/app/actions/products';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Upload,
  ImagePlus, GripVertical, DollarSign, Package, Tag, FileText,
  ToggleLeft, ToggleRight, Loader2, AlertCircle, CheckCircle2,
  ChevronDown, Search,
} from 'lucide-react';

// ─── Shared field styles ──────────────────────────────────────
const LABEL: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', color: '#D4D4D8',
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
      // Compress and format mobile camera / high-res uploads to lightweight web format
      const optimizedFile = await compressImage(file);

      const formData = new FormData();
      formData.append('file', optimizedFile);

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
  const [form, setForm] = useState<{
    title: string;
    slug: string;
    category: string;
    description: string;
    is_published: boolean;
    price: string;
    compare_at_price: string;
    stock_quantity: string;
    sku: string;
    clothing_type: string;
    sleeve_type: string;
    fit: string;
    size: string;
    color: string;
    size_inventory: Record<string, number>;
  }>({
    title: '', slug: '', category: 'clothing',
    description: '', is_published: true,
    price: '', compare_at_price: '',
    stock_quantity: '',
    sku: '',
    clothing_type: 'tops_sleeves',
    sleeve_type: 'tops',
    fit: 'baggy',
    size: '',
    color: '',
    size_inventory: {},
  });
  const [formImages, setFormImages] = useState<{ url: string; uploading?: boolean; file?: File }[]>([]);

  const categories = ['clothing', 'watches', 'perfumes', 'accessories', 'sneakers', 'slides', 'bags'];

  const clothingCategories = [
    { value: '', label: 'Select clothing category...' },
    { value: 'tops_sleeves', label: 'Tops & Sleeves' },
    { value: 'jeans_pants', label: 'Jeans & Pants' },
    { value: 'hoodie', label: 'Hoodies & Sweats' },
    { value: 'jacket', label: 'Jackets & Outerwear' },
    { value: 'shorts', label: 'Shorts' },
  ];

  const topsSleevesSubOptions = [
    { value: 'tops', label: 'Tops (Short Sleeve Tees / Crop Tops)' },
    { value: 'sleeves', label: 'Sleeves (Long Sleeves & Sweaters)' },
  ];

  const jeansSubOptions = [
    { value: 'baggy', label: 'Baggy Jeans (Loose / Skater Fit)' },
    { value: 'slim', label: 'Slim Fit Jeans (Tapered / Skinny)' },
    { value: 'regular', label: 'Regular / Straight Fit Jeans' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const serverRes = await fetchAdminProductsAction();
      if (serverRes.success && serverRes.products && serverRes.products.length > 0) {
        setProducts(serverRes.products);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('[fetchProducts] Server action error, attempting fallback:', e);
    }

    try {
      const { data } = await supabase
        .from('products')
        .select('*, product_variants(id, sku, price, stock_quantity, attributes)')
        .order('created_at', { ascending: false });
      setProducts(data || []);
    } catch (err) {
      console.error('[fetchProducts] Fallback error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const shoeSizes = ['38', '39', '40', '41', '42', '43', '44', '45', '46'];

  const openAdd = () => {
    setEditingProduct(null);
    setForm({
      title: '', slug: '', category: 'clothing',
      description: '', is_published: true,
      price: '', compare_at_price: '',
      stock_quantity: '',
      sku: '',
      clothing_type: 'tops_sleeves',
      sleeve_type: 'tops',
      fit: 'baggy',
      size: '',
      color: '',
      size_inventory: {},
    });
    setFormImages([]);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    const variant = p.product_variants?.[0];
    const attrs = variant?.attributes || {};
    let resolvedType = attrs.clothing_type || '';
    if (resolvedType === 'tops' || resolvedType === 'sleeves') resolvedType = 'tops_sleeves';
    if (resolvedType === 'baggy_jeans' || resolvedType === 'slim_jeans' || resolvedType === 'jeans') resolvedType = 'jeans_pants';

    let loadedSizeInventory: Record<string, number> = {};
    const totalVariantStock = Number(variant?.stock_quantity) || 0;
    if (attrs.size_inventory && typeof attrs.size_inventory === 'object' && Object.keys(attrs.size_inventory).length > 0) {
      loadedSizeInventory = { ...attrs.size_inventory };
    } else if (attrs.sizes && Array.isArray(attrs.sizes) && attrs.sizes.length > 0) {
      const count = attrs.sizes.length;
      const perSize = Math.floor(totalVariantStock / count);
      attrs.sizes.forEach((sz: string, idx: number) => {
        loadedSizeInventory[sz] = idx === 0 ? perSize + (totalVariantStock % count) : perSize;
      });
    } else if (attrs.size && typeof attrs.size === 'string' && attrs.size.includes(',')) {
      const parts = attrs.size.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (parts.length > 0) {
        const count = parts.length;
        const perSize = Math.floor(totalVariantStock / count);
        parts.forEach((sz: string, idx: number) => {
          loadedSizeInventory[sz] = idx === 0 ? perSize + (totalVariantStock % count) : perSize;
        });
      }
    } else if (attrs.size) {
      loadedSizeInventory[attrs.size.toString()] = totalVariantStock;
    } else if (attrs.size_eu) {
      loadedSizeInventory[attrs.size_eu.toString()] = totalVariantStock;
    }

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
      clothing_type: resolvedType || 'tops_sleeves',
      sleeve_type: attrs.sleeve_type || (attrs.clothing_type === 'sleeves' ? 'sleeves' : 'tops'),
      fit: attrs.fit || (attrs.clothing_type === 'slim_jeans' ? 'slim' : attrs.clothing_type === 'baggy_jeans' ? 'baggy' : 'baggy'),
      size: attrs.size || attrs.size_eu?.toString() || '',
      color: attrs.color || attrs.colorway || '',
      size_inventory: loadedSizeInventory,
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

      // Build variant attributes based on category & size inventory
      const attributes: Record<string, any> = {};
      if (form.color) attributes.color = form.color;

      const sizeInventoryKeys = Object.keys(form.size_inventory || {});
      const hasSizeInventory = sizeInventoryKeys.length > 0;

      if (hasSizeInventory) {
        attributes.size_inventory = form.size_inventory;
        attributes.sizes = sizeInventoryKeys;
        attributes.size = sizeInventoryKeys.join(', ');
      } else if (form.size) {
        attributes.size = form.size;
      }

      if (form.category === 'clothing') {
        attributes.clothing_type = form.clothing_type;
        if (form.clothing_type === 'tops_sleeves') {
          attributes.sleeve_type = form.sleeve_type || 'tops';
        } else if (form.clothing_type === 'jeans_pants') {
          attributes.fit = form.fit || 'baggy';
        }
      } else if (['sneakers', 'slides'].includes(form.category)) {
        if (!hasSizeInventory && form.size) attributes.size_eu = parseInt(form.size);
        if (form.color) attributes.colorway = form.color;
      }

      // Calculate total stock: sum of size_inventory if available, otherwise manual input
      let totalStock = parseInt(form.stock_quantity) || 0;
      if (hasSizeInventory) {
        totalStock = Object.values(form.size_inventory).reduce((acc, qty) => acc + (Number(qty) || 0), 0);
      }

      const variantPayload = (form.price || editingProduct?.product_variants?.[0]) ? {
        id: editingProduct?.product_variants?.[0]?.id,
        price: parseFloat(form.price) || 0,
        stock_quantity: totalStock,
        sku: form.sku || `${slug}-default`,
        attributes,
      } : undefined;

      const result = await saveProductAction({
        id: editingProduct?.id,
        productPayload,
        variantPayload,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to save product');
      }

      setToast({ message: result.message || 'Product saved successfully!', type: 'success' });
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
    const result = await deleteProductAction(id);
    if (!result.success) {
      setToast({ message: result.error || 'Failed to delete product', type: 'error' });
      return;
    }
    setToast({ message: `"${title}" deleted.`, type: 'success' });
    fetchProducts();
  };

  const togglePublish = async (id: string, current: boolean, title: string) => {
    const result = await togglePublishProductAction(id, !current);
    if (!result.success) {
      setToast({ message: result.error || 'Failed to update visibility', type: 'error' });
      return;
    }
    setToast({ message: `"${title}" ${!current ? 'published' : 'hidden'}.`, type: 'success' });
    fetchProducts();
  };

  const [filterStock, setFilterStock] = useState<'all' | 'low_stock' | 'out_of_stock' | 'in_stock'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stockParam = params.get('filter');
      if (stockParam === 'low_stock' || stockParam === 'out_of_stock' || stockParam === 'in_stock') {
        setFilterStock(stockParam);
      }
    }
  }, []);

  const lowStockProducts = products.filter(p => {
    const v = p.product_variants?.[0];
    const s = Number(v?.stock_quantity ?? 0);
    const sizeInv = v?.attributes?.size_inventory;
    const hasLowSize = sizeInv && typeof sizeInv === 'object' && Object.values(sizeInv).some((qty: any) => Number(qty) <= 2);
    return s <= 5 || hasLowSize;
  });

  const lowStockCount = lowStockProducts.length;
  const outOfStockCount = products.filter(p => (p.product_variants?.[0]?.stock_quantity ?? 0) === 0).length;

  // Filter products
  const filtered = products.filter(p => {
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    
    const variant = p.product_variants?.[0];
    const stock = Number(variant?.stock_quantity ?? 0);
    const sizeInv = variant?.attributes?.size_inventory;
    const hasLowSize = sizeInv && typeof sizeInv === 'object' && Object.values(sizeInv).some((qty: any) => Number(qty) <= 2);

    let matchStock = true;
    if (filterStock === 'low_stock') {
      matchStock = stock <= 5 || Boolean(hasLowSize);
    } else if (filterStock === 'out_of_stock') {
      matchStock = stock === 0;
    } else if (filterStock === 'in_stock') {
      matchStock = stock > 5 && !hasLowSize;
    }

    return matchSearch && matchCategory && matchStock;
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

      {/* ─── Low Stock Alert Banner ─── */}
      {lowStockCount > 0 && filterStock !== 'low_stock' && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '10px',
          padding: '0.9rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <span style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600 }}>
              <strong style={{ color: '#EF4444' }}>{lowStockCount} item{lowStockCount > 1 ? 's' : ''}</strong> running low on stock (≤ 5 units or depleted sizes).
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFilterStock('low_stock')}
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            VIEW LOW STOCK ITEMS ({lowStockCount})
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Products', value: products.length, color: '#FFC800' },
          { label: 'Published', value: publishedCount, color: '#10B981' },
          { label: 'Low Stock Alerts', value: lowStockCount, color: lowStockCount > 0 ? '#EF4444' : '#10B981' },
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

      {/* Search, Category Filter & Stock Filter Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#3F3F46' }} />
            <input
              type="text"
              placeholder="Search products by title or slug..."
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

        {/* Stock Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: '#71717A', fontWeight: 600, marginRight: '0.25rem' }}>Stock Status:</span>
          {[
            { id: 'all', label: 'All Inventory', count: products.length },
            { id: 'low_stock', label: '⚠️ Low Stock', count: lowStockCount, isAlert: lowStockCount > 0 },
            { id: 'out_of_stock', label: '🔴 Out of Stock', count: outOfStockCount, isAlert: outOfStockCount > 0 },
            { id: 'in_stock', label: '🟢 In Stock', count: products.length - lowStockCount },
          ].map(tab => {
            const isActive = filterStock === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStock(tab.id as any)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: isActive
                    ? '1.5px solid #FFC800'
                    : tab.isAlert
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : '1px solid #27272A',
                  background: isActive
                    ? '#FFC800'
                    : tab.isAlert
                    ? 'rgba(239, 68, 68, 0.1)'
                    : '#141418',
                  color: isActive
                    ? '#000000'
                    : tab.isAlert
                    ? '#EF4444'
                    : '#A1A1AA',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Content: Mobile Cards & Desktop Table */}
      {loading ? (
        <div style={{ background: '#0D0D0D', border: '1px solid #27272A', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#A1A1AA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: '#FFC800' }} /> Loading products...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#0D0D0D', border: '1px solid #27272A', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#A1A1AA' }}>
          {searchQuery || filterCategory !== 'all' || filterStock !== 'all' ? 'No products match your filters.' : 'No products yet. Add your first one!'}
        </div>
      ) : (
        <>
          {/* ─── 1. MOBILE CARDS VIEW (< 768px) ─── */}
          <div className="admin-mobile-cards-view" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filtered.map(p => {
              const image = p.images?.[0];
              const price = p.product_variants?.[0]?.price;
              const stock = p.product_variants?.[0]?.stock_quantity;
              const sizeInv = p.product_variants?.[0]?.attributes?.size_inventory;
              const lowSizes: string[] = [];
              if (sizeInv && typeof sizeInv === 'object') {
                Object.entries(sizeInv).forEach(([sz, count]) => {
                  if (Number(count) <= 2) {
                    lowSizes.push(`${sz}(${count})`);
                  }
                });
              }
              const isOutOfStock = stock === 0;
              const isLowStock = !isOutOfStock && ((stock ?? 0) <= 5 || lowSizes.length > 0);

              return (
                <div
                  key={p.id}
                  style={{
                    background: '#0D0D10',
                    border: isOutOfStock ? '1px solid rgba(239, 68, 68, 0.4)' : isLowStock ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid #27272A',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                  }}
                >
                  {/* Top Row: Thumbnail + Title + Category + Publish Status */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#18181C',
                      flexShrink: 0,
                      border: '1px solid #27272A',
                    }}>
                      {image ? (
                        <img src={image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525B' }}>
                          <Package size={20} />
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.25, margin: 0 }}>
                          {p.title}
                        </p>
                        <button
                          onClick={() => togglePublish(p.id, p.is_published, p.title)}
                          title={p.is_published ? 'Unpublish' : 'Publish'}
                          style={{
                            background: p.is_published ? 'rgba(16, 185, 129, 0.12)' : 'rgba(113, 113, 122, 0.12)',
                            border: `1px solid ${p.is_published ? 'rgba(16, 185, 129, 0.3)' : 'rgba(113, 113, 122, 0.3)'}`,
                            borderRadius: '6px',
                            padding: '0.2rem 0.5rem',
                            cursor: 'pointer',
                            color: p.is_published ? '#10B981' : '#71717A',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {p.is_published ? <><ToggleRight size={14} /> LIVE</> : <><ToggleLeft size={14} /> HIDDEN</>}
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.15rem 0.45rem',
                          background: '#18181C',
                          borderRadius: '4px',
                          color: '#A1A1AA',
                          fontSize: '0.68rem',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          border: '1px solid #27272A',
                        }}>
                          {p.category}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#52525B' }}>
                          /{p.slug}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row: Price & Stock Status */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#141418',
                    border: '1px solid #1E1E24',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                  }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: '#71717A', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>PRICE</span>
                      <span style={{ color: '#FFC800', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
                        {price != null ? `GH₵ ${parseFloat(price).toFixed(2)}` : '—'}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: '#71717A', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>STOCK</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                        <span style={{
                          color: isOutOfStock ? '#EF4444' : isLowStock ? '#F59E0B' : '#10B981',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                        }}>
                          {stock ?? '—'} pcs
                        </span>
                        {isOutOfStock && (
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#EF4444', background: 'rgba(239, 68, 68, 0.2)', padding: '1px 5px', borderRadius: '4px' }}>
                            OUT
                          </span>
                        )}
                        {isLowStock && (
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.2)', padding: '1px 5px', borderRadius: '4px' }}>
                            LOW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Low Sizes Pill Tags if any */}
                  {lowSizes.length > 0 && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', padding: '0.4rem 0.6rem', fontSize: '0.72rem', color: '#F59E0B' }}>
                      ⚠️ Depleted sizes: <strong>{lowSizes.join(', ')}</strong>
                    </div>
                  )}

                  {/* Bottom Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.25rem' }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        background: '#1A1A20',
                        border: '1px solid #27272A',
                        borderRadius: '8px',
                        padding: '0.55rem',
                        color: '#FFC800',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={13} /> Edit Product
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        background: '#1A1A20',
                        border: '1px solid #27272A',
                        borderRadius: '8px',
                        padding: '0.55rem 0.85rem',
                        color: '#EF4444',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── 2. DESKTOP TABLE VIEW (≥ 768px) ─── */}
          <div className="admin-desktop-table-view" style={{ background: '#0D0D0D', border: '1px solid #27272A', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #27272A', background: '#111113' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '0.85rem 1.25rem', textAlign: 'left',
                        color: '#A1A1AA', fontWeight: 600, fontSize: '0.72rem',
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
                        style={{ borderBottom: '1px solid #1E1E24', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#141417'}
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
                              <p style={{ color: '#FFFFFF', fontWeight: 600 }}>{p.title}</p>
                              <p style={{ color: '#A1A1AA', fontSize: '0.72rem', marginTop: '1px' }}>{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem 1.25rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            background: '#18181B', borderRadius: '5px',
                            color: '#E4E4E7', fontSize: '0.72rem',
                            textTransform: 'capitalize', fontWeight: 600,
                            border: '1px solid #27272A',
                          }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1.25rem', color: '#FFC800', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
                          {price != null ? `GH₵ ${parseFloat(price).toFixed(2)}` : '—'}
                        </td>
                        <td style={{ padding: '0.875rem 1.25rem' }}>
                          {(() => {
                            const sizeInv = p.product_variants?.[0]?.attributes?.size_inventory;
                            const lowSizes: string[] = [];
                            if (sizeInv && typeof sizeInv === 'object') {
                              Object.entries(sizeInv).forEach(([sz, count]) => {
                                if (Number(count) <= 2) {
                                  lowSizes.push(`${sz}: ${count}`);
                                }
                              });
                            }
                            const isOutOfStock = stock === 0;
                            const isLowStock = !isOutOfStock && ((stock ?? 0) <= 5 || lowSizes.length > 0);

                            return (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span style={{
                                    color: isOutOfStock ? '#EF4444' : isLowStock ? '#F59E0B' : '#10B981',
                                    fontWeight: 700,
                                    fontSize: '0.88rem',
                                  }}>
                                    {stock ?? '—'} pcs
                                  </span>
                                  {isOutOfStock && (
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EF4444', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                                      OUT
                                    </span>
                                  )}
                                  {isLowStock && (
                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                                      LOW
                                    </span>
                                  )}
                                </div>
                                {lowSizes.length > 0 && (
                                  <p style={{ fontSize: '0.68rem', color: '#A1A1AA', marginTop: '2px' }}>
                                    Low: {lowSizes.join(', ')}
                                  </p>
                                )}
                              </div>
                            );
                          })()}
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
          </div>
        </>
      )}

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
                    <>
                      <div>
                        <label style={LABEL}>Clothing Category *</label>
                        <select
                          value={form.clothing_type}
                          onChange={e => setForm(f => ({ ...f, clothing_type: e.target.value }))}
                          style={{ ...INPUT, cursor: 'pointer' }}
                        >
                          {clothingCategories.map(ct => (
                            <option key={ct.value} value={ct.value} style={{ background: '#18181B' }}>
                              {ct.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dynamic Sub-Selector for Tops & Sleeves */}
                      {form.clothing_type === 'tops_sleeves' && (
                        <div style={{ background: '#141416', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 200, 0, 0.25)' }}>
                          <label style={{ ...LABEL, color: '#FFC800' }}>Sleeve / Top Type *</label>
                          <select
                            value={form.sleeve_type}
                            onChange={e => setForm(f => ({ ...f, sleeve_type: e.target.value }))}
                            style={{ ...INPUT, cursor: 'pointer' }}
                          >
                            {topsSleevesSubOptions.map(opt => (
                              <option key={opt.value} value={opt.value} style={{ background: '#18181B' }}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Dynamic Sub-Selector for Jeans & Pants */}
                      {form.clothing_type === 'jeans_pants' && (
                        <div style={{ background: '#141416', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 200, 0, 0.25)' }}>
                          <label style={{ ...LABEL, color: '#FFC800' }}>Jeans & Pants Style / Cut *</label>
                          <select
                            value={form.fit}
                            onChange={e => setForm(f => ({ ...f, fit: e.target.value }))}
                            style={{ ...INPUT, cursor: 'pointer' }}
                          >
                            {jeansSubOptions.map(opt => (
                              <option key={opt.value} value={opt.value} style={{ background: '#18181B' }}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* ─── Size & Per-Size Stock Matrix (Clothing) ─── */}
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label style={{ ...LABEL, marginBottom: 0, fontWeight: 700, color: '#FFC800' }}>
                            Available Sizes & Stock Quantity per Size
                          </label>
                          {Object.keys(form.size_inventory || {}).length > 0 && (
                            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                              Total Stock: {Object.values(form.size_inventory || {}).reduce((a: number, b: number) => a + (Number(b) || 0), 0)} pcs
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.72rem', color: '#71717A', marginBottom: '0.65rem' }}>
                          Click sizes to activate/deactivate, then enter the available stock count for each size:
                        </p>

                        {/* Size Selection Pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                          {clothingSizes.map(s => {
                            const isSelected = form.size_inventory && form.size_inventory[s] !== undefined;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setForm(f => {
                                    const updated: Record<string, number> = { ...(f.size_inventory || {}) };
                                    if (isSelected) {
                                      delete updated[s];
                                    } else {
                                      updated[s] = 5;
                                    }
                                    const total = Object.values(updated).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
                                    return {
                                      ...f,
                                      size_inventory: updated,
                                      stock_quantity: total.toString(),
                                      size: Object.keys(updated).join(', '),
                                    };
                                  });
                                }}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '6px',
                                  border: isSelected ? '1.5px solid #FFC800' : '1px solid #27272A',
                                  background: isSelected ? '#FFC800' : '#18181B',
                                  color: isSelected ? '#000000' : '#D4D4D8',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {s} {isSelected && `(${form.size_inventory[s] ?? 0})`}
                              </button>
                            );
                          })}
                        </div>

                        {/* Per-Size Stock Input Grid */}
                        {form.size_inventory && Object.keys(form.size_inventory).length > 0 && (
                          <div style={{ background: '#121215', border: '1px solid #27272A', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Stock Count per Active Size
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const val = prompt('Enter stock quantity to apply to all selected sizes:', '10');
                                  if (val !== null && !isNaN(parseInt(val))) {
                                    const qty = Math.max(0, parseInt(val));
                                    setForm(f => {
                                      const updated: Record<string, number> = {};
                                      Object.keys(f.size_inventory || {}).forEach(k => {
                                        updated[k] = qty;
                                      });
                                      const total = Object.values(updated).reduce((a, b) => a + Number(b || 0), 0);
                                      return { ...f, size_inventory: updated, stock_quantity: total.toString() };
                                    });
                                  }
                                }}
                                style={{ background: 'none', border: 'none', color: '#FFC800', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                              >
                                Apply quantity to all...
                              </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.5rem' }}>
                              {Object.keys(form.size_inventory).map(sz => (
                                <div key={sz} style={{ background: '#18181C', border: '1px solid #27272A', borderRadius: '6px', padding: '0.45rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#FFC800' }}>{sz}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <input
                                      type="number"
                                      min="0"
                                      value={form.size_inventory[sz]}
                                      onChange={e => {
                                        const val = Math.max(0, parseInt(e.target.value) || 0);
                                        setForm(f => {
                                          const updated = { ...(f.size_inventory || {}), [sz]: val };
                                          const total = Object.values(updated).reduce((a, b) => a + Number(b || 0), 0);
                                          return { ...f, size_inventory: updated, stock_quantity: total.toString() };
                                        });
                                      }}
                                      style={{
                                        width: '50px',
                                        background: '#0A0A0C',
                                        border: '1px solid #3F3F46',
                                        borderRadius: '4px',
                                        color: '#FFFFFF',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        padding: '2px 4px',
                                        outline: 'none',
                                      }}
                                    />
                                    <span style={{ fontSize: '0.65rem', color: '#71717A' }}>pcs</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Footwear-specific Size Matrix */}
                  {['sneakers', 'slides'].includes(form.category) && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <label style={{ ...LABEL, marginBottom: 0, fontWeight: 700, color: '#FFC800' }}>
                          Available EU Shoe Sizes & Stock Quantity
                        </label>
                        {Object.keys(form.size_inventory || {}).length > 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                            Total Stock: {Object.values(form.size_inventory || {}).reduce((a, b) => a + Number(b || 0), 0)} pairs
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
                        {shoeSizes.map(s => {
                          const isSelected = form.size_inventory && form.size_inventory[s] !== undefined;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setForm(f => {
                                  const updated = { ...(f.size_inventory || {}) };
                                  if (isSelected) {
                                    delete updated[s];
                                  } else {
                                    updated[s] = 3;
                                  }
                                  const total = Object.values(updated).reduce((a, b) => a + Number(b || 0), 0);
                                  return {
                                    ...f,
                                    size_inventory: updated,
                                    stock_quantity: total.toString(),
                                    size: Object.keys(updated).join(', '),
                                  };
                                });
                              }}
                              style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                border: isSelected ? '1.5px solid #FFC800' : '1px solid #27272A',
                                background: isSelected ? '#FFC800' : '#18181B',
                                color: isSelected ? '#000000' : '#D4D4D8',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              EU {s} {isSelected && `(${form.size_inventory[s] ?? 0})`}
                            </button>
                          );
                        })}
                      </div>

                      {form.size_inventory && Object.keys(form.size_inventory).length > 0 && (
                        <div style={{ background: '#121215', border: '1px solid #27272A', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '0.5rem' }}>
                            {Object.keys(form.size_inventory).map(sz => (
                              <div key={sz} style={{ background: '#18181C', border: '1px solid #27272A', borderRadius: '6px', padding: '0.45rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#FFC800' }}>EU {sz}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <input
                                    type="number"
                                    min="0"
                                    value={form.size_inventory[sz]}
                                    onChange={e => {
                                      const val = Math.max(0, parseInt(e.target.value) || 0);
                                      setForm(f => {
                                        const updated = { ...(f.size_inventory || {}), [sz]: val };
                                        const total = Object.values(updated).reduce((a, b) => a + Number(b || 0), 0);
                                        return { ...f, size_inventory: updated, stock_quantity: total.toString() };
                                      });
                                    }}
                                    style={{
                                      width: '50px',
                                      background: '#0A0A0C',
                                      border: '1px solid #3F3F46',
                                      borderRadius: '4px',
                                      color: '#FFFFFF',
                                      fontSize: '0.8rem',
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      padding: '2px 4px',
                                      outline: 'none',
                                    }}
                                  />
                                  <span style={{ fontSize: '0.65rem', color: '#71717A' }}>pairs</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label style={{ ...LABEL, marginBottom: 0 }}>Stock Quantity *</label>
                      {Object.keys(form.size_inventory || {}).length > 0 && (
                        <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                          ✓ In Sync ({Object.values(form.size_inventory || {}).reduce((a: number, b: number) => a + (Number(b) || 0), 0)} total)
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={Object.keys(form.size_inventory || {}).length > 0
                        ? Object.values(form.size_inventory || {}).reduce((a: number, b: number) => a + (Number(b) || 0), 0).toString()
                        : form.stock_quantity
                      }
                      disabled={Object.keys(form.size_inventory || {}).length > 0}
                      onChange={e => {
                        const val = e.target.value;
                        setForm(f => ({ ...f, stock_quantity: val }));
                      }}
                      placeholder="0"
                      style={{
                        ...INPUT,
                        background: Object.keys(form.size_inventory || {}).length > 0 ? '#141417' : '#18181B',
                        color: Object.keys(form.size_inventory || {}).length > 0 ? '#FFC800' : '#FFFFFF',
                        fontWeight: 700,
                        cursor: Object.keys(form.size_inventory || {}).length > 0 ? 'not-allowed' : 'text',
                        borderColor: Object.keys(form.size_inventory || {}).length > 0 ? 'rgba(255, 200, 0, 0.3)' : '#27272A',
                      }}
                      onFocus={e => e.target.style.borderColor = '#FFC800'}
                      onBlur={e => e.target.style.borderColor = Object.keys(form.size_inventory || {}).length > 0 ? 'rgba(255, 200, 0, 0.3)' : '#27272A'}
                    />
                    {Object.keys(form.size_inventory || {}).length > 0 && (
                      <p style={{ fontSize: '0.7rem', color: '#71717A', marginTop: '0.35rem' }}>
                        Total quantity is automatically synchronized with the per-size breakdown configured above.
                      </p>
                    )}
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
