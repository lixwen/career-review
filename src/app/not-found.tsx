'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // 自动重定向到贪吃蛇404页面
    router.push('/snake-404');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center pixel-scanlines" style={{ background: 'var(--pixel-bg)' }}>
      <div className="text-center">
        <div className="pixel-title text-xl mb-4" style={{ color: 'var(--pixel-danger)' }}>
          REDIRECTING...
        </div>
        <div className="pixel-blink text-lg" style={{ color: 'var(--pixel-accent)' }}>
          █
        </div>
      </div>
    </div>
  );
} 