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
import apiClient from '@/api/api-client';

/**
 * 📦 Store نسخه اپلیکیشن
 *
 * ✅ فاز ۵: MOCK_REMOTE_CONFIG حذف شد.
 * اطلاعات نسخه فقط از API دریافت می‌شود.
 *
 * Endpoint پیشنهادی بک‌اند:
 *   GET /config/app-version/
 *   Response: {
 *     latest_version: string,
 *     min_required_version: string,
 *     is_force_update: boolean,
 *     release_date: string,
 *     title: string,
 *     update_message: string,
 *     changelog: [{ icon: string, text: string }],
 *     store_url: string,
 *     store_name: string
 *   }
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
       * ✅ فقط از بک‌اند می‌خواند — بدون fallback ماک
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
          // ✅ در صورت خطای API، مدال آپدیت نمایش داده نمی‌شود
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
       * باز کردن لینک آپدیت (در وب = ریلود صفحه)
       */
      openStore: async () => {
        const { updateInfo } = get();
        if (!updateInfo) return;

        // در وب، صفحه را ریلود کن
        window.location.reload();
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
