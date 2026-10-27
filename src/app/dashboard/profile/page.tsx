'use client';

import { useEffect, useState } from 'react';
import { ProfileData, defaultProfile, calculateAge } from '@/lib/profileData';

export default function EditProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [rolesInput, setRolesInput] = useState('');

  // Change password state
  const [pwSection, setPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          const autoAge = String(calculateAge('2004-05-18'));
          setProfile({ ...data, age: autoAge });
          setRolesInput((data.roles || []).join(', '));
          setAvatarPreview(data.avatarUrl || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('File harus berupa PDF');
        return;
      }
      setCvFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const Swal = (await import('sweetalert2')).default;

    try {
      let finalAvatarUrl = profile.avatarUrl;
      let finalCvUrl = profile.cvUrl;

      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('folder', 'profile/avatars');
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Gagal upload avatar');
        finalAvatarUrl = uploadData.url;
      }

      // Upload CV PDF if provided
      if (cvFile) {
        const formData = new FormData();
        formData.append('file', cvFile);
        formData.append('folder', 'profile/cv');
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Gagal upload CV PDF');
        finalCvUrl = uploadData.url;
      }

      const rolesArray = rolesInput
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);

      const payload: ProfileData = {
        ...profile,
        age: String(calculateAge('2004-05-18')),
        roles: rolesArray.length > 0 ? rolesArray : profile.roles,
        avatarUrl: finalAvatarUrl,
        cvUrl: finalCvUrl,
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menyimpan profil');

      setProfile(payload);
      setCvFile(null);
      setAvatarFile(null);

      // Update adminName in localStorage if nama changed
      if (payload.nama) {
        localStorage.setItem('adminName', payload.nama);
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Profil dan CV berhasil diperbarui!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      Swal.fire('Gagal', msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const Swal = (await import('sweetalert2')).default;

    if (newPw !== confirmPw) {
      Swal.fire('Gagal', 'Konfirmasi password tidak sesuai.', 'error');
      return;
    }
    if (newPw.length < 6) {
      Swal.fire('Gagal', 'Password baru minimal 6 karakter.', 'error');
      return;
    }

    setChangingPw(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah password');

      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setPwSection(false);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Password berhasil diperbarui!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan';
      Swal.fire('Gagal', msg, 'error');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <i className="bi bi-arrow-repeat spin" style={{ fontSize: '2rem', color: 'var(--db-primary)' }}></i>
        <p style={{ marginTop: '12px', color: 'var(--db-text-muted)' }}>Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* ── Edit Profil Card ── */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-person-gear" style={{ color: 'var(--db-primary)' }}></i> Edit Profil &amp; CV
            </h3>
            <p style={{ color: 'var(--db-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Perbarui identitas, kontak, info bio, foto profil, dan upload dokumen CV PDF Anda. Data disimpan ke database.
            </p>
          </div>
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="bi bi-file-earmark-pdf"></i> Lihat CV Saat Ini
            </a>
          )}
        </div>

        <div className="card-body">
          <form onSubmit={handleSave}>
            {/* Foto & CV Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--db-border)' }}>
              {/* Foto Profil */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--db-primary)', background: '#222', flexShrink: 0 }}>
                  <img
                    src={avatarPreview || profile.avatarUrl || '/image/me.png'}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Foto Profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <small style={{ color: 'var(--db-text-muted)', display: 'block', marginTop: '4px' }}>
                    Format: JPG, PNG, WebP
                  </small>
                </div>
              </div>

              {/* Upload CV PDF */}
              <div style={{ padding: '16px', background: 'var(--db-bg-alt, rgba(255,255,255,0.03))', borderRadius: '12px', border: '1px dashed var(--db-border)' }}>
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <i className="bi bi-file-earmark-pdf-fill" style={{ color: '#ef4444' }}></i> Upload CV (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleCvChange}
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                />
                <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--db-text-muted)' }}>
                  {cvFile ? (
                    <span style={{ color: 'var(--db-primary)', fontWeight: 500 }}>
                      <i className="bi bi-check-circle me-1"></i> File terpilih: {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)
                    </span>
                  ) : profile.cvUrl ? (
                    <span>
                      <i className="bi bi-file-check me-1 text-success"></i> CV aktif tersimpan. Upload file baru jika ingin mengganti.
                    </span>
                  ) : (
                    <span>Belum ada CV PDF yang diupload.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Field Informasi Utama */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={profile.nama}
                  onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                  className="form-control"
                  placeholder="Contoh: Vannisa Maulvi"
                />
              </div>

              <div>
                <label className="form-label">Title / Headline</label>
                <input
                  type="text"
                  required
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="form-control"
                  placeholder="Contoh: Data Analyst & Front-End Developer"
                />
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="form-control"
                  placeholder="vannisamaulvi@gmail.com"
                />
              </div>

              <div>
                <label className="form-label">No. Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="form-control"
                  placeholder="+62 896-7742-1706"
                />
              </div>

              <div>
                <label className="form-label">Lokasi</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="form-control"
                  placeholder="Bogor, Jawa Barat"
                />
              </div>

              <div>
                <label className="form-label">Status Freelance</label>
                <input
                  type="text"
                  value={profile.freelance}
                  onChange={(e) => setProfile({ ...profile, freelance: e.target.value })}
                  className="form-control"
                  placeholder="Available"
                />
              </div>

              <div>
                <label className="form-label">Roles Animasi (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={rolesInput}
                  onChange={(e) => setRolesInput(e.target.value)}
                  className="form-control"
                  placeholder="Data Analyst, Front-End Developer"
                />
              </div>
            </div>

            {/* Field Bio & Deskripsi */}
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Hero Bio (Singkat di Tampilan Utama)</label>
              <textarea
                rows={2}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="form-control"
                placeholder="A passionate professional bridging the gap between data insights and beautiful user interfaces."
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label className="form-label">About Description (Paragraf Tentang Saya)</label>
              <textarea
                rows={3}
                value={profile.aboutDesc}
                onChange={(e) => setProfile({ ...profile, aboutDesc: e.target.value })}
                className="form-control"
                placeholder="Hello, I am Vannisa Maulvi..."
              />
            </div>

            {/* Field Media Sosial */}
            <h4 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-share"></i> Tautan Media Sosial
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div>
                <label className="form-label">LinkedIn</label>
                <input
                  type="url"
                  value={profile.socials?.linkedin || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })
                  }
                  className="form-control"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="form-label">GitHub</label>
                <input
                  type="url"
                  value={profile.socials?.github || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, socials: { ...profile.socials, github: e.target.value } })
                  }
                  className="form-control"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="form-label">Instagram</label>
                <input
                  type="url"
                  value={profile.socials?.instagram || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, socials: { ...profile.socials, instagram: e.target.value } })
                  }
                  className="form-control"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="form-label">TikTok</label>
                <input
                  type="url"
                  value={profile.socials?.tiktok || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, socials: { ...profile.socials, tiktok: e.target.value } })
                  }
                  className="form-control"
                  placeholder="https://tiktok.com/@..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--db-border)' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ minWidth: '160px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {saving ? (
                  <>
                    <i className="bi bi-arrow-repeat spin"></i> Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle"></i> Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Ganti Password Card ── */}
      <div className="card">
        <div
          className="card-header"
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={() => setPwSection(!pwSection)}
        >
          <h3 className="card-title" style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <i className="bi bi-shield-lock" style={{ color: 'var(--db-primary)' }}></i> Ganti Password
          </h3>
          <i className={`bi bi-chevron-${pwSection ? 'up' : 'down'}`} style={{ color: 'var(--db-text-muted)' }}></i>
        </div>

        {pwSection && (
          <div className="card-body">
            <p style={{ color: 'var(--db-text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Masukkan password lama Anda dan password baru untuk memperbarui keamanan akun.
            </p>
            <form onSubmit={handleChangePassword}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* Password Lama */}
                <div>
                  <label className="form-label">Password Lama</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      required
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="form-control"
                      placeholder="Masukkan password lama"
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--db-text-muted)', padding: 0 }}
                      tabIndex={-1}
                    >
                      <i className={`bi bi-eye${showCurrentPw ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>

                {/* Password Baru */}
                <div>
                  <label className="form-label">Password Baru</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      required
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="form-control"
                      placeholder="Minimal 6 karakter"
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--db-text-muted)', padding: 0 }}
                      tabIndex={-1}
                    >
                      <i className={`bi bi-eye${showNewPw ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>

                {/* Konfirmasi Password Baru */}
                <div>
                  <label className="form-label">Konfirmasi Password Baru</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      required
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="form-control"
                      placeholder="Ulangi password baru"
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--db-text-muted)', padding: 0 }}
                      tabIndex={-1}
                    >
                      <i className={`bi bi-eye${showConfirmPw ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                  {confirmPw && newPw !== confirmPw && (
                    <small style={{ color: '#ef4444', display: 'block', marginTop: '4px' }}>
                      <i className="bi bi-exclamation-circle me-1"></i>Password tidak cocok
                    </small>
                  )}
                  {confirmPw && newPw === confirmPw && confirmPw.length >= 6 && (
                    <small style={{ color: '#22c55e', display: 'block', marginTop: '4px' }}>
                      <i className="bi bi-check-circle me-1"></i>Password cocok
                    </small>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--db-border)' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setPwSection(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={changingPw}
                  className="btn btn-primary"
                  style={{ minWidth: '160px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {changingPw ? (
                    <>
                      <i className="bi bi-arrow-repeat spin"></i> Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check"></i> Ubah Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
