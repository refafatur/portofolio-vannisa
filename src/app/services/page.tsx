'use client';

import Link from 'next/link';
import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

const services = [
  { icon: 'bi-bar-chart', title: 'Data Analysis', desc: 'Analyzing complex datasets to find actionable insights using Python and SQL.', featured: false },
  { icon: 'bi-code-slash', title: 'Front-End Dev', desc: 'Building responsive and modern interfaces using HTML, CSS, JavaScript.', featured: false },
  { icon: 'bi-graph-up', title: 'Data Visualization', desc: 'Creating interactive dashboards and reports for business intelligence.', featured: false },
  { icon: 'bi-database', title: 'Database Mgmt', desc: 'Designing and optimizing databases with MySQL and Laravel.', featured: false },
];

export default function ServicesPage() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const gridRef = useStaggerReveal<HTMLDivElement>({ y: 50, stagger: 0.1, duration: 0.8 });
  const ctaRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.8 });

  return (
    <>
      <section className="services" style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <div className="container">
          <div className="section-header" ref={headerRef}>
            <div className="about-label"><span className="dot"></span> Services</div>
            <h2 className="section-heading">What I Can Do</h2>
            <p className="section-desc">I offer a range of services to bring your digital ideas to life.</p>
          </div>
          <div className="services-grid" ref={gridRef}>
            {services.map((s) => (
              <div className={`service-card ${s.featured ? 'featured' : ''}`} key={s.title}>
                <div className="service-icon"><i className={`bi ${s.icon}`}></i></div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <Link href="/contact" className="service-link">Let&apos;s Discuss <i className="bi bi-arrow-right"></i></Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '80px' }} ref={ctaRef}>
            <div className="about-label"><span className="dot"></span> Ready to start?</div>
            <h3 className="section-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Have a project in mind?
            </h3>
            <Link href="/contact" className="btn btn-primary btn-lg">
              <i className="bi bi-envelope"></i> Get In Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
