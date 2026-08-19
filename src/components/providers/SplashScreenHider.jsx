// src/components/providers/SplashScreenHider.jsx
'use client';
import { useEffect } from 'react';

/**
 * ✅ مخفی‌سازی Splash Screen بدون حذف از DOM
 *
 * ⚠️ نکته مهم: هرگز node را از DOM حذف نکنید!
 * React آن node را در Virtual DOM دارد و اگر حذف شود،
 * خطای hydration mismatch می‌دهد:
 * "Failed to execute 'removeChild' on 'Node'"
 *
 * راه‌حل: فقط display:none بدهید.
 */
export default function SplashScreenHider() {
  useEffect(() => {
    const splash = document.getElementById('web-splash-screen');
    if (!splash) return;

    // تأخیر کوتاه برای اطمینان از paint شدن کامل اپ
    const hideTimer = setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';

      // بعد از اتمام انیمیشن fade، مخفی کن (نه حذف!)
      const removeTimer = setTimeout(() => {
        splash.style.display = 'none';
      }, 600);

      return () => clearTimeout(removeTimer);
    }, 300);

    return () => clearTimeout(hideTimer);
  }, []);

  return null;
}
