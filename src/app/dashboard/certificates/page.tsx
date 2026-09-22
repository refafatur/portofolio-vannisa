'use client';

import { useEffect, useState } from 'react';
import { convertToWebP } from '@/lib/imageUtils';

interface Certificate {
  id: number;
  nama: string;
  foto: string;
  file: string;
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [nama, setNama] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [certFileName, setCertFileName] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCerts = async () => {
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      if (Array.isArray(data)) setCerts(data);
    } catch (error) { console.error('Error:', error); }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadCerts(), 0);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      setNama(cert.nama || '');
      setFotoPreview(cert.foto || '');
      setCertFileName(cert.file ? 'Current file attached' : '');
    } else {
      setEditingCert(null);
      setNama('');
      setFotoPreview('');
      setCertFileName('');
    }
    setFotoFile(null);
    setCertFile(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingCert(null); };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const webpFile = await convertToWebP(f);
      setFotoFile(webpFile);
      const reader = new FileReader();
      reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
      reader.readAsDataURL(webpFile);
    }
  };

  const handleCertFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const processedFile = f.type.startsWith('image/') ? await convertToWebP(f) : f;
      setCertFile(processedFile);
      setCertFileName(processedFile.name);
    }
  };

  const saveCert = async () => {
    setSaving(true);
    const Swal = (await import('sweetalert2')).default;
    try {
      let fotoUrl = editingCert?.foto || '';
      let fileUrl = editingCert?.file || '';

      if (fotoFile) {
        const formData = new FormData();
        formData.append('file', fotoFile);
        formData.append('folder', 'certificates/thumbnails');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        fotoUrl = data.url;
      }

      if (certFile) {
        const formData = new FormData();
        formData.append('file', certFile);
        formData.append('folder', 'certificates/files');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        fileUrl = data.url;
      }

      const body = { nama, foto: fotoUrl, file: fileUrl };
      const url = editingCert ? `/api/certificates/${editingCert.id}` : '/api/certificates';
      const method = editingCert ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }

      Swal.fire('Success', editingCert ? 'Certificate updated!' : 'Certificate added!', 'success');
      closeModal();
      loadCerts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Swal.fire('Error', message, 'error');
    }
    setSaving(false);
  };

  const deleteCert = async (id: number) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'Delete Certificate?', text: 'This action cannot be undone.', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete',
    });
    if (result.isConfirmed) {
      try {
        await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
        Swal.fire('Deleted', 'Certificate deleted.', 'success');
        loadCerts();
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
          <h3 className="card-title">Manage Certificates</h3>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <i className="bi bi-plus"></i> Add Certificate
          </button>
        </div>
        <div className="card-body">
          {certs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><i className="bi bi-award"></i></div>
              <h3 className="empty-title">No Certificates Yet</h3>
              <p className="empty-text">Add your first certificate to showcase your achievements</p>
              <button className="btn btn-primary" onClick={() => openModal()}><i className="bi bi-plus"></i> Add Certificate</button>
            </div>
          ) : (
            <div className="items-grid">
              {certs.map((c) => (
                <div className="item-card" key={c.id}>
                  <img src={c.foto || 'https://via.placeholder.com/400x200'} alt={c.nama} className="item-image" />
                  <div className="item-content">
                    <h4 className="item-title">{c.nama}</h4>
                    <p className="item-description">{c.file ? <a href={c.file} target="_blank">View Certificate</a> : 'No file attached'}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openModal(c)}><i className="bi bi-pencil"></i> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteCert(c.id)}><i className="bi bi-trash"></i> Delete</button>
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
              <h3 className="modal-title">{editingCert ? 'Edit Certificate' : 'Add Certificate'}</h3>
              <button className="modal-close" onClick={closeModal}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Certificate</label>
                <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Upload Foto (Thumbnail)</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={handleFotoChange} />
                  <i className="bi bi-image"></i>
                  <span>Click or drag image here</span>
                  {fotoPreview && <img src={fotoPreview} className="file-preview" style={{ display: 'block' }} alt="Preview" />}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload File (PDF/Image)</label>
                <div className="file-upload">
                  <input type="file" accept="image/*,.pdf" onChange={handleCertFileChange} />
                  <i className="bi bi-file-earmark-arrow-up"></i>
                  <span>Click or drag file here (PDF or Image)</span>
                  {certFileName && <div className="file-name">{certFileName}</div>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={saveCert} disabled={saving}>
                {saving ? <><i className="bi bi-arrow-repeat"></i> Saving...</> : 'Save Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
