// src/stores/useMaintenanceStore.js
'use client';
import { create } from 'zustand';

// شبیه‌سازی تنظیمات ریموت
const MOCK_REMOTE_CONFIG = {
  isMaintenance: false, // در production از API دریافت شود
  title: 'در حال بروزرسانی هستیم 🔧',
  message:
    'تیم فنی زیبانو در حال انجام بهبودهای لازم است. لطفاً دقایقی دیگر مراجعه فرمایید.',
  estimatedEnd: 'امروز ساعت ۱۸:۰۰',
  reason: 'بروزرسانی سرورها',
  supportPhone: '۰۲۱-۹۱۰۰۱۲۳۴',
};

export const useMaintenanceStore = create((set) => ({
  maintenanceInfo: null,
  checking: false,

  // بررسی حالت تعمیرات
  checkMaintenance: async () => {
    set({ checking: true });
    try {
      // شبیه‌سازی درخواست API
      await new Promise((r) => setTimeout(r, 600));

      // در production:
      // const response = await fetch('/api/maintenance-status');
      // const config = await response.json();

      if (!MOCK_REMOTE_CONFIG.isMaintenance) {
        set({ maintenanceInfo: null, checking: false });
        return;
      }

      set({
        maintenanceInfo: {
          title: MOCK_REMOTE_CONFIG.title,
          message: MOCK_REMOTE_CONFIG.message,
          estimatedEnd: MOCK_REMOTE_CONFIG.estimatedEnd,
          reason: MOCK_REMOTE_CONFIG.reason,
          supportPhone: MOCK_REMOTE_CONFIG.supportPhone,
        },
        checking: false,
      });
    } catch (error) {
      console.log('Maintenance check failed:', error);
      set({ checking: false });
    }
  },

  // گوش دادن به تغییر visibility صفحه (معادل AppState در RN)
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