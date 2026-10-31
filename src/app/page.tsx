'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useScrollReveal,
  useStaggerReveal,
  useParallax,
  useCounter,
  refreshScrollTrigger,
} from '@/lib/gsap';
import Footer from './components/Footer';
import { ProfileData, defaultProfile, calculateAge } from '@/lib/profileData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: number;
  nama: string;
  keterangan: string;
  foto1: string;
  foto2?: string;
  foto3?: string;
}

interface Certificate {
  id: number;
  nama: string;
  foto: string;
  file: string;
}

interface GalleryImage {
  id: number;
  foto: string;
}

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [projectCount, setProjectCount] = useState(5);
  const [certCount, setCertCount] = useState(3);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryImage | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLSpanElement>(null);

  const aboutHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const aboutBentoRef = useScrollReveal<HTMLDivElement>({ y: 60, duration: 0.9, delay: 0.1 });
  const servicesHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const servicesGridRef = useStaggerReveal<HTMLDivElement>({ y: 50, stagger: 0.1, duration: 0.8 });
  const projectsHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const skillsHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const skillsGridRef = useStaggerReveal<HTMLDivElement>({ y: 40, stagger: 0.06, duration: 0.7 });
  const certsHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const certsGridRef = useStaggerReveal<HTMLDivElement>({ y: 50, stagger: 0.12, duration: 0.8 });
  const galleryHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const galleryGridRef = useStaggerReveal<HTMLDivElement>({ y: 40, stagger: 0.08, duration: 0.7 });
  const contactHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const contactCardsRef = useStaggerReveal<HTMLDivElement>({ y: 40, stagger: 0.1, duration: 0.7 });
  const heroImageParallaxRef = useParallax<HTMLDivElement>(0.15);

  const projectCounterRef = useCounter(projectCount, 2, 0.5);
  const certCounterRef = useCounter(certCount, 2, 0.7);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero entrance animation
  useEffect(() => {
    if (!heroContentRef.current || !heroVisualRef.current || !heroTitleRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      heroContentRef.current.children,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.12 }
    ).fromTo(
      heroVisualRef.current,
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2 },
      '-=0.8'
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Typing animation
  useEffect(() => {
    if (!typingRef.current) return;
    const roles = profile.roles && profile.roles.length > 0 ? profile.roles : ['Data Analyst', 'Front-End Developer'];
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    function typeRole() {
      const role = roles[roleIdx % roles.length];
      if (typingRef.current) {
        typingRef.current.textContent = deleting
          ? role.substring(0, --charIdx)
          : role.substring(0, ++charIdx);
      }
      let speed = deleting ? 45 : 90;
      if (!deleting && charIdx === role.length) {
        speed = 2200;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400;
      }
      timeout = setTimeout(typeRole, speed);
    }
    typeRole();
    return () => clearTimeout(timeout);
  }, [profile.roles]);

  // Load data
  useEffect(() => {
    async function loadProfile() {
      try {
        // Record profile visit
        fetch('/api/views', { method: 'POST' }).catch(() => {});

        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data && data.nama) {
            setProfile(data);
          }
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }

    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
          setProjectCount(data.length);
        }
      } catch (e) {
        console.error('Error loading projects:', e);
      }
    }

    async function loadCertificates() {
      try {
        const res = await fetch('/api/certificates');
        const data = await res.json();
        if (Array.isArray(data)) {
          setCertificates(data);
          setCertCount(data.length);
        }
      } catch (e) {
        console.error('Error loading certificates:', e);
      }
    }

    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        if (Array.isArray(data)) setGallery(data);
      } catch (e) {
        console.error('Error loading gallery:', e);
      }
    }

    loadProfile();
    loadProjects();
    loadCertificates();
    loadGallery();
  }, []);

  // Refresh ScrollTrigger after data loads
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshScrollTrigger();
    }, 100);
    return () => clearTimeout(timer);
  }, [projects, certificates, gallery]);

  const openProjectModal = (p: Project) => {
    setActiveImageIndex(0);
    setSelectedProject(p);
  };

  // Prevent scrolling when any modal is open
  useEffect(() => {
    if (selectedProject || selectedCertificate || selectedGalleryImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject, selectedCertificate, selectedGalleryImage]);

interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
  featured?: boolean;
}

interface SkillItem {
  icon: string;
  name: string;
  style?: React.CSSProperties;
}

  const services: ServiceItem[] = [
    { icon: 'bi-bar-chart', title: 'Data Analysis', desc: 'Analyzing complex datasets to find actionable insights using Python and SQL.' },
    { icon: 'bi-code-slash', title: 'Front-End Dev', desc: 'Building responsive and modern interfaces using HTML, CSS, JavaScript.' },
    { icon: 'bi-graph-up', title: 'Data Visualization', desc: 'Creating interactive dashboards and reports for business intelligence.' },
    { icon: 'bi-database', title: 'Database Mgmt', desc: 'Designing and optimizing databases with MySQL and Laravel.' },
  ];

  const skills: SkillItem[] = [
    { icon: 'bi bi-file-earmark-word', name: 'Microsoft Word', style: { color: '#2b579a' } },
    { icon: 'bi bi-file-earmark-excel', name: 'Microsoft Excel', style: { color: '#217346' } },
    { icon: 'bi bi-file-earmark-ppt', name: 'Microsoft PowerPoint', style: { color: '#d24726' } },
    { icon: 'bi bi-file-earmark-spreadsheet', name: 'Google Sheets', style: { color: '#0f9d58' } },
    { icon: 'bi bi-database-fill-gear', name: 'Entri & Kelola Data', style: { color: '#6366f1' } },
    { icon: 'bi bi-check2-square', name: 'Pemeriksaan Data', style: { color: '#06b6d4' } },
    { icon: 'bi bi-folder2-open', name: 'Pengelolaan Dokumen', style: { color: '#f59e0b' } },
    { icon: 'devicon-python-plain colored', name: 'Python' },
    { icon: 'devicon-mysql-plain colored', name: 'MySQL' },
    { icon: 'devicon-html5-plain colored', name: 'HTML' },
    { icon: 'devicon-css3-plain colored', name: 'CSS' },
    { icon: 'devicon-javascript-plain colored', name: 'JavaScript' },
    { icon: 'devicon-bootstrap-plain colored', name: 'Bootstrap' },
    { icon: 'devicon-laravel-original colored', name: 'Laravel' },
    { icon: 'devicon-flutter-plain colored', name: 'Flutter' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" ref={progressRef}></div>

      {/* ==================== HERO ==================== */}
      <section className="hero" id="home" ref={heroRef}>
        <div className="container hero-grid">
          <div className="hero-content" ref={heroContentRef}>
            <div className="hero-eyebrow">
              <span className="line"></span>
              DATA ANALYST & ADMINISTRASI
            </div>

            <h1 className="hero-title" ref={heroTitleRef}>
              Hi, I&apos;m <span className="gradient-text">{profile.nama.split(' ')[0]}</span><br />
              {profile.nama.split(' ').slice(1).join(' ')}
            </h1>

            <p className="hero-role">
              <span className="role-typing" ref={typingRef}></span>
              <span className="cursor-blink"></span>
            </p>

            <p className="hero-desc">
              {profile.bio}
            </p>

            <div className="hero-actions" style={{ flexWrap: 'wrap', gap: '14px' }}>
              <a href="#contact" className="btn btn-primary btn-lg">
                <i className="bi bi-arrow-right"></i> Let&apos;s Work Together
              </a>
              <a href="#project" className="btn btn-outline btn-lg">
                View Projects
              </a>
              {profile.cvUrl ? (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    background: 'rgba(219, 39, 119, 0.15)',
                    border: '1px solid rgba(219, 39, 119, 0.4)',
                    color: 'var(--text-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px rgba(219, 39, 119, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill" style={{ color: '#ec4899', fontSize: '1.15rem' }}></i> Lihat CV
                </a>
              ) : (
                <a
                  href="#about"
                  className="btn btn-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  title="CV belum diunggah"
                >
                  <i className="bi bi-file-earmark-pdf" style={{ fontSize: '1.15rem' }}></i> Lihat CV
                </a>
              )}
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value" ref={projectCounterRef}>
                  0
                </span>
                <span className="hero-stat-label">Projects</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value" ref={certCounterRef}>
                  0
                </span>
                <span className="hero-stat-label">Certifications</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" ref={heroVisualRef}>
            <div className="hero-image-container" ref={heroImageParallaxRef}>
              <div className="hero-glow"></div>
              <div className="hero-image-wrapper">
                <img src={profile.avatarUrl || '/image/me.png'} alt={profile.nama} />
              </div>
              <div className="float-card float-card-1">
                <div className="fc-icon"><i className="bi bi-bar-chart"></i></div>
                <div className="fc-label">Specialty</div>
                <div className="fc-value">Data Analyst</div>
              </div>
              <div className="float-card float-card-2">
                <div className="fc-icon"><i className="bi bi-briefcase"></i></div>
                <div className="fc-label">Specialty</div>
                <div className="fc-value">Administrasi</div>
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-hint-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ==================== ABOUT - Editorial ==================== */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-hero" ref={aboutHeaderRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '30px', marginBottom: '80px' }}>
            <div className="about-hero-text" style={{ maxWidth: '800px' }}>
              <p className="about-label" style={{ justifyContent: 'center', marginBottom: '20px' }}>About me</p>
              <h2 className="about-hero-title" style={{ fontSize: '3rem', marginBottom: '30px' }}>
                Turning data into insights, and ideas into interfaces.
              </h2>
              <p className="about-hero-desc" style={{ fontSize: '1.2rem', margin: '0 auto 40px' }}>
                {profile.aboutDesc}
              </p>
              <div className="about-socials" style={{ justifyContent: 'center' }}>
                <a href={profile.socials?.linkedin || '#'} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={profile.socials?.github || '#'} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={profile.socials?.instagram || '#'} target="_blank" rel="noopener noreferrer">Instagram</a>
                <Link href="/about">More about me</Link>
              </div>
            </div>
          </div>

          <div className="about-info" ref={aboutBentoRef}>
            <div className="about-info-block">
              <h3>Details</h3>
              <dl className="about-details">
                <div><dt>Age</dt><dd>{calculateAge('2004-05-18')}</dd></div>
                <div><dt>Location</dt><dd>{profile.location}</dd></div>
                <div><dt>Email</dt><dd>{profile.email}</dd></div>
                <div><dt>Phone</dt><dd>{profile.phone}</dd></div>
                <div><dt>Bahasa</dt><dd>Indonesia (Fasih), English (Tingkat Menengah)</dd></div>
                <div><dt>Freelance</dt><dd className="available">{profile.freelance}</dd></div>
              </dl>
            </div>

            <div className="about-info-block">
              <h3>Soft Skill</h3>
              <ul className="about-skills">
                {[
                  'Komunikasi',
                  'Pelayanan pelanggan',
                  'Penyampaian informasi',
                  'Pemecahan masalah',
                  'Ketelitian',
                  'Kerja sama tim',
                  'Kemampuan beradaptasi',
                ].map((skill) => (
                  <li key={skill}>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES ==================== */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header" ref={servicesHeaderRef}>
            <div className="about-label"><span className="dot"></span> Services</div>
            <h2 className="section-heading">What I Can Do</h2>
            <p className="section-desc">I offer a range of services to bring your digital ideas to life.</p>
          </div>
          <div className="services-grid" ref={servicesGridRef}>
            {services.map((s) => (
              <div className={`service-card ${s.featured ? 'featured' : ''}`} key={s.title}>
                <div className="service-icon"><i className={`bi ${s.icon}`}></i></div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <a href="#contact" className="service-link">Learn More <i className="bi bi-arrow-right"></i></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROJECTS ==================== */}
      <section className="projects" id="project">
        <div className="container">
          <div className="section-header" ref={projectsHeaderRef}>
            <div className="about-label"><span className="dot"></span> Portfolio</div>
            <h2 className="section-heading">Featured Projects</h2>
            <p className="section-desc">A selection of projects I&apos;ve built and contributed to.</p>
          </div>
          <div className="projects-grid">
            {projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>Loading projects...</p>
            ) : (
              projects.slice(0, 4).map((p) => (
                <div className="project-card" key={p.id} onClick={() => openProjectModal(p)}>
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
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/projects" className="btn btn-outline">
              Lihat Selengkapnya <i className="bi bi-arrow-right" style={{ marginLeft: '8px' }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TECHNOLOGIES SECTION ==================== */}
      <section className="skills" id="skills">
        <div className="container">
          <div className="section-header" ref={skillsHeaderRef}>
            <div className="about-label"><span className="dot"></span> Hard Skill</div>
            <h2 className="section-heading">Hard Skill</h2>
            <p className="section-desc">Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Google Sheets, entri dan pengelolaan data, pemeriksaan data, pengelolaan dokumen.</p>
          </div>

          <div className="skills-grid" ref={skillsGridRef}>
            {skills.map((s, idx) => (
              <div className="skill-card" key={idx}>
                <div className="skill-icon">
                  <i className={s.icon} style={s.style}></i>
                </div>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CERTIFICATES SECTION ==================== */}
      <section className="certificates" id="certificates">
        <div className="container">
          <div className="section-header" ref={certsHeaderRef}>
            <div className="about-label"><span className="dot"></span> Achievements</div>
            <h2 className="section-heading">My Certificates</h2>
            <p className="section-desc">Certifications and achievements I&apos;ve collected along the way.</p>
          </div>

          <div className="certificates-grid" ref={certsGridRef}>
            {certificates.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>Loading certificates...</p>
            ) : (
              certificates.slice(0, 4).map((c) => (
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

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/certificates" className="btn btn-outline">
              Lihat Semua Sertifikat <i className="bi bi-arrow-right" style={{ marginLeft: '8px' }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== GALLERY ==================== */}
      <section className="gallery" id="gallery">
        <div className="container">
          <div className="section-header" ref={galleryHeaderRef}>
            <div className="about-label"><span className="dot"></span> Gallery</div>
            <h2 className="section-heading">My Gallery</h2>
            <p className="section-desc">Moments captured from events and activities.</p>
          </div>
          <div className="gallery-grid" ref={galleryGridRef}>
            {gallery.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1/-1' }}>Loading gallery...</p>
            ) : (
              gallery.slice(0, 4).map((img) => (
                <div className="gallery-item" key={img.id} onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img.foto} alt="Gallery" loading="lazy" />
                </div>
              ))
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/gallery" className="btn btn-outline">
              Lihat Selengkapnya <i className="bi bi-arrow-right" style={{ marginLeft: '8px' }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-inner">
            <div className="section-header" ref={contactHeaderRef}>
              <div className="about-label"><span className="dot"></span> Contact</div>
              <h2 className="section-heading">Let&apos;s Build<br /><span className="gradient-text">Something Great</span></h2>
              <p className="section-desc">Have a question or a project in mind? Let&apos;s connect!</p>
            </div>
            <div style={{ marginBottom: 48 }}>
              <a
                href={`https://wa.me/${(profile.phone || '').replace(/[^0-9]/g, '') || '6289677421706'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <i className="bi bi-whatsapp"></i> Send Message
              </a>
            </div>
            <div className="contact-cards" ref={contactCardsRef}>
              <div className="contact-card">
                <div className="contact-icon"><i className="bi bi-envelope"></i></div>
                <h4>Email</h4>
                <p>{profile.email}</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon"><i className="bi bi-telephone"></i></div>
                <h4>Phone</h4>
                <p>{profile.phone}</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon"><i className="bi bi-geo-alt"></i></div>
                <h4>Location</h4>
                <p>{profile.location}</p>
              </div>
            </div>
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
