// src/stores/useAppVersionStore.js
'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  APP_VERSION,
  compareVersions,
  DEFAULT_STORE_URL,
  DEFAULT_STORE_NAME,
} from '@/constants/appVersion';

// شبیه‌سازی تنظیمات ریموت نسخه
const MOCK_REMOTE_CONFIG = {
  latestVersion: '1.2.0',
  minRequiredVersion: '1.0.0',
  isForceUpdate: false,
  releaseDate: '۱۴۰۳/۰۵/۱۵',
  title: 'نسخه جدید زیبانو منتشر شد!',
  updateMessage: 'برای تجربه بهتر، لطفاً به آخرین نسخه به‌روزرسانی کنید.',
  changelog: [
    { icon: '✨', text: 'افزوده شدن سیستم نظردهی' },
    { icon: '⚡', text: 'بهبود سرعت بارگذاری' },
    { icon: '🛡️', text: 'ارتقای امنیت حساب کاربری' },
  ],
  storeUrl: DEFAULT_STORE_URL,
  storeName: DEFAULT_STORE_NAME,
};

export const useAppVersionStore = create(
  persist(
    (set, get) => ({
      updateInfo: null,
      checking: false,
      dismissed: false,
      dismissedVersion: null,

      // بررسی نسخه جدید
      checkForUpdate: async (silent = false) => {
        if (!silent) set({ checking: true });

        try {
          // شبیه‌سازی درخواست API
          await new Promise((r) => setTimeout(r, 800));

          const config = MOCK_REMOTE_CONFIG;

          const compareLatest = compareVersions(APP_VERSION, config.latestVersion);
          const compareMin = compareVersions(APP_VERSION, config.minRequiredVersion);

          // اگر نسخه فعلی آخرین نسخه است، آپدیتی وجود ندارد
          if (compareLatest >= 0) {
            set({ updateInfo: null, checking: false });
            return;
          }

          // بررسی آپدیت اجباری
          const isForce = compareMin < 0 || config.isForceUpdate === true;

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
              title: config.title,
              updateMessage: config.updateMessage,
              changelog: config.changelog || [],
              storeUrl: config.storeUrl || DEFAULT_STORE_URL,
              storeName: config.storeName || DEFAULT_STORE_NAME,
            },
            checking: false,
          });
        } catch (error) {
          console.log('Update check failed:', error);
          set({ checking: false });
        }
      },

      // رد کردن آپدیت اختیاری
      dismissOptionalUpdate: () => {
        const { updateInfo } = get();
        if (!updateInfo || updateInfo.isForceUpdate) return;

        set({
          dismissed: true,
          updateInfo: null,
          dismissedVersion: updateInfo.latestVersion,
        });
      },

      // باز کردن لینک آپدیت (در وب = ریلود صفحه)
      openStore: async () => {
        const { updateInfo } = get();
        if (!updateInfo) return;

        // در وب، می‌توان صفحه را ریلود کرد
        window.location.reload();
      },

      // گوش دادن به تغییر visibility صفحه
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
      name: 'zibano-app-version-storage',
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
