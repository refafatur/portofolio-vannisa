'use client';

import { useEffect, useState } from 'react';
import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';
import { calculateAge } from '@/lib/profileData';

interface Timeline {
  id: string;
  year: string;
  title: string;
  description: string;
}



export default function AboutPage() {
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.9 });
  const infoRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.9, delay: 0.1 });
  const timelineHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const timelineRef = useStaggerReveal<HTMLDivElement>({ y: 50, stagger: 0.12, duration: 0.8 });

  useEffect(() => {
    async function loadTimeline() {
      try {
        const res = await fetch('/api/timeline');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setTimeline(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading timeline:', error);
        setTimeline([]);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  return (
    <>
      <section className="about" style={{ paddingTop: '160px' }}>
        <div className="container">
          <div className="about-hero" ref={heroRef}>
            <div className="about-hero-text">
              <p className="about-label">About me</p>
              <h1 className="about-hero-title">
                Data Analyst dan Administrasi yang Terstuktur
              </h1>
              <p className="about-hero-desc">
                Halo, saya Vannisa Maulvi. Saya memiliki minat besar pada Data Analyst dan Administrasi, serta dibekali kemampuan yang solid dalam pengolahan data, pembuatan laporan yang presisi, dan manajemen administrasi yang terstruktur.
              </p>
              <div className="about-socials">
                <a href="https://www.instagram.com/vannisamaulvi/" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://github.com/vannisamaulvi" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/vannisa-maulvi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://www.tiktok.com/@vannisamaulvi" target="_blank" rel="noopener noreferrer">TikTok</a>
              </div>
            </div>
            <div className="about-hero-photo">
              <img src="/image/me.png" alt="Vannisa Maulvi" />
            </div>
          </div>

          <div className="about-info" ref={infoRef}>
            <div className="about-info-block">
              <h3>Details</h3>
              <dl className="about-details">
                <div><dt>Age</dt><dd>{calculateAge('2004-05-18')}</dd></div>
                <div><dt>Location</dt><dd>Bogor, ID</dd></div>
                <div><dt>Email</dt><dd>vannisamaulvi@gmail.com</dd></div>
                <div><dt>Phone</dt><dd>+62 896-7742-1706</dd></div>
                <div><dt>Bahasa</dt><dd>Indonesia (Fasih), English (Tingkat Menengah)</dd></div>
                <div><dt>Freelance</dt><dd className="available">Available</dd></div>
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

          {/* Timeline Section */}
          <div className="timeline-section">
            <div className="section-header" ref={timelineHeaderRef}>
              <div className="about-label"><span className="dot"></span> Journey</div>
              <h2 className="section-heading">My Education & Experience</h2>
            </div>

            <div className="timeline" ref={timelineRef}>
              <div className="timeline-line"></div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Loading timeline...
                </div>
              ) : timeline.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No timeline data available
                </div>
              ) : (
                timeline.map((item, index) => (
                  <div className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} key={item.id}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-year">{item.year}</span>
                      <h3 className="timeline-title">{item.title}</h3>
                      <p className="timeline-desc">{item.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
