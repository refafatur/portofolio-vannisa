'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('adminName') || '';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = !!adminName;

  // Auto close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!adminName) {
      router.replace('/login');
    }
  }, [adminName, router]);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem('adminName');
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/dashboard', icon: 'bi-grid-1x2', label: 'Dashboard' },
    { href: '/dashboard/projects', icon: 'bi-folder', label: 'Projects' },
    { href: '/dashboard/certificates', icon: 'bi-award', label: 'Certificates' },
    { href: '/dashboard/gallery', icon: 'bi-images', label: 'Gallery' },
  ];

  // Only render content if authenticated
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">Dashboard</span>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main Menu</div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Quick Links</div>
            <Link href="/" className="nav-item" target="_blank">
              <i className="bi bi-globe"></i>
              <span>View Portfolio</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
            <h1 className="page-title">
              {pathname === '/dashboard' ? 'Dashboard' :
               pathname === '/dashboard/profile' ? 'Edit Profile' :
               pathname === '/dashboard/projects' ? 'Projects' :
               pathname === '/dashboard/certificates' ? 'Certificates' :
               pathname === '/dashboard/gallery' ? 'Gallery' : 'Dashboard'}
            </h1>
          </div>

          <div className="header-right">
            <div className="header-search">
              <i className="bi bi-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            <div className="header-actions">
              <button className="header-btn">
                <i className="bi bi-bell"></i>
                <span className="badge"></span>
              </button>
            </div>
            <Link
              href="/dashboard/profile"
              className="user-profile"
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              title="Klik untuk Edit Profile & Upload CV"
            >
              <div className="user-avatar">{adminName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {adminName} <i className="bi bi-pencil" style={{ fontSize: '0.75rem', opacity: 0.7 }}></i>
                </span>
                <span className="user-role">Edit Profile</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>

    </>
  );
}
