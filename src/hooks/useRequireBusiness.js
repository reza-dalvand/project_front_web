// src/hooks/useRequireBusiness.js
/**
 * محافظ صفحات کسب‌وکار
 *
 * قوانین:
 *  ۱. لاگین نیست → ریدایرکت به /auth/login
 *  ۲. لاگین هست ولی کسب‌وکار ندارد → ریدایرکت به /create-business
 *  ۳. لاگین هست و کسب‌وکار دارد (در هر وضعیت: pending, approved, rejected) → دسترسی مجاز
 */
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';

export const useRequireBusiness = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authHydrated = useAuthStore((s) => s._hydrated);
  const checkSession = useAuthStore((s) => s.checkSession);

  // ✅ FIX: بررسی ساده‌تر — فقط وجود id یا businessStatus کافی است
  // نیازی به تأیید شدن بیزینس نیست — حتی بیزینس pending هم باید قابل مدیریت باشد
  const hasBusiness = useBusinessStore(
    (s) => Boolean(s.businessData?.id) || Boolean(s.businessStatus)
  );

  useEffect(() => {
    if (!authHydrated) return;

    const validate = async () => {
      // ─── ۱. لاگین نیست → لاگین ───
      if (!isAuthenticated) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // ─── ۲. بررسی اعتبار session ───
      const isValid = await checkSession();
      if (!isValid) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!hasBusiness) {
        router.replace('/create-business');
      }
    };

    validate();
  }, [isAuthenticated, authHydrated, hasBusiness, router, pathname, checkSession]);

  return {
    isAuthenticated,
    hasBusiness,
    hydrated: authHydrated,
  };
};
