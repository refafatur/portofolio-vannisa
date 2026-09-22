'use client';

import { useScrollReveal, useStaggerReveal } from '@/lib/gsap';
import Footer from '../components/Footer';

const contactInfo = [
  { icon: 'bi-envelope', title: 'Email', value: 'vannisamaulvi@gmail.com', href: 'mailto:vannisamaulvi@gmail.com' },
  { icon: 'bi-telephone', title: 'Phone', value: '+62 813 1749 0001', href: 'https://wa.me/6281317490001' },
  { icon: 'bi-geo-alt', title: 'Location', value: 'Bogor, Jawa Barat', href: '#' },
];

const socialLinks = [
  { icon: 'bi-instagram', label: 'Instagram', href: 'https://www.instagram.com/vannisamaulvi/' },
  { icon: 'bi-github', label: 'GitHub', href: 'https://github.com/vannisamaulvi' },
  { icon: 'bi-linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/vannisa-maulvi/' },
  { icon: 'bi-tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@_sixtpy' },
];

export default function ContactPage() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.9 });
  const cardsRef = useStaggerReveal<HTMLDivElement>({ y: 40, stagger: 0.1, duration: 0.7 });
  const socialRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.8 });

  return (
    <>
      <section className="contact" style={{ paddingTop: '160px', minHeight: '80vh' }}>
        <div className="container">
          <div className="contact-inner">
            <div className="section-header" ref={headerRef}>
              <div className="about-label"><span className="dot"></span> Contact</div>
              <h2 className="section-heading">Let&apos;s Build<br /><span className="gradient-text">Something Great</span></h2>
              <p className="section-desc">Have a question or a project in mind? Let&apos;s connect!</p>
            </div>

            <div style={{ marginBottom: 56 }}>
              <a href="https://wa.me/6281317490001" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                <i className="bi bi-whatsapp"></i> Send Message
              </a>
            </div>

            <div className="contact-cards" ref={cardsRef}>
              {contactInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="contact-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="contact-icon"><i className={`bi ${info.icon}`}></i></div>
                  <h4>{info.title}</h4>
                  <p>{info.value}</p>
                </a>
              ))}
            </div>

            <div style={{ marginTop: '64px' }} ref={socialRef}>
              <div className="about-label"><span className="dot"></span> Follow Me</div>
              <div className="about-links" style={{ justifyContent: 'center' }}>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-link"
                    aria-label={link.label}
                  >
                    <i className={`bi ${link.icon}`}></i>
                  </a>
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
