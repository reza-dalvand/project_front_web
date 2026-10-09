// src/hooks/useRequireBusiness.js
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';

/**
 * محافظ صفحات کسب‌وکار
 *
 * قوانین:
 *  ۱. لاگین نیست → باز کردن مدال لاگین و ریدایرکت به خانه (بدون رفتن به /auth/login)
 *  ۲. لاگین هست ولی کسب‌وکار ندارد → ریدایرکت به /create-business
 *  ۳. لاگین هست و کسب‌وکار دارد → دسترسی مجاز
 */
export const useRequireBusiness = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authHydrated = useAuthStore((s) => s._hydrated);
  const checkSession = useAuthStore((s) => s.checkSession);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  // بررسی ساده‌تر — فقط وجود id یا businessStatus کافی است
  const hasBusiness = useBusinessStore(
    (s) => Boolean(s.businessData?.id) || Boolean(s.businessStatus)
  );

  useEffect(() => {
    if (!authHydrated) return;

    const validate = async () => {
      // ─── ۱. لاگین نیست → مدال لاگین و ریدایرکت به خانه ───
      if (!isAuthenticated) {
        if (pathname !== '/') {
          router.replace('/');
        }
        setTimeout(() => openAuthModal(), 300);
        return;
      }

      // ─── ۲. بررسی اعتبار session (تلاش برای استفاده از Refresh Token ۳۰ روزه) ───
      const isValid = await checkSession();
      if (!isValid) {
        if (pathname !== '/') {
          router.replace('/');
        }
        setTimeout(() => openAuthModal(), 300);
        return;
      }

      // ─── ۳. کسب‌وکار ندارد → ریدایرکت به ثبت کسب‌وکار ───
      if (!hasBusiness) {
        router.replace('/create-business');
      }
    };

    validate();
  }, [isAuthenticated, authHydrated, hasBusiness, router, pathname, checkSession, openAuthModal]);

  return {
    isAuthenticated,
    hasBusiness,
    hydrated: authHydrated,
  };
};