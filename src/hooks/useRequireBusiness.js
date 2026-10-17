// src/hooks/useRequireBusiness.js
'use client';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthModalStore } from '@/stores/useAuthStore';
import { useBusinessStore } from '@/stores/useBusinessStore';

/**
 * محافظ صفحات کسب‌وکار
 *
 * قوانین:
 *  ۱. لاگین نیست → باز کردن مدال لاگین و ریدایرکت به خانه
 *  ۲. لاگین هست ولی کسب‌وکار ندارد → ریدایرکت به /create-business
 *  ۳. لاگین هست و کسب‌وکار دارد ولی هنوز تایید نشده → layout پیام مناسب نشان می‌دهد
 *  ۴. لاگین هست و کسب‌وکار تایید شده → دسترسی مجاز
 *
 * ✅ FIX بحرانی:
 * - جلوگیری از ریدایرکت زودهنگام به /create-business قبل از اتمام fetchBusinessDetail
 * - جلوگیری از اجرای مکرر checkSession با useRef
 * - جلوگیری از باز شدن مکرر AuthModal با cleanup timeout
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
  const businessFetchState = useBusinessStore((s) => s.businessFetchState);

  const hasBusiness = Boolean(businessId) || Boolean(businessStatus);

  const isApproved =
    businessStatus === 'approved' ||
    businessDataStatus === 'approved' ||
    businessIsActive === true;

  // refs برای جلوگیری از dependency ناپایدار و re-run غیرضروری effect
  const routerRef = useRef(router);
  const checkSessionRef = useRef(checkSession);
  const openAuthModalRef = useRef(openAuthModal);

  const modalTimerRef = useRef(null);
  const sessionCheckInFlightRef = useRef(false);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    checkSessionRef.current = checkSession;
  }, [checkSession]);

  useEffect(() => {
    openAuthModalRef.current = openAuthModal;
  }, [openAuthModal]);

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

  // ─── ۱. بررسی احراز هویت و session ───
  useEffect(() => {
    if (!authHydrated) return;

    if (!isAuthenticated) {
      redirectToHomeAndOpenModal();
      return;
    }

    if (sessionCheckInFlightRef.current) return;

    sessionCheckInFlightRef.current = true;

    (async () => {
      try {
        const isValid = await checkSessionRef.current?.();

        if (!isValid) {
          redirectToHomeAndOpenModal();
        }
      } catch {
        // در خطای شبکه/سرور، کاربر را بیرون نمی‌اندازیم
        // فقط session check بعدی اجازه اجرا پیدا کند.
      } finally {
        sessionCheckInFlightRef.current = false;
      }
    })();
  }, [authHydrated, isAuthenticated, pathname]);

  // ─── ۲. گیت کسب‌وکار فقط بعد از آماده شدن fetch ───
  useEffect(() => {
    if (!authHydrated || !isAuthenticated) return;

    // ✅ اگر fetch کسب‌وکار هنوز تمام نشده، ریدایرکت نکن
    if (businessFetchState !== 'ready') return;

    if (!hasBusiness && pathname !== '/create-business') {
      routerRef.current.replace('/create-business');
    }
  }, [
    authHydrated,
    isAuthenticated,
    businessFetchState,
    hasBusiness,
    pathname,
  ]);

  return {
    isAuthenticated,
    hasBusiness,
    isApproved,
    businessStatus,
    hydrated: authHydrated,
  };
};