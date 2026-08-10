// src/components/providers/BackButtonHandler.jsx
'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function BackButtonHandler({ children }) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  // ✅ همیشه آخرین مسیر را در ref نگه می‌داریم
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let removeListener = null;

    const initBackButton = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.getPlatform() !== 'android') return;

        const { App } = await import('@capacitor/app');

        removeListener = await App.addListener('backButton', () => {
          const currentPath = pathnameRef.current;
          const isHomePage = currentPath === '/' || currentPath === '';

          // ✅ صفحه اصلی یا history خالی → minimize (نه exit)
          if (isHomePage || window.history.length <= 1) {
            App.minimizeApp();
          } else {
            // ✅ بازگشت به صفحه قبل
            window.history.back();
          }
        });
      } catch (e) {
        console.log('BackButton init failed:', e);
      }
    };

    initBackButton();

    return () => {
      if (removeListener) removeListener.remove();
    };
  }, []);

  return <>{children}</>;
}
