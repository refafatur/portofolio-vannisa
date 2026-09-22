'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const navItems = [
  { href: '/', label: 'Home', icon: 'bi-house-fill' },
  { href: '/about', label: 'About', icon: 'bi-person-fill' },
  { href: '/services', label: 'Services', icon: 'bi-briefcase-fill' },
  { href: '/projects', label: 'Projects', icon: 'bi-folder-fill' },
  { href: '/certificates', label: 'Certificates', icon: 'bi-award-fill' },
  { href: '/gallery', label: 'Gallery', icon: 'bi-images' },
  { href: '/skills', label: 'Skills', icon: 'bi-code-slash' },
  { href: '/contact', label: 'Contact', icon: 'bi-envelope-fill' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (mobileOpen) {
      gsap.to(drawerRef.current, {
        right: '0%',
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.4,
        ease: 'power2.out',
      });
      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.children,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            delay: 0.15,
            ease: 'power3.out',
          }
        );
      }
    } else {
      gsap.to(drawerRef.current, {
        right: '-100%',
        duration: 0.4,
        ease: 'power3.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [mobileOpen]);

  if (pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <>
      {/* Desktop Top Navbar */}
      <header
        className={`top-navbar ${scrolled ? 'scrolled' : ''}`}
        id="top-navbar"
      >
        <div className="top-navbar-container">
          <Link href="/" className="top-navbar-logo">
            <span className="logo-text">Vannisa.</span>
          </Link>

          <nav className="top-navbar-links">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`top-nav-item ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="top-navbar-actions">
            {/* Mobile Hamburger Button */}
            <button
              className="top-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        ref={overlayRef}
        className="top-mobile-overlay"
        onClick={() => setMobileOpen(false)}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className="top-mobile-drawer"
        style={{ right: '-100%' }}
      >
        <div className="top-drawer-header">
          <span className="top-drawer-title">Navigation</span>
          <button
            className="top-drawer-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="top-drawer-links" ref={linksRef}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`top-drawer-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
