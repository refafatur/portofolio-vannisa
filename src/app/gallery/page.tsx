'use client';

import { useEffect, useState } from 'react';
import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

interface GalleryImage {
  id: number;
  foto: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryImage | null>(null);

  const headerRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 50, stagger: 0.08, duration: 0.7 });

  useEffect(() => {
    if (selectedGalleryImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedGalleryImage]);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        if (Array.isArray(data)) {
          setGallery(data);
        }
      } catch (e) {
        console.error('Error loading gallery:', e);
      }
    }
    loadGallery();
  }, []);

  return (
    <>
      <section className="gallery" style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <div className="container">
          <div className="section-header" ref={headerRef}>
            <div className="about-label"><span className="dot"></span> Gallery</div>
            <h2 className="section-heading">My Gallery</h2>
            <p className="section-desc">Moments captured from events and activities.</p>
          </div>
          <div className="gallery-grid masonry" ref={gridRef}>
            {gallery.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>Loading gallery...</p>
            ) : (
              gallery.map((img, i) => (
                <div
                  className="gallery-item"
                  key={img.id}
                  onClick={() => setSelectedGalleryImage(img)}
                  style={{ gridRow: i % 3 === 1 ? 'span 2' : 'span 1' }}
                >
                  <img src={img.foto} alt="Gallery" loading="lazy" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Gallery Detail Modal */}
      {selectedGalleryImage && (
        <div className="gallery-modal-overlay" onClick={() => setSelectedGalleryImage(null)}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={() => setSelectedGalleryImage(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <img src={selectedGalleryImage.foto} alt="Gallery Preview" />
          </div>
        </div>
      )}

    </>
  );
}
