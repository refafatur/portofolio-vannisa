'use client';

import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

interface SkillItem {
  icon: string;
  name: string;
  style?: React.CSSProperties;
}

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
  { icon: 'devicon-bootstrap-plain colored', name: 'Bootstrap'},
  { icon: 'devicon-laravel-original colored', name: 'Laravel' },
  { icon: 'devicon-flutter-plain colored', name: 'Flutter' },
];

const softSkills = [
  'Komunikasi',
  'Pelayanan pelanggan',
  'Penyampaian informasi',
  'Pemecahan masalah',
  'Ketelitian',
  'Kerja sama tim',
  'Kemampuan beradaptasi',
];

export default function SkillsPage() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 40, stagger: 0.04, duration: 0.6 });
  const profRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.8, delay: 0.2 });

  return (
    <>
      <section className="skills" style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <div className="container">
          <div className="section-header" ref={headerRef}>
            <div className="about-label"><span className="dot"></span> Hard Skill</div>
            <h2 className="section-heading">Hard Skill</h2>
            <p className="section-desc">Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Google Sheets, entri dan pengelolaan data, pemeriksaan data, pengelolaan dokumen.</p>
          </div>

          <div className="skills-grid" style={{ marginBottom: '80px' }} ref={gridRef}>
            {skills.map((s, idx) => (
              <div className="skill-card" key={idx}>
                <div className="skill-icon">
                  <i className={s.icon} style={s.style}></i>
                </div>
                <span>{s.name}</span>
              </div>
            ))}
          </div>

          <div className="bento-grid" ref={profRef}>
            <div className="bento-card span-12" style={{ marginBottom: '32px' }}>
              <div className="about-label"><span className="dot"></span> Soft Skill</div>
              <div className="skill-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {softSkills.map((s) => (
                  <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Soft Skill</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bento-card span-12">
              <div className="about-label"><span className="dot"></span> Bahasa</div>
              <div className="skill-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Indonesia</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Fasih</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>English</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Tingkat Menengah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
