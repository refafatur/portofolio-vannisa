'use client';

import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading spinner for 500ms on every page navigation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div className="page-loader">
          <div className="spinner"></div>
        </div>
      )}
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.4s ease-in-out',
        }}
      >
        {children}
      </div>
    </>
  );
}
