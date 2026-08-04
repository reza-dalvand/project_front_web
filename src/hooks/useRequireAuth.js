// src/hooks/useRequireAuth.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAuthModalStore } from '@/stores/useAuth';
/**
 * Hook محافظت از صفحاتی که نیاز به لاگین دارند
 *
 * اگر کاربر لاگین نباشد:
 * - در صفحات اصلی: مدال Auth باز می‌شود
 * - در صفحات حساس (مثل /profile): ریدایرکت به /login
 */
export const useRequireAuth = (options = {}) => {
  const { redirectToLogin = false } = options;
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated) {
      if (redirectToLogin) {
        router.replace(`/auth/login/?redirect=${encodeURIComponent(pathname)}`);
      } else {
        openAuthModal();
      }
    }
  }, [isAuthenticated, hydrated, redirectToLogin, router, pathname, openAuthModal]);

  return { isAuthenticated, hydrated };
};