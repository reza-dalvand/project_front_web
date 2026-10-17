// src/hooks/useRequireAuth.js
'use client';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { useTokenStore } from '@/stores/useTokenStore';
import { isTokenExpired } from '@/utils/jwt-utils';

const PROTECTED_PREFIXES = ['/manage', '/profile', '/create-business'];

/**
 * Hook محافظت از صفحات و مدیریت سیشن
 *
 * ✅ FIX:
 * - جلوگیری از ریدایرکت اجباری به /auth/login
 * - جلوگیری از اجرای موازی/مکرر checkSession
 * - جلوگیری از باز شدن مکرر AuthModal
 * - کاهش dependency‌های ناپایدار effect
 */
export const useRequireAuth = (options = {}) => {
  const { redirectToLogin = false } = options;

  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s._hydrated);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);
  const checkSession = useAuthStore((s) => s.checkSession);

  const routerRef = useRef(router);
  const openAuthModalRef = useRef(openAuthModal);
  const checkSessionRef = useRef(checkSession);

  const modalTimerRef = useRef(null);
  const sessionCheckInFlightRef = useRef(false);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    openAuthModalRef.current = openAuthModal;
  }, [openAuthModal]);

  useEffect(() => {
    checkSessionRef.current = checkSession;
  }, [checkSession]);

  useEffect(() => {
    return () => {
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
        modalTimerRef.current = null;
      }
    };
  }, []);

  const scheduleAuthModal = () => {
    if (modalTimerRef.current) {
      clearTimeout(modalTimerRef.current);
    }

    modalTimerRef.current = setTimeout(() => {
      modalTimerRef.current = null;
      openAuthModalRef.current?.();
    }, 300);
  };

  const redirectToHomeAndOpenModal = () => {
    if (pathname !== '/') {
      routerRef.current.replace('/');
    }
    scheduleAuthModal();
  };

  useEffect(() => {
    if (!hydrated) return;

    // ─── کاربر لاگین نیست ───
    if (!isAuthenticated) {
      const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix)
      );

      if (isProtected && pathname !== '/') {
        redirectToHomeAndOpenModal();
      } else if (redirectToLogin) {
        scheduleAuthModal();
      }

      return;
    }

    // ─── کاربر لاگین است؛ فقط در صورت انقضای توکن checkSession اجرا شود ───
    if (sessionCheckInFlightRef.current) return;

    const accessToken = useTokenStore.getState().getAccessToken();

    if (!accessToken || !isTokenExpired(accessToken)) {
      return;
    }

    sessionCheckInFlightRef.current = true;

    (async () => {
      try {
        const isValid = await checkSessionRef.current?.();

        if (!isValid) {
          redirectToHomeAndOpenModal();
        }
      } catch {
        // خطای شبکه/سرور ⇒ کاربر را فوراً لاگین‌اوت نمی‌کنیم
      } finally {
        sessionCheckInFlightRef.current = false;
      }
    })();
  }, [isAuthenticated, hydrated, pathname, redirectToLogin]);

  return { isAuthenticated, hydrated };
};