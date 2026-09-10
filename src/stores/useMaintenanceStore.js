// src/stores/useMaintenanceStore.js
'use client';

import { create } from 'zustand';
import apiClient from '@/api/api-client';

/**
 * 🔧 Store حالت تعمیرات
 *
 * Endpoint بک‌اند:
 *   GET /config/maintenance-status/
 *   Response: {
 *     is_maintenance: boolean,
 *     is_maintenance_modal_enabled: boolean,
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
   * ✅ حالت وابسته: هر دو شرط باید true باشند
   *    - is_maintenance = true (حالت تعمیرات فعال)
   *    - is_maintenance_modal_enabled = true (نمایش مدال فعال)
   * ✅ هم در وب و هم در اندروید اعمال می‌شود
   */
  checkMaintenance: async () => {
    set({ checking: true });
    try {
      const response = await apiClient.get('/config/maintenance-status/');
      const config = response.data;

      // ✅ فاز ۳: خوانش camelCase (بعد از نرمال‌ساز)
      // حالت وابسته: هم is_maintenance و هم is_maintenance_modal_enabled باید true باشند
      if (!config?.isMaintenance || !config?.isMaintenanceModalEnabled) {
        set({ maintenanceInfo: null, checking: false });
        return;
      }

      set({
        maintenanceInfo: {
          title: config.title || 'در حال بروزرسانی هستیم 🔧',
          message:
            config.message ||
            'تیم فنی بیو کلاب در حال انجام بهبودهای لازم است. لطفاً دقایقی دیگر مراجعه فرمایید.',
          estimatedEnd: config.estimatedEnd || '',
          reason: config.reason || '',
          supportPhone: config.supportPhone || '',
        },
        checking: false,
      });
    } catch (error) {
      // ✅ در صورت خطای API، حالت تعمیرات فعال نمی‌شود
      console.log('Maintenance check failed (non-critical):', error);
      set({ maintenanceInfo: null, checking: false });
    }
  },

  /**
   * گوش دادن به تغییر visibility صفحه
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