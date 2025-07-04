'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 检查是否已通过验证
    const isAuthenticated = localStorage.getItem('d5_authenticated');
    if (isAuthenticated === 'true') {
      router.push('/main');
    } else {
      router.push('/auth');
    }
  }, [router]);

  // 显示加载界面
  return (
    <div className="min-h-screen flex items-center justify-center pixel-scanlines" style={{ background: 'var(--pixel-bg)' }}>
      <div className="text-center">
        <div className="pixel-title text-xl mb-4" style={{ color: 'var(--pixel-primary)' }}>
          INITIALIZING...
        </div>
        <div className="pixel-blink text-lg" style={{ color: 'var(--pixel-accent)' }}>
          █
        </div>
      </div>
    </div>
  );
}
