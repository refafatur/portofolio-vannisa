'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';

export default function RegisterPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred.');
        setIsSubmitting(false);
        return;
      }

      const Swal = (await import('sweetalert2')).default;
      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created. Please login.',
        confirmButtonColor: 'var(--onyx)',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        customClass: {
          popup: 'swal-premium-popup',
          title: 'swal-premium-title',
        },
      });
      window.location.href = '/login';
    } catch (err) {
      console.error('Register error:', err);
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

      <div className="register-container" ref={containerRef}>
        <div className="register-form-container">
          <Link href="/" className="back-link">
            <i className="bi bi-arrow-left"></i> Back to Portfolio
          </Link>

          <div className="form-header">
            <h2>Create Account</h2>
            <p>Register to start managing your portfolio</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="registerName">Full Name</label>
              <div className="input-wrapper">
                <i className="bi bi-person"></i>
                <input type="text" className="auth-form-control" id="registerName" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registerEmail">Email Address</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input type="email" className="auth-form-control" id="registerEmail" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registerPassword">Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input type="password" className="auth-form-control" id="registerPassword" placeholder="Create a password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <><i className="bi bi-arrow-repeat"></i> Creating account...</>
              ) : (
                <><i className="bi bi-person-plus"></i> Create Account</>
              )}
            </button>

            {error && <div className="error-message">{error}</div>}
          </form>

          <div className="form-footer">
            Already have an account? <Link href="/login">Sign In</Link>
          </div>
        </div>

        <div className="register-branding">
          <div className="branding-logo">R</div>
          <h1 className="branding-title">Join Us Today!</h1>
          <p className="branding-text">Create your account and start building your professional portfolio.</p>

          <div className="branding-features">
            <div className="feature-item">
              <div className="feature-icon"><i className="bi bi-folder"></i></div>
              <span>Manage Projects</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="bi bi-award"></i></div>
              <span>Upload Certificates</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="bi bi-images"></i></div>
              <span>Gallery Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
