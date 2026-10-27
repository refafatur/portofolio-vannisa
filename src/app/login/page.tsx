'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

export default function LoginPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const adminName = localStorage.getItem('adminName');
    if (adminName) {
      router.replace('/dashboard');
    }
    const timer = setTimeout(() => setCheckingAuth(false), 0);
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!containerRef.current || checkingAuth) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      containerRef.current,
      { y: 40, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
    );
  }, [checkingAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred.');
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem('adminName', data.user.nama || 'Admin');

      const Swal = (await import('sweetalert2')).default;
      await Swal.fire({
        icon: 'success',
        title: `Welcome back, ${data.user.nama || 'Admin'}!`,
        html: '<p style="color:var(--text-secondary);font-size:0.95rem;">You are being redirected to the dashboard...</p>',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        iconColor: 'var(--onyx)',
        customClass: {
          popup: 'swal-premium-popup',
          title: 'swal-premium-title',
        },
      });
      router.replace('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred.');
      setIsSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="auth-body">
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}></i>
          <p style={{ marginTop: 12 }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-body">
      <div className="auth-shape auth-shape-1"></div>
      <div className="auth-shape auth-shape-2"></div>

      <div className="login-container" ref={containerRef}>
        <div className="login-form-container">
          <Link href="/" className="back-link">
            <i className="bi bi-arrow-left"></i> Back to Portfolio
          </Link>

          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  className="auth-form-control"
                  id="loginEmail"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type="password"
                  className="auth-form-control"
                  id="loginPassword"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <><i className="bi bi-arrow-repeat"></i> Signing in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right"></i> Sign In</>
              )}
            </button>

            {error && <div className="error-message">{error}</div>}
          </form>


        </div>

        <div className="login-branding">
          <div className="branding-logo">R</div>
          <h1 className="branding-title">Portfolio Admin</h1>
          <p className="branding-text">Manage your projects, certificates, and gallery all in one place.</p>

          <div className="branding-features">
            <div className="feature-item">
              <div className="feature-icon"><i className="bi bi-shield-check"></i></div>
              <span>Secure Authentication</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="bi bi-speedometer2"></i></div>
              <span>Real-time Dashboard</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="bi bi-cloud-upload"></i></div>
              <span>Easy File Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
