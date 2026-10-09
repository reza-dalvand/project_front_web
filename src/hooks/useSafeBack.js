// src/hooks/useSafeBack.js
'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ناوبری ایمن به عقب
 * - اگه تاریخچه وجود داره → router.back()
 * - اگه تاریخچه خالیه → جایگزینی با مسیر فالبک
 *
 * @param {string} fallback - مسیر جایگزین وقتی تاریخچه خالیه
 * @returns {function} تابع ناوبری ایمن
 */
export const useSafeBack = (fallback = '/manage') => {
  const router = useRouter();

  return useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.replace(fallback);
    }
  }, [router, fallback]);
};