'use client';

import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

const skills = [
  { icon: 'devicon-html5-plain colored', name: 'HTML' },
  { icon: 'devicon-css3-plain colored', name: 'CSS' },
  { icon: 'devicon-javascript-plain colored', name: 'JavaScript' },
  { icon: 'devicon-bootstrap-plain colored', name: 'Bootstrap'},
  { icon: 'devicon-laravel-original colored', name: 'Laravel' },
  { icon: 'devicon-flutter-plain colored', name: 'Flutter' },
  { icon: 'devicon-dart-plain colored', name: 'Dart' },
  { icon: 'devicon-python-plain colored', name: 'Python' },
  { icon: 'devicon-mysql-plain colored', name: 'MySQL' },
];

const proficiencies = [
  { name: 'Data Analysis', level: 'Advanced' },
  { name: 'Front-End', level: 'Advanced' },
  { name: 'Python', level: 'Intermediate' },
  { name: 'MySQL', level: 'Advanced' },
  { name: 'Laravel', level: 'Intermediate' },
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
            <div className="about-label"><span className="dot"></span> Tech Stack</div>
            <h2 className="section-heading">Technologies I Use</h2>
            <p className="section-desc">The tools and technologies I work with daily.</p>
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
            <div className="bento-card span-12">
              <div className="about-label"><span className="dot"></span> Proficiency</div>
              <div className="skill-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {proficiencies.map((s) => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{s.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
