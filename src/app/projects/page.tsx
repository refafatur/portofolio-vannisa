'use client';

import { useEffect, useState } from 'react';
import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const headerRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 60, stagger: 0.12, duration: 0.8 });

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (e) {
        console.error('Error loading projects:', e);
      }
    }
    loadProjects();
  }, []);

  return (
    <>
      <section className="projects" style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <div className="container">
          <div className="section-header" ref={headerRef}>
            <div className="about-label"><span className="dot"></span> Portfolio</div>
            <h2 className="section-heading">Featured Projects</h2>
            <p className="section-desc">A selection of projects I&apos;ve built and contributed to.</p>
          </div>
          <div className="projects-grid" ref={gridRef}>
            {projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>Loading projects...</p>
            ) : (
              projects.map((p) => (
                <div className="project-card" key={p.id} onClick={() => { setActiveImageIndex(0); setSelectedProject(p); }}>
                  <div className="project-thumb">
                    <img src={p.foto1} alt={p.nama} loading="lazy" />
                    <div className="project-overlay">
                      <div className="project-view-btn"><i className="bi bi-eye"></i></div>
                    </div>
                  </div>
                  <div className="project-body">
                    <h3 className="project-name">{p.nama}</h3>
                    <p className="project-desc">{p.keterangan || 'Click to view project details.'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Project Detail Modal */}
      {selectedProject && (() => {
        const photos = [selectedProject.foto1, selectedProject.foto2, selectedProject.foto3].filter(Boolean);
        const currentPhoto = photos.length > 0 ? photos[activeImageIndex] : '';
        return (
          <div className="new-modal-overlay" onClick={() => setSelectedProject(null)}>
            <div className="new-modal-container" onClick={(e) => e.stopPropagation()}>
              <button className="new-modal-close" onClick={() => setSelectedProject(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
              <div className="new-modal-content">
                <div className="new-modal-gallery">
                  {currentPhoto ? <img src={currentPhoto as string} alt={selectedProject.nama} /> : <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>}
                  {photos.length > 1 && (
                    <div className="new-modal-nav">
                      <button onClick={() => setActiveImageIndex((prev) => (prev - 1 + photos.length) % photos.length)}><i className="bi bi-chevron-left"></i></button>
                      <span>{activeImageIndex + 1} / {photos.length}</span>
                      <button onClick={() => setActiveImageIndex((prev) => (prev + 1) % photos.length)}><i className="bi bi-chevron-right"></i></button>
                    </div>
                  )}
                </div>
                <div className="new-modal-info">
                  <div className="about-label" style={{ marginBottom: '10px' }}><span className="dot"></span> Project Detail</div>
                  <h2 className="new-modal-title">{selectedProject.nama}</h2>
                  <div className="new-modal-divider"></div>
                  <div className="new-modal-desc" style={{ whiteSpace: 'pre-line' }}>{selectedProject.keterangan || 'No description available for this project.'}</div>
                  <div className="new-modal-actions">
                    {currentPhoto && (
                      <a href={currentPhoto as string} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        <i className="bi bi-box-arrow-up-right"></i> View Full Image
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </>
  );
}
