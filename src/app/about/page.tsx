'use client';

import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

const timeline = [
  { year: '2016 - 2019', title: 'SMP', desc: 'Menempuh pendidikan menengah pertama.' },
  { year: '2019 - 2022', title: 'SMA', desc: 'Menempuh pendidikan menengah atas.' },
  { year: '2022 - Sekarang', title: 'Universitas Binaniaga Indonesia', desc: 'Mahasiswa S1 Teknik Informatika.' },
  { year: '2024', title: 'Magang', desc: 'Pengalaman magang sebagai Software Developer / IT Support.' },
];

const skillLevels = [
  { name: 'Frontend', level: 'Advanced' },
  { name: 'Backend', level: 'Intermediate' },
  { name: 'Mobile Dev', level: 'Intermediate' },
  { name: 'UI/UX Design', level: 'Advanced' },
  { name: 'Machine Learning', level: 'Intermediate' },
];

export default function AboutPage() {
  const heroRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.9 });
  const infoRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.9, delay: 0.1 });
  const timelineHeaderRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const timelineRef = useStaggerReveal<HTMLDivElement>({ y: 50, stagger: 0.12, duration: 0.8 });

  return (
    <>
      <section className="about" style={{ paddingTop: '160px' }}>
        <div className="container">
          <div className="about-hero" ref={heroRef}>
            <div className="about-hero-text">
              <p className="about-label">About me</p>
              <h1 className="about-hero-title">
                Crafting code with purpose and precision.
              </h1>
              <p className="about-hero-desc">
                Halo, saya Vannisa Maulvi. Saya berfokus pada Data Analyst dan pengembangan web sebagai Front-End Developer, dengan pengalaman
                mendalam di pembuatan UI/UX dan pengolahan data.
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
                <div><dt>Age</dt><dd>21</dd></div>
                <div><dt>Location</dt><dd>Bogor, ID</dd></div>
                <div><dt>Email</dt><dd>vannisamaulvi@gmail.com</dd></div>
                <div><dt>Phone</dt><dd>+62 813 1749 0001</dd></div>
                <div><dt>Freelance</dt><dd className="available">Available</dd></div>
              </dl>
            </div>

            <div className="about-info-block">
              <h3>Skills</h3>
              <ul className="about-skills">
                {skillLevels.map((s) => (
                  <li key={s.name}>
                    <span>{s.name}</span>
                    <span className="skill-level">{s.level}</span>
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
              {timeline.map((item, index) => (
                <div className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} key={item.title}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-year">{item.year}</span>
                    <h3 className="timeline-title">{item.title}</h3>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
