// src/hooks/useRequireAuth.js
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { useTokenStore } from '@/stores/useTokenStore';
import { isTokenExpired } from '@/utils/jwt-utils';

/**
 * Hook محافظت از صفحات
 *
 * @param {object} options
 * @param {boolean} options.redirectToLogin - ریدایرکت به صفحه لاگین یا باز کردن مدال
 * @returns {{ isAuthenticated: boolean, hydrated: boolean }}
 */
export const useRequireAuth = (options = {}) => {
  const { redirectToLogin = false } = options;
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s._hydrated);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    if (!hydrated) return;

    // بررسی اعتبار توکن
    const validateSession = async () => {
      const hasToken = useTokenStore.getState().getAccessToken();

      if (isAuthenticated && hasToken && isTokenExpired(hasToken)) {
        // توکن منقضی شده — تلاش برای refresh
        const isValid = await checkSession();
        if (!isValid) {
          // Refresh failed — خروج
          if (redirectToLogin) {
            router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          } else {
            openAuthModal();
          }
        }
        return;
      }

      if (!isAuthenticated) {
        if (redirectToLogin) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          openAuthModal();
        }
      }
    };

    validateSession();
  }, [isAuthenticated, hydrated, redirectToLogin, router, pathname, openAuthModal, checkSession]);

  return { isAuthenticated, hydrated };
};
