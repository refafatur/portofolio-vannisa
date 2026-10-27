'use client';

import { useEffect, useState } from 'react';
import { convertToWebP } from '@/lib/imageUtils';
import { ItemCardsSkeleton } from '../components/DashboardSkeletons';

interface GalleryItem {
  id: number;
  foto: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const loadGallery = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error(`Failed to load gallery (${res.status})`);
      const data = await res.json();
      if (Array.isArray(data)) setGallery(data);
      else throw new Error('Gallery API returned an invalid response');
    } catch (error) {
      console.error('Error loading gallery:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { loadGallery(); }, 0);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (image?: GalleryItem) => {
    if (image) {
      setEditingImage(image);
      setPreview(image.foto || '');
    } else {
      setEditingImage(null);
      setPreview('');
    }
    setFile(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingImage(null); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const webpFile = await convertToWebP(f);
      setFile(webpFile);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(webpFile);
    }
  };

  const saveImage = async () => {
    setSaving(true);
    const Swal = (await import('sweetalert2')).default;
    try {
      let fotoUrl = editingImage?.foto || '';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'gallery');
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        fotoUrl = uploadData.url;
      }

      if (!fotoUrl) {
        Swal.fire('Error', 'Please select an image to upload', 'error');
        setSaving(false);
        return;
      }

      const body = { foto: fotoUrl };
      const url = editingImage ? `/api/gallery/${editingImage.id}` : '/api/gallery';
      const method = editingImage ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }

      Swal.fire('Success', editingImage ? 'Image updated!' : 'Image added!', 'success');
      closeModal();
      loadGallery();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Swal.fire('Error', message, 'error');
    }
    setSaving(false);
  };

  const deleteImage = async (id: number) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'Delete Image?', text: 'This action cannot be undone.', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete',
    });
    if (result.isConfirmed) {
      try {
        await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        Swal.fire('Deleted', 'Image deleted.', 'success');
        loadGallery();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        Swal.fire('Error', message, 'error');
      }
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Manage Gallery</h3>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <i className="bi bi-plus"></i> Add Image
          </button>
        </div>
        <div className="card-body" aria-busy={loading}>
          {loading ? (
            <ItemCardsSkeleton />
          ) : loadError ? (
            <div className="dashboard-load-error" role="alert">
              <p>{loadError}</p>
              <button className="btn btn-primary" onClick={() => void loadGallery()}>Try Again</button>
            </div>
          ) : gallery.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><i className="bi bi-images"></i></div>
              <h3 className="empty-title">No Images Yet</h3>
              <p className="empty-text">Add your first image to showcase your gallery</p>
              <button className="btn btn-primary" onClick={() => openModal()}><i className="bi bi-plus"></i> Add Image</button>
            </div>
          ) : (
            <div className="items-grid">
              {gallery.map((g) => (
                <div className="item-card" key={g.id}>
                  <img src={g.foto || 'https://via.placeholder.com/400x200'} alt="Gallery Image" className="item-image" />
                  <div className="item-content">
                    <h4 className="item-title">Gallery Image #{g.id}</h4>
                    <p className="item-description"><a href={g.foto} target="_blank">View Full Image</a></p>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openModal(g)}><i className="bi bi-pencil"></i> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteImage(g.id)}><i className="bi bi-trash"></i> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">{editingImage ? 'Edit Image' : 'Add Image'}</h3>
              <button className="modal-close" onClick={closeModal}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Upload Foto</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <i className="bi bi-cloud-upload"></i>
                  <span>Click or drag image here</span>
                  {preview && <img src={preview} className="file-preview" style={{ display: 'block' }} alt="Preview" />}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={saveImage} disabled={saving}>
                {saving ? <><i className="bi bi-arrow-repeat"></i> Saving...</> : 'Save Image'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
