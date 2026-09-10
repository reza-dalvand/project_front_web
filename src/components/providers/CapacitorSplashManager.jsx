'use client';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

const APP_START_TS = Date.now();
const MIN_SPLASH_MS = 2000; // حداقل زمان نمایش اسپلش برند

export default function CapacitorSplashManager() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (hidden) return;

    const hideSplash = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        const elapsed = Date.now() - APP_START_TS;
        const wait = Math.max(300, MIN_SPLASH_MS - elapsed);
        await new Promise((r) => setTimeout(r, wait));
        await SplashScreen.hide();
        setHidden(true);
      } catch {
        setHidden(true);
      }
    };

    if (document.readyState === 'complete') hideSplash();
    else {
      window.addEventListener('load', hideSplash);
      return () => window.removeEventListener('load', hideSplash);
    }
  }, [hidden]);

  return null;
}