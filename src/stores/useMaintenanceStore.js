// src/stores/useMaintenanceStore.js
'use client';

import { create } from 'zustand';
import apiClient from '@/api/api-client';

/**
 * 🔧 Store حالت تعمیرات
 *
 * ✅ فاز ۵: MOCK_REMOTE_CONFIG حذف شد.
 * وضعیت تعمیرات فقط از API دریافت می‌شود.
 *
 * Endpoint پیشنهادی بک‌اند:
 *   GET /config/maintenance-status/
 *   Response: {
 *     is_maintenance: boolean,
 *     title: string,
 *     message: string,
 *     estimated_end: string,
 *     reason: string,
 *     support_phone: string
 *   }
 */
export const useMaintenanceStore = create((set) => ({
  maintenanceInfo: null,
  checking: false,

  /**
   * بررسی حالت تعمیرات از API
   * ✅ فقط از بک‌اند می‌خواند — بدون fallback ماک
   */
  checkMaintenance: async () => {
    set({ checking: true });
    try {
      const response = await apiClient.get('/config/maintenance-status/');
      const config = response.data;

      if (!config?.is_maintenance) {
        set({ maintenanceInfo: null, checking: false });
        return;
      }

      set({
        maintenanceInfo: {
          title: config.title || 'در حال بروزرسانی هستیم 🔧',
          message:
            config.message ||
            'تیم فنی بیو کلاب در حال انجام بهبودهای لازم است. لطفاً دقایقی دیگر مراجعه فرمایید.',
          estimatedEnd: config.estimated_end || '',
          reason: config.reason || '',
          supportPhone: config.support_phone || '',
        },
        checking: false,
      });
    } catch (error) {
      // ✅ در صورت خطای API، حالت تعمیرات فعال نمی‌شود
      // کاربر نباید به خاطر خطای شبکه، صفحه تعمیرات ببیند
      console.log('Maintenance check failed (non-critical):', error);
      set({ maintenanceInfo: null, checking: false });
    }
  },

  /**
   * گوش دادن به تغییر visibility صفحه
   * وقتی کاربر به تب برمی‌گردد، دوباره چک کن
   */
  initVisibilityListener: () => {
    if (typeof window === 'undefined') return null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        useMaintenanceStore.getState().checkMaintenance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  },
}));