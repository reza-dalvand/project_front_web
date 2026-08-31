// src/app/auth/layout.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthLayout({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s._hydrated);

  // ✅ اگر کاربر لاگین است، ریدایرکت به خانه
  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated) {
      router.replace('/'); // replace نه push → صفحه لاگین از history حذف می‌شود
    }
  }, [isAuthenticated, hydrated, router]);

  // تا قبل از هیدریت، چیزی نمایش نده
  if (!hydrated || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return <>{children}</>;
}