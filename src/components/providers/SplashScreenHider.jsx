'use client';
import { useEffect } from 'react';

const MIN_VISIBLE_MS = 2000; // حداقل نمایش برند
const MAX_VISIBLE_MS = 6000; // fallback ایمنی — حتی اگر همه‌چیز خراب شد، قفل نمی‌شود
const START_TS = Date.now();

export default function SplashScreenHider() {
  useEffect(() => {
    let done = false;

    const hide = () => {
      if (done) return;
      done = true;
      const node = document.getElementById('web-splash-screen');
      if (!node) return;
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - START_TS));
      setTimeout(() => {
        node.classList.add('hide');
        setTimeout(() => node.remove(), 700);
      }, wait);
    };

    if (document.readyState === 'complete') {
      setTimeout(hide, 300); // فرصت کوتاه برای هیدریشن React
    } else {
      window.addEventListener('load', () => setTimeout(hide, 300), { once: true });
    }

    const t = setTimeout(hide, MAX_VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  return null;
}