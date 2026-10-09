// src/hooks/useRequireAuth.js
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { useTokenStore } from '@/stores/useTokenStore';
import { isTokenExpired } from '@/utils/jwt-utils';

/**
 * Hook محافظت از صفحات و مدیریت سیشن
 *
 * ✅ FIX: جلوگیری از ریدایرکت اجباری به صفحه /auth/login
 * به جای آن، مدال احراز هویت باز می‌شود و UI (مثل تب‌بار) خودکار آپدیت می‌شود.
 * سیشن کاربر به لطف Refresh Token تا ۳۰ روز اعتبار دارد.
 *
 * @param {object} options
 * @param {boolean} options.redirectToLogin - آیا در صورت عدم احراز هویت، چالش لاگین نشان داده شود؟
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

    const validateSession = async () => {
      const hasToken = useTokenStore.getState().getAccessToken();

      // ۱. اگر توکن وجود دارد ولی منقضی شده، تلاش برای refresh (اعتبار ۳۰ روزه)
      if (isAuthenticated && hasToken && isTokenExpired(hasToken)) {
        const isValid = await checkSession();
        if (!isValid) {
          // سیشن کاملاً منقضی شده (بعد از ۱ ماه) یا refresh شکست خورده
          // به جای ریدایرکت به /auth/login، به صفحه اصلی برو و مدال را باز کن
          if (pathname !== '/') {
            router.replace('/');
          }
          // تاخیر کوتاه برای جلوگیری از فلش زدن صفحه و اطمینان از رندر شدن لای‌اوت
          setTimeout(() => openAuthModal(), 300);
        }
        return;
      }

      // ۲. اگر کلاً لاگین نیست
      if (!isAuthenticated) {
        // صفحاتی که حتماً نیاز به لاگین دارند
        const protectedPrefixes = ['/manage', '/profile', '/create-business'];
        const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
        
        if (isProtected && pathname !== '/') {
          // اگر در صفحه محافظت‌شده است، به خانه برگردان
          router.replace('/');
          setTimeout(() => openAuthModal(), 300);
        } else if (redirectToLogin) {
          // اگر کامپوننت صراحتاً خواسته که چالش لاگین نشان دهد (مثلاً هنگام کلیک روی دکمه رزرو)
          openAuthModal();
        }
      }
    };

    validateSession();
  }, [isAuthenticated, hydrated, router, pathname, openAuthModal, checkSession, redirectToLogin]);

  return { isAuthenticated, hydrated };
};