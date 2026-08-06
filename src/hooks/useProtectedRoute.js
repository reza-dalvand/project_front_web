// src/hooks/useProtectedRoute.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/stores/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * هوک محافظت از صفحاتی که نیاز به لاگین دارند
 * اگر کاربر لاگین نباشد، مدال Auth باز می‌شود
 *
 * @param {string} redirectPath - مسیر بازگشت پس از لاگین
 */
export const useProtectedRoute = (redirectPath = '/') => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    // صبر می‌کنیم تا store hydrate شود
    const timeout = setTimeout(() => {
      if (!isAuthenticated) {
        // به جای redirect، مدال را باز می‌کنیم
        openAuthModal(() => {
          // پس از لاگین موفق، کاربر در همان صفحه می‌ماند
        });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, openAuthModal]);

  return { isAuthenticated };
};
