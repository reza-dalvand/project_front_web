'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  APP_VERSION,
  compareVersions,
  DEFAULT_STORE_URL,
  DEFAULT_STORE_NAME,
} from '@/constants/appVersion';
import apiClient from '@/api/api-client';
import { Capacitor } from '@capacitor/core';

/**
 * 📦 Store نسخه اپلیکیشن
 *
 * ✅ فاز ۵: MOCK_REMOTE_CONFIG حذف شد.
 * ✅ فاز ۶: پشتیبانی کامل از PWA (پاک‌سازی کش و ریلود اجباری در وب)
 */
export const useAppVersionStore = create(
  persist(
    (set, get) => ({
      updateInfo: null,
      checking: false,
      dismissed: false,
      dismissedVersion: null,

      /**
       * بررسی نسخه جدید از API
       */
      checkForUpdate: async (silent = false) => {
        if (!silent) set({ checking: true });

        try {
          const response = await apiClient.get('/config/app-version/');
          const config = response.data;

          // ✅ فاز ۳: خوانش camelCase (بعد از نرمال‌ساز)
          if (!config?.latestVersion) {
            set({ updateInfo: null, checking: false });
            return;
          }

          const compareLatest = compareVersions(APP_VERSION, config.latestVersion);
          const compareMin = compareVersions(APP_VERSION, config.minRequiredVersion);

          // اگر نسخه فعلی آخرین نسخه است، آپدیتی وجود ندارد
          if (compareLatest >= 0) {
            set({ updateInfo: null, checking: false });
            return;
          }

          // ✅ تشخیص پلتفرم
          const isNative = Capacitor.isNativePlatform();
          const isForce = compareMin < 0 || config.isForceUpdate === true;

          // ✅ منطق اختصاصی اندروید (بررسی تیک‌های ادمین)
          if (isNative) {
            if (isForce && !config.androidForceUpdateEnabled) {
              set({ updateInfo: null, checking: false });
              return;
            }
            if (!isForce && !config.androidOptionalUpdateEnabled) {
              set({ updateInfo: null, checking: false });
              return;
            }
          }
          // 🌐 در محیط وب/PWA، اگر نسخه جدیدی باشد (compareLatest < 0)، 
          // مستقیماً به بخش ساخت updateInfo می‌رویم (بدون نیاز به تیک‌های اندروید).

          // اگر آپدیت اختیاری است و کاربر قبلاً رد کرده
          if (!isForce) {
            const { dismissedVersion } = get();
            if (dismissedVersion === config.latestVersion) {
              set({ dismissed: true, updateInfo: null, checking: false });
              return;
            }
          }

          set({
            updateInfo: {
              currentVersion: APP_VERSION,
              latestVersion: config.latestVersion,
              isForceUpdate: isForce,
              title: config.title || 'نسخه جدید بیو کلاب منتشر شد!',
              updateMessage:
                config.updateMessage || 'برای تجربه بهتر، لطفاً به آخرین نسخه به‌روزرسانی کنید.',
              changelog: config.changelog || [],
              storeUrl: config.storeUrl || DEFAULT_STORE_URL,
              storeName: config.storeName || DEFAULT_STORE_NAME,
            },
            checking: false,
          });
        } catch (error) {
          console.log('Version check failed (non-critical):', error);
          set({ checking: false });
        }
      },

      /**
       * رد کردن آپدیت اختیاری
       */
      dismissOptionalUpdate: () => {
        const { updateInfo } = get();
        if (!updateInfo || updateInfo.isForceUpdate) return;

        set({
          dismissed: true,
          updateInfo: null,
          dismissedVersion: updateInfo.latestVersion,
        });
      },

      /**
       * باز کردن لینک آپدیت (اندروید = استور / وب = پاک‌سازی کش و ریلود)
       */
      openStore: async () => {
        const { updateInfo } = get();
        if (!updateInfo) return;

        const isNative = Capacitor.isNativePlatform();

        if (typeof window !== 'undefined') {
          if (isNative) {
            // ✅ در اندروید لینک را مستقیماً در اپلیکیشن استور یا مرورگر سیستم باز می‌کند
            const url = updateInfo.storeUrl || DEFAULT_STORE_URL;
            window.open(url, '_system');
          } else {
            // 🌐 در وب / PWA: پاک‌سازی کش Service Worker و ریلود اجباری
            try {
              // ۱. unregister کردن Service Worker
              if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                  await registration.unregister();
                }
              }
              
              // ۲. پاک‌سازی کامل Cache Storage مرورگر
              if ('caches' in window) {
                const cacheKeys = await caches.keys();
                await Promise.all(cacheKeys.map((key) => caches.delete(key)));
              }
            } catch (error) {
              console.error('Error clearing PWA cache:', error);
            }
            
            // ۳. ریلود اجباری صفحه (بدون استفاده از کش مرورگر)
            // استفاده از href برای اطمینان از بای‌پس شدن کش در برخی مرورگرها
            const url = new URL(window.location.href);
            url.searchParams.set('v', Date.now().toString());
            window.location.href = url.toString();
          }
        }
      },

      /**
       * گوش دادن به تغییر visibility صفحه
       */
      initVisibilityListener: () => {
        if (typeof window === 'undefined') return null;

        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            get().checkForUpdate(true);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      },
    }),
    {
      name: 'beau-app-version-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        dismissedVersion: state.dismissedVersion,
      }),
    }
  )
);