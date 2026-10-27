'use client';

import { useEffect, useState } from 'react';
import { convertToWebP } from '@/lib/imageUtils';
import { ItemCardsSkeleton } from '../components/DashboardSkeletons';

interface Project {
  id: number;
  nama: string;
  keterangan: string;
  foto1: string;
  foto2?: string;
  foto3?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [nama, setNama] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);
  const [preview1, setPreview1] = useState('');
  const [preview2, setPreview2] = useState('');
  const [preview3, setPreview3] = useState('');
  const [saving, setSaving] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
      else throw new Error('Projects API returned an invalid response');
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => loadProjects(), 0);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setNama(project.nama || '');
      setKeterangan(project.keterangan || '');
      setPreview1(project.foto1 || '');
      setPreview2(project.foto2 || '');
      setPreview3(project.foto3 || '');
    } else {
      setEditingProject(null);
      setNama('');
      setKeterangan('');
      setPreview1('');
      setPreview2('');
      setPreview3('');
    }
    setFile1(null);
    setFile2(null);
    setFile3(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingProject(null); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, num: number) => {
    const f = e.target.files?.[0];
    if (f) {
      setIsConverting(true);
      try {
        const webpFile = await convertToWebP(f);
        if (num === 1) setFile1(webpFile);
        if (num === 2) setFile2(webpFile);
        if (num === 3) setFile3(webpFile);
        
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (num === 1) setPreview1(ev.target?.result as string);
          if (num === 2) setPreview2(ev.target?.result as string);
          if (num === 3) setPreview3(ev.target?.result as string);
        };
        reader.readAsDataURL(webpFile);
      } catch (err) {
        console.error('Conversion failed:', err);
      } finally {
        setIsConverting(false);
      }
    }
  };

  const removePhoto = (num: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (num === 1) { setFile1(null); setPreview1(''); }
    if (num === 2) { setFile2(null); setPreview2(''); }
    if (num === 3) { setFile3(null); setPreview3(''); }
  };

  const saveProject = async () => {
    setSaving(true);
    const Swal = (await import('sweetalert2')).default;
    try {
      let url1 = preview1 ? (editingProject?.foto1 || '') : '';
      let url2 = preview2 ? (editingProject?.foto2 || '') : '';
      let url3 = preview3 ? (editingProject?.foto3 || '') : '';

      const uploadFile = async (f: File) => {
        const formData = new FormData();
        formData.append('file', f);
        formData.append('folder', 'projects');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data.url;
      };

      if (file1) url1 = await uploadFile(file1);
      if (file2) url2 = await uploadFile(file2);
      if (file3) url3 = await uploadFile(file3);

      const body = { nama, keterangan, foto1: url1, foto2: url2, foto3: url3 };
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }

      Swal.fire('Success', editingProject ? 'Project updated!' : 'Project added!', 'success');
      closeModal();
      loadProjects();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      Swal.fire('Error', message, 'error');
    }
    setSaving(false);
  };

  const deleteProject = async (id: number) => {
    const Swal = (await import('sweetalert2')).default;
    const result = await Swal.fire({
      title: 'Delete Project?', text: 'This action cannot be undone.', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete',
    });
    if (result.isConfirmed) {
      try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        Swal.fire('Deleted', 'Project deleted.', 'success');
        loadProjects();
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
          <h3 className="card-title">Manage Projects</h3>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <i className="bi bi-plus"></i> Add Project
          </button>
        </div>
        <div className="card-body" aria-busy={loading}>
          {loading ? (
            <ItemCardsSkeleton />
          ) : loadError ? (
            <div className="dashboard-load-error" role="alert">
              <p>{loadError}</p>
              <button className="btn btn-primary" onClick={() => void loadProjects()}>Try Again</button>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><i className="bi bi-folder"></i></div>
              <h3 className="empty-title">No Projects Yet</h3>
              <p className="empty-text">Add your first project to showcase your work</p>
              <button className="btn btn-primary" onClick={() => openModal()}><i className="bi bi-plus"></i> Add Project</button>
            </div>
          ) : (
            <div className="items-grid">
              {projects.map((p) => (
                <div className="item-card" key={p.id}>
                  <img src={p.foto1 || 'https://via.placeholder.com/400x200'} alt={p.nama} className="item-image" />
                  <div className="item-content">
                    <h4 className="item-title">{p.nama}</h4>
                    <p className="item-description">{p.keterangan || 'No description'}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openModal(p)}><i className="bi bi-pencil"></i> Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProject(p.id)}><i className="bi bi-trash"></i> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">{editingProject ? 'Edit Project' : 'Add Project'}</h3>
              <button className="modal-close" onClick={closeModal}><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Project</label>
                <input type="text" className="form-control" value={nama} onChange={(e) => setNama(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Keterangan</label>
                <textarea className="form-control" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} rows={3}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Foto 1 (Utama)</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 1)} />
                  <i className="bi bi-cloud-upload"></i>
                  <span>Click or drag image here</span>
                  {preview1 && (
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <img src={preview1} className="file-preview" style={{ display: 'block', maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', margin: '0 auto' }} alt="Preview 1" />
                      <button 
                        type="button"
                        style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', padding: 0, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 20 }} 
                        onClick={(e) => removePhoto(1, e)}
                        title="Hapus Foto"
                      >
                        <i className="bi bi-trash" style={{ fontSize: '16px', margin: 0, color: '#fff' }}></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Foto 2 (Opsional)</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 2)} />
                  <i className="bi bi-cloud-upload"></i>
                  <span>Click or drag image here</span>
                  {preview2 && (
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <img src={preview2} className="file-preview" style={{ display: 'block', maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', margin: '0 auto' }} alt="Preview 2" />
                      <button 
                        type="button"
                        style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', padding: 0, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 20 }} 
                        onClick={(e) => removePhoto(2, e)}
                        title="Hapus Foto"
                      >
                        <i className="bi bi-trash" style={{ fontSize: '16px', margin: 0, color: '#fff' }}></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Upload Foto 3 (Opsional)</label>
                <div className="file-upload">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 3)} />
                  <i className="bi bi-cloud-upload"></i>
                  <span>Click or drag image here</span>
                  {preview3 && (
                    <div style={{ position: 'relative', zIndex: 10 }}>
                      <img src={preview3} className="file-preview" style={{ display: 'block', maxWidth: '100%', maxHeight: '250px', objectFit: 'contain', margin: '0 auto' }} alt="Preview 3" />
                      <button 
                        type="button"
                        style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', padding: 0, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 20 }} 
                        onClick={(e) => removePhoto(3, e)}
                        title="Hapus Foto"
                      >
                        <i className="bi bi-trash" style={{ fontSize: '16px', margin: 0, color: '#fff' }}></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={saveProject} disabled={saving || isConverting}>
                {isConverting ? <><i className="bi bi-arrow-repeat"></i> Processing...</> : 
                 saving ? <><i className="bi bi-arrow-repeat"></i> Saving...</> : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
