// src/components/providers/CapacitorSplashManager.jsx
'use client';
import { useEffect } from 'react';

export default function CapacitorSplashManager() {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (Capacitor.isNativePlatform()) {
          const { SplashScreen } = await import('@capacitor/splash-screen');
          // کمی تاخیر برای اطمینان از رندر شدن اولیه UI و جلوگیری از پرش
          setTimeout(() => {
            SplashScreen.hide({ fadeOutDuration: 300 });
          }, 200);
        }
      } catch (e) {
        // در محیط وب یا خطاهای احتمالی، سکوت اختیار کن
      }
    };
    
    hideSplash();
  }, []);

  return null;
}