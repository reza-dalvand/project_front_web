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
 *  ۳. لاگین هست و کسب‌وکار دارد ولی هنوز تایید نشده → layout پیام مناسب نشان می‌دهد
 *  ۴. لاگین هست و کسب‌وکار تایید شده → دسترسی مجاز
 */
export const useRequireBusiness = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authHydrated = useAuthStore((s) => s._hydrated);
  const checkSession = useAuthStore((s) => s.checkSession);
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  const businessId = useBusinessStore((s) => s.businessData?.id);
  const businessStatus = useBusinessStore((s) => s.businessStatus);
  const businessDataStatus = useBusinessStore((s) => s.businessData?.status);
  const businessIsActive = useBusinessStore((s) => s.businessData?.isActive);

  // آیا کاربر اصلاً کسب‌وکاری دارد؟
  const hasBusiness = Boolean(businessId) || Boolean(businessStatus);

  // آیا کسب‌وکار تایید نهایی شده است؟
  const isApproved =
    businessStatus === 'approved' ||
    businessDataStatus === 'approved' ||
    businessIsActive === true;

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

      // ─── ۲. بررسی اعتبار session ───
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

      // نکته:
      // اگر hasBusiness true باشد ولی isApproved false باشد،
      // در اینجا ریدایرکت نمی‌کنیم؛ layout پیام «در انتظار تایید / تایید نشده» نشان می‌دهد.
    };

    validate();
  }, [
    isAuthenticated,
    authHydrated,
    hasBusiness,
    router,
    pathname,
    checkSession,
    openAuthModal,
  ]);

  return {
    isAuthenticated,
    hasBusiness,
    isApproved,
    businessStatus,
    hydrated: authHydrated,
  };
};