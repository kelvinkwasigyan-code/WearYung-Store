'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Upload,
  ImagePlus, FileText, Tag, Loader2, AlertCircle, CheckCircle2,
  ToggleLeft, ToggleRight, LayoutTemplate
} from 'lucide-react';

// Shared styles
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

// Tagged Item Type
interface TaggedItem {
  name: string;
  price: string;
  category: string;
  slug: string;
}

// ─── Image Upload Component ───────────────────────────────────
function SingleImageUploader({
  image,
  setImage,
}: {
  image: { url: string; uploading?: boolean; file?: File } | null;
  setImage: React.Dispatch<React.SetStateAction<{ url: string; uploading?: boolean; file?: File } | null>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    const tempId = URL.createObjectURL(file);
    setImage({ url: tempId, uploading: true, file });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setImage({ url: data.url, uploading: false });
    } catch (err: any) {
      console.error('Upload error:', err);
      setImage(null);
      alert(`Upload failed: ${err.message}`);
    }
  }, [setImage]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type.startsWith('image/')) uploadFile(file);
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  return (
    <div>
      <label style={LABEL}>
        <ImagePlus size={12} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
        Lookbook Image *
      </label>

      {image ? (
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #27272A',
          background: '#18181B',
        }}>
          {image.uploading ? (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '0.3rem',
            }}>
              <Loader2 size={24} className="spin" style={{ color: '#FFC800', animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.75rem', color: '#71717A' }}>Uploading...</span>
            </div>
          ) : (
            <>
              <img
                src={image.url}
                alt="Uploaded"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '24px', height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ef4444',
                }}
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#FFC800' : '#27272A'}`,
            borderRadius: '10px',
            padding: '3rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(255,200,0,0.04)' : '#111113',
            transition: 'all 0.2s',
          }}
        >
          <Upload size={28} style={{ color: dragOver ? '#FFC800' : '#3F3F46', margin: '0 auto 0.5rem' }} />
          <p style={{ fontSize: '0.82rem', color: '#71717A', margin: 0 }}>
            Drag & drop a high-res photo here
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
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
    }}>
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

// ─── Main Admin Lookbook Page ─────────────────────────────────
export default function AdminLookbookPage() {
  const supabase = createClient();
  const [lookbooks, setLookbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    season: '',
    category: '',
    description: '',
    aspect_ratio: 'tall',
    is_published: true,
  });
  const [formImage, setFormImage] = useState<{ url: string; uploading?: boolean; file?: File } | null>(null);
  const [taggedItems, setTaggedItems] = useState<TaggedItem[]>([]);

  const fetchLookbooks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lookbooks')
      .select('*')
      .order('created_at', { ascending: false });
    setLookbooks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLookbooks(); }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm({
      title: '', season: 'VOL. 01 — DROP 05', category: '',
      description: '', aspect_ratio: 'tall', is_published: true,
    });
    setFormImage(null);
    setTaggedItems([]);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title, season: item.season, category: item.category,
      description: item.description || '', aspect_ratio: item.aspect_ratio,
      is_published: item.is_published,
    });
    setFormImage({ url: item.image_url });
    setTaggedItems(item.tagged_items || []);
    setShowForm(true);
  };

  const handleAddTag = () => {
    setTaggedItems([...taggedItems, { name: '', price: '', category: '', slug: '' }]);
  };

  const handleRemoveTag = (index: number) => {
    setTaggedItems(taggedItems.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, field: keyof TaggedItem, value: string) => {
    const newTags = [...taggedItems];
    newTags[index][field] = value;
    setTaggedItems(newTags);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !formImage || formImage.uploading) {
      setToast({ message: 'Title and image are required.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        season: form.season.trim(),
        category: form.category.trim(),
        description: form.description.trim() || null,
        image_url: formImage.url,
        aspect_ratio: form.aspect_ratio,
        is_published: form.is_published,
        tagged_items: taggedItems.filter(t => t.name.trim() !== ''),
      };

      if (editingItem) {
        const { error } = await supabase.from('lookbooks').update(payload).eq('id', editingItem.id);
        if (error) throw error;
        setToast({ message: 'Lookbook updated!', type: 'success' });
      } else {
        const { error } = await supabase.from('lookbooks').insert(payload);
        if (error) throw error;
        setToast({ message: 'Lookbook created!', type: 'success' });
      }

      await fetchLookbooks();
      setShowForm(false);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await supabase.from('lookbooks').delete().eq('id', id);
    setToast({ message: `"${title}" deleted.`, type: 'success' });
    fetchLookbooks();
  };

  const togglePublish = async (id: string, current: boolean, title: string) => {
    await supabase.from('lookbooks').update({ is_published: !current }).eq('id', id);
    setToast({ message: `"${title}" ${!current ? 'published' : 'hidden'}.`, type: 'success' });
    fetchLookbooks();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#fff' }}>
            LOOKBOOK
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.85rem' }}>Manage editorial features and curated looks</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.25rem', background: '#FFC800', color: '#000',
            border: 'none', borderRadius: '8px', fontFamily: 'var(--font-display)',
            fontSize: '0.85rem', cursor: 'pointer', fontWeight: 700,
          }}
        >
          <Plus size={16} /> ADD LOOK
        </button>
      </div>

      {/* Lookbooks Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#3F3F46' }}>Loading lookbooks...</div>
      ) : lookbooks.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#3F3F46', background: '#0D0D0D', borderRadius: '12px', border: '1px solid #1A1A1A' }}>
          No lookbooks found. Add your first one!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {lookbooks.map(item => (
            <div key={item.id} style={{ background: '#0D0D0D', border: '1px solid #1A1A1A', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#111113' }}>
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.style.display = 'flex';
                      e.currentTarget.parentElement.style.alignItems = 'center';
                      e.currentTarget.parentElement.style.justifyContent = 'center';
                      if (!e.currentTarget.parentElement.querySelector('.broken-img-text')) {
                        const span = document.createElement('span');
                        span.className = 'broken-img-text';
                        span.style.color = '#71717A';
                        span.style.fontSize = '0.75rem';
                        span.style.fontFamily = 'var(--font-body)';
                        span.textContent = 'Image Unavailable';
                        e.currentTarget.parentElement.appendChild(span);
                      }
                    }
                  }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px' }}>
                  <span style={{ background: 'rgba(0,0,0,0.7)', color: '#FFC800', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                    {item.season}
                  </span>
                  {!item.is_published && (
                    <span style={{ background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                      HIDDEN
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.75rem', color: '#71717A', marginBottom: '1rem' }}>{item.category}</p>
                
                <div style={{ fontSize: '0.75rem', color: '#A1A1AA', marginBottom: '1.5rem', flex: 1 }}>
                  {item.tagged_items?.length || 0} tagged items
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #1A1A1A', paddingTop: '1rem' }}>
                  <button onClick={() => togglePublish(item.id, item.is_published, item.title)} style={{ flex: 1, padding: '0.4rem', background: '#18181B', border: '1px solid #27272A', borderRadius: '6px', color: item.is_published ? '#10B981' : '#71717A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    {item.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(item)} style={{ flex: 1, padding: '0.4rem', background: '#18181B', border: '1px solid #27272A', borderRadius: '6px', color: '#FFC800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id, item.title)} style={{ flex: 1, padding: '0.4rem', background: '#18181B', border: '1px solid #27272A', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Slide-in Form ─────────────────────────────────────────── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={() => setShowForm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '100%', maxWidth: '540px', background: '#0A0A0A',
            borderLeft: '1px solid #1A1A1A', overflowY: 'auto',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: '#fff' }}>
                {editingItem ? 'EDIT LOOK' : 'NEW LOOK'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              {/* Basic Info */}
              <div>
                <p style={{ fontSize: '0.7rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={12} /> Basic Details
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={LABEL}>Title *</label>
                    <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={INPUT} />
                  </div>
                  <div style={ROW}>
                    <div>
                      <label style={LABEL}>Season/Drop</label>
                      <input type="text" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })} style={INPUT} />
                    </div>
                    <div>
                      <label style={LABEL}>Category Display</label>
                      <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. STREETWEAR" style={INPUT} />
                    </div>
                  </div>
                  <div>
                    <label style={LABEL}>Description</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...INPUT, resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={LABEL}>Aspect Ratio</label>
                    <select value={form.aspect_ratio} onChange={e => setForm({ ...form, aspect_ratio: e.target.value })} style={{ ...INPUT, cursor: 'pointer' }}>
                      <option value="tall">Tall (Portrait)</option>
                      <option value="square">Square</option>
                      <option value="wide">Wide (Landscape)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', background: '#1A1A1A' }} />

              {/* Image */}
              <SingleImageUploader image={formImage} setImage={setFormImage} />

              <div style={{ height: '1px', background: '#1A1A1A' }} />

              {/* Tagged Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: '#FFC800', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                    <Tag size={12} /> Tagged Products
                  </p>
                  <button onClick={handleAddTag} type="button" style={{ fontSize: '0.7rem', color: '#fff', background: '#18181B', border: '1px solid #27272A', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                    + Add Product
                  </button>
                </div>
                
                {taggedItems.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#71717A', fontStyle: 'italic' }}>No products tagged yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {taggedItems.map((tag, i) => (
                      <div key={i} style={{ background: '#111113', padding: '1rem', borderRadius: '8px', border: '1px solid #27272A', position: 'relative' }}>
                        <button onClick={() => handleRemoveTag(i)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={14}/></button>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <label style={{ ...LABEL, fontSize: '0.6rem' }}>Display Name</label>
                            <input value={tag.name} onChange={e => handleTagChange(i, 'name', e.target.value)} style={{ ...INPUT, padding: '0.5rem', fontSize: '0.8rem' }} />
                          </div>
                          <div>
                            <label style={{ ...LABEL, fontSize: '0.6rem' }}>Display Price (e.g. GH₵ 45,000)</label>
                            <input value={tag.price} onChange={e => handleTagChange(i, 'price', e.target.value)} style={{ ...INPUT, padding: '0.5rem', fontSize: '0.8rem' }} />
                          </div>
                          <div>
                            <label style={{ ...LABEL, fontSize: '0.6rem' }}>Category (for link)</label>
                            <input value={tag.category} onChange={e => handleTagChange(i, 'category', e.target.value)} placeholder="clothing" style={{ ...INPUT, padding: '0.5rem', fontSize: '0.8rem' }} />
                          </div>
                          <div>
                            <label style={{ ...LABEL, fontSize: '0.6rem' }}>Slug (optional)</label>
                            <input value={tag.slug} onChange={e => handleTagChange(i, 'slug', e.target.value)} style={{ ...INPUT, padding: '0.5rem', fontSize: '0.8rem' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Save Footer */}
            <div style={{ position: 'sticky', bottom: 0, padding: '1.25rem 1.75rem', background: '#0A0A0A', borderTop: '1px solid #1A1A1A', display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '0.85rem', background: '#18181B', color: '#A1A1AA', border: '1px solid #27272A', borderRadius: '8px', cursor: 'pointer' }}>
                CANCEL
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '0.85rem', background: saving ? '#3F3F46' : '#FFC800', color: '#000', border: 'none', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
                {saving ? 'SAVING...' : 'SAVE LOOKBOOK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
