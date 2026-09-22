'use client';

import { useEffect, useState } from 'react';
import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

interface Certificate {
  id: number;
  nama: string;
  foto: string;
  file: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const headerRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 60, stagger: 0.12, duration: 0.8 });

  useEffect(() => {
    if (selectedCertificate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCertificate]);

  useEffect(() => {
    async function loadCertificates() {
      try {
        const res = await fetch('/api/certificates');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCertificates(data);
        }
      } catch (e) {
        console.error('Error loading certificates:', e);
      }
    }
    loadCertificates();
  }, []);

  return (
    <>
      <section className="certificates" style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <div className="container">
          <div className="section-header" ref={headerRef}>
            <div className="about-label"><span className="dot"></span> Achievements</div>
            <h2 className="section-heading">My Certificates</h2>
            <p className="section-desc">Certifications and achievements I&apos;ve collected along the way.</p>
          </div>
          <div className="certificates-grid" ref={gridRef}>
            {certificates.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>Loading certificates...</p>
            ) : (
              certificates.map((c) => (
                <div className="cert-item" key={c.id} onClick={() => setSelectedCertificate(c)}>
                  <div className="cert-img">
                    <img src={c.foto} alt={c.nama} loading="lazy" />
                  </div>
                  <div className="cert-info">
                    <h4>{c.nama}</h4>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <div className="new-modal-overlay" onClick={() => setSelectedCertificate(null)}>
          <div className="new-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="new-modal-close" onClick={() => setSelectedCertificate(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="new-modal-content">
              <div className="new-modal-gallery">
                <img src={selectedCertificate.foto} alt={selectedCertificate.nama} />
              </div>
              <div className="new-modal-info">
                <div className="about-label" style={{ marginBottom: '10px' }}><span className="dot"></span> Achievement</div>
                <h2 className="new-modal-title">{selectedCertificate.nama}</h2>
                <div className="new-modal-divider"></div>
                <p className="new-modal-desc">
                  Certified achievement representing expertise in specialized domains.
                  This credential validates the professional skills and standards acquired.
                </p>
                <div className="new-modal-actions">
                  {selectedCertificate.file && (
                    <a href={selectedCertificate.file} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      <i className="bi bi-file-earmark-pdf"></i> View Original PDF
                    </a>
                  )}
                  <button className="btn btn-outline" onClick={() => setSelectedCertificate(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
