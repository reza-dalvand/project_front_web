'use client';
import { useEffect } from 'react';

const MIN_VISIBLE_MS = 2000;
const START_TS = Date.now();

export default function SplashScreenHider() {
  useEffect(() => {
    // ۱. ایجاد نود اسپلش اسکرین به صورت دستی (خارج از کنترل React)
    let node = document.getElementById('web-splash-screen');
    if (!node) {
      node = document.createElement('div');
      node.id = 'web-splash-screen';
      node.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: 99999; display: flex; align-items: center; justify-content: center;
        overflow: hidden; background-color: #F5F0EC; transition: opacity 0.6s ease-out;
      `;
      node.innerHTML = `
        <img src="/spalsh.png" alt="بیو کلاب" style="width: 100%; height: 100%; object-fit: cover;" />
      `;
      document.body.prepend(node);
    }

    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - START_TS));
      setTimeout(() => {
        node.style.opacity = '0';
        // ✅ چون این نود توسط React ساخته نشده، remove() ارور removeChild نمی‌دهد
        setTimeout(() => {
          if (node && node.parentNode) node.remove();
        }, 700);
      }, wait);
    };

    if (document.readyState === 'complete') {
      setTimeout(hide, 300);
    } else {
      window.addEventListener('load', hide);
      return () => window.removeEventListener('load', hide);
    }
  }, []);

  return null;
}