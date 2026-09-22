'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/lib/gsap';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://www.instagram.com/vannisamaulvi/', icon: 'bi-instagram', label: 'Instagram' },
  { href: 'https://github.com/vannisamaulvi', icon: 'bi-github', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/vannisa-maulvi/', icon: 'bi-linkedin', label: 'LinkedIn' },
  { href: 'https://www.tiktok.com/@vannisamaulvi', icon: 'bi-tiktok', label: 'TikTok' },
];

export default function Footer() {
  const footerRef = useScrollReveal<HTMLElement>({ y: 30, duration: 0.8 });

  return (
    <footer className="footer" ref={footerRef}>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            {/* <img
              src="/image/logo.png"
              alt="Vannisa Logo"
              style={{ width: 36, height: 36, borderRadius: '10px', objectFit: 'cover' }}
            /> */}
            <span>Vannisa.</span>
          </div>
          <nav className="footer-nav">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="footer-social">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <i className={`bi ${link.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Vannisa Maulvi. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
