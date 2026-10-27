'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stats {
  projects: number;
  certificates: number;
  gallery: number;
}

interface Activity {
  icon: string;
  iconClass: string;
  text: string;
  time: string;
}

export default function DashboardPage() {
  const [adminName] = useState(() => {
    if (typeof window === 'undefined') return 'Admin';
    return localStorage.getItem('adminName') || 'Admin';
  });
  const [, setStats] = useState<Stats>({ projects: 0, certificates: 0, gallery: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<unknown>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const gridsRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (welcomeRef.current) {
        gsap.fromTo(welcomeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      }
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, delay: 0.15, ease: 'power3.out' }
        );
      }
      if (gridsRef.current) {
        gsap.fromTo(
          gridsRef.current.children,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 0.3, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const animateCounter = useCallback((element: HTMLElement, target: number, duration = 2000) => {
    const startTime = performance.now();
    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      element.textContent = String(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = String(target);
      }
    }
    requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setStats(data);

        ['galleryCount', 'projectCount', 'certCount', 'profileGallery', 'profileProjects', 'profileCerts'].forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            const key = id.includes('gallery') || id.includes('Gallery') ? 'gallery' :
              id.includes('project') || id.includes('Project') ? 'projects' : 'certificates';
            animateCounter(el, data[key]);
          }
        });

        // Load real views
        try {
          const viewsRes = await fetch('/api/views');
          const viewsData = await viewsRes.json();
          const viewsEl = document.getElementById('viewsCount');
          if (viewsEl && typeof viewsData.totalViews === 'number') {
            animateCounter(viewsEl, viewsData.totalViews);
          }
          const monthlyEl = document.getElementById('viewsMonthly');
          if (monthlyEl && typeof viewsData.monthlyViews === 'number') {
            monthlyEl.textContent = `+${viewsData.monthlyViews} this month`;
          }
        } catch (e) {
          console.error('Error fetching views:', e);
        }

        if (chartRef.current) {
          const Chart = (await import('chart.js/auto')).default;
          if (chartInstanceRef.current) {
            (chartInstanceRef.current as { destroy: () => void }).destroy();
          }
          const ctx = chartRef.current.getContext('2d')!;
          const gradientPrimary = ctx.createLinearGradient(0, 0, 0, 300);
          gradientPrimary.addColorStop(0, 'rgba(219, 39, 119, 0.9)'); // pink primary
          gradientPrimary.addColorStop(1, 'rgba(219, 39, 119, 0.4)');
          const gradientSecondary = ctx.createLinearGradient(0, 0, 0, 300);
          gradientSecondary.addColorStop(0, 'rgba(244, 114, 182, 0.9)'); // lighter pink
          gradientSecondary.addColorStop(1, 'rgba(244, 114, 182, 0.4)');
          const gradientSuccess = ctx.createLinearGradient(0, 0, 0, 300);
          gradientSuccess.addColorStop(0, 'rgba(159, 18, 57, 0.9)'); // dark pink
          gradientSuccess.addColorStop(1, 'rgba(159, 18, 57, 0.4)');

          chartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Gallery', 'Projects', 'Certificates'],
              datasets: [{
                data: [data.gallery, data.projects, data.certificates],
                backgroundColor: [gradientPrimary, gradientSecondary, gradientSuccess],
                borderColor: ['rgba(219, 39, 119, 1)', 'rgba(244, 114, 182, 1)', 'rgba(159, 18, 57, 1)'],
                borderWidth: 2,
                hoverOffset: 8,
                borderRadius: 4,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { padding: 24, usePointStyle: true, pointStyle: 'circle', font: { family: 'Outfit', size: 13, weight: 500 } },
                },
              },
              cutout: '70%',
              animation: { animateRotate: true, animateScale: true, duration: 2000, easing: 'easeOutQuart' },
            },
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    async function loadActivity() {
      try {
        const [projRes, certRes, galRes] = await Promise.all([
          fetch('/api/projects'), fetch('/api/certificates'), fetch('/api/gallery'),
        ]);
        const [projData, certData, galData] = await Promise.all([projRes.json(), certRes.json(), galRes.json()]);
        const acts: Activity[] = [];
        if (Array.isArray(projData) && projData.length > 0) {
          acts.push({ icon: 'folder-plus', iconClass: 'primary', text: `Project "${projData[0].nama}" is live`, time: 'Latest project' });
        }
        if (Array.isArray(certData) && certData.length > 0) {
          acts.push({ icon: 'award', iconClass: 'success', text: `Certificate "${certData[0].nama}" uploaded`, time: 'Latest certificate' });
        }
        if (Array.isArray(galData) && galData.length > 0) {
          acts.push({ icon: 'image', iconClass: 'warning', text: `${galData.length} gallery images available`, time: 'Gallery updated' });
        }
        setActivities(acts);
      } catch (error) {
        console.error('Error loading activity:', error);
      }
    }

    loadStats();
    loadActivity();
  }, [animateCounter]);

  return (
    <>
      {/* Welcome Section */}
      {/* <div className="welcome-card" ref={welcomeRef}>
        <div className="welcome-content">
          <h2 className="welcome-title">{getGreeting()}, {adminName}!</h2>
          <p className="welcome-text">Here&apos;s an overview of your portfolio performance today.</p>
          <p className="welcome-date">{getCurrentDate()}</p>
        </div>
      </div> */}

      {/* Stats Grid */}
      <div className="stats-grid" ref={statsRef}>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Gallery</h3>
            <div className="stat-value" id="galleryCount">0</div>
            <div className="stat-change"><i className="bi bi-image"></i> Images uploaded</div>
          </div>
          <div className="stat-icon"><i className="bi bi-images"></i></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Projects</h3>
            <div className="stat-value" id="projectCount">0</div>
            <div className="stat-change"><i className="bi bi-check-circle"></i> Projects completed</div>
          </div>
          <div className="stat-icon"><i className="bi bi-folder"></i></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Certificates</h3>
            <div className="stat-value" id="certCount">0</div>
            <div className="stat-change"><i className="bi bi-trophy"></i> Certificates earned</div>
          </div>
          <div className="stat-icon"><i className="bi bi-award"></i></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Profile Views</h3>
            <div className="stat-value" id="viewsCount">0</div>
            <div className="stat-change"><i className="bi bi-arrow-up"></i> <span id="viewsMonthly">+0 this month</span></div>
          </div>
          <div className="stat-icon"><i className="bi bi-eye"></i></div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div ref={gridsRef}>
        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Portfolio Overview</h3>
              <span className="badge-tag badge-primary">Live Data</span>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {activities.length > 0 ? activities.map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon"><i className={`bi bi-${a.icon}`}></i></div>
                    <div className="activity-content">
                      <p className="activity-text">{a.text}</p>
                      <span className="activity-time">{a.time}</span>
                    </div>
                  </div>
                )) : (
                  <>
                    <div className="activity-item">
                      <div className="activity-icon"><i className="bi bi-folder-plus"></i></div>
                      <div className="activity-content"><p className="activity-text">New project added to portfolio</p><span className="activity-time">Just now</span></div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon"><i className="bi bi-award"></i></div>
                      <div className="activity-content"><p className="activity-text">Certificate uploaded successfully</p><span className="activity-time">2 hours ago</span></div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon"><i className="bi bi-image"></i></div>
                      <div className="activity-content"><p className="activity-text">Gallery images updated</p><span className="activity-time">Yesterday</span></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Profile */}
        <div className="grid-2 mt-3">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
            <div className="card-body">
              <div className="actions-grid">
                <Link href="/dashboard/projects" className="action-card">
                  <div className="action-icon"><i className="bi bi-folder-plus"></i></div>
                  <span className="action-label">Add Project</span>
                </Link>
                <Link href="/dashboard/certificates" className="action-card">
                  <div className="action-icon"><i className="bi bi-award"></i></div>
                  <span className="action-label">Add Certificate</span>
                </Link>
                <Link href="/dashboard/gallery" className="action-card">
                  <div className="action-icon"><i className="bi bi-images"></i></div>
                  <span className="action-label">Add Gallery</span>
                </Link>
                <Link href="/" target="_blank" className="action-card">
                  <div className="action-icon"><i className="bi bi-globe"></i></div>
                  <span className="action-label">View Portfolio</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Admin Profile</h3>
            </div>
            <div className="card-body">
              <div className="profile-card">
                <div className="profile-avatar">{adminName.charAt(0).toUpperCase()}</div>
                <h3 className="profile-name">{adminName}</h3>
                <p className="profile-email">vannisamaulvi@gmail.com</p>
                <div className="profile-stats">
                  <div className="profile-stat">
                    <div className="profile-stat-value" id="profileProjects">0</div>
                    <div className="profile-stat-label">Projects</div>
                  </div>
                  <div className="profile-stat">
                    <div className="profile-stat-value" id="profileCerts">0</div>
                    <div className="profile-stat-label">Certificates</div>
                  </div>
                  <div className="profile-stat">
                    <div className="profile-stat-value" id="profileGallery">0</div>
                    <div className="profile-stat-label">Gallery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
