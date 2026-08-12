// src/stores/useOfflineQueueStore.js
/**
 * صف درخواست‌های آفلاین
 *
 * وقتی کاربر آفلاین است، درخواست‌های POST/PUT/DELETE در صف ذخیره می‌شوند
 * و پس از اتصال مجدد، به صورت خودکار ارسال می‌شوند.
 *
 * هماهنگ با Service Worker (sync queue)
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// حداکثر تعداد درخواست‌ها در صف
const MAX_QUEUE_SIZE = 50;

// حداکثر زمان نگهداری درخواست در صف (۲۴ ساعت)
const MAX_QUEUE_AGE = 24 * 60 * 60 * 1000;

export const useOfflineQueueStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      queue: [], // [{ id, method, url, body, timestamp, retryCount }]
      isProcessing: false,

      // ─── Actions ───
      /**
       * افزودن درخواست به صف
       * @param {object} request - { method, url, body }
       */
      enqueue: (request) => {
        set((state) => {
          const newItem = {
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            method: request.method,
            url: request.url,
            body: request.body,
            timestamp: Date.now(),
            retryCount: 0,
          };

          // حذف درخواست‌های قدیمی
          const now = Date.now();
          const filtered = state.queue.filter((item) => now - item.timestamp < MAX_QUEUE_AGE);

          // محدود کردن اندازه صف
          const newQueue = [...filtered, newItem].slice(-MAX_QUEUE_SIZE);

          return { queue: newQueue };
        });
      },

      /**
       * حذف یک درخواست از صف
       * @param {string} id
       */
      dequeue: (id) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        }));
      },

      /**
       * پاک کردن کل صف
       */
      clearQueue: () => {
        set({ queue: [] });
      },

      /**
       * افزایش تعداد تلاش مجدد
       * @param {string} id
       */
      incrementRetry: (id) => {
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id ? { ...item, retryCount: item.retryCount + 1 } : item
          ),
        }));
      },

      /**
       * شروع پردازش صف
       */
      startProcessing: () => {
        set({ isProcessing: true });
      },

      /**
       * پایان پردازش صف
       */
      stopProcessing: () => {
        set({ isProcessing: false });
      },

      /**
       * دریافت اولین درخواست از صف
       * @returns {object|null}
       */
      peek: () => {
        const { queue } = get();
        return queue.length > 0 ? queue[0] : null;
      },
    }),
    {
      name: 'zibano-offline-queue-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        queue: state.queue,
      }),
    }
  )
);

// ═══════════════════════════════════════════
//    تابع پردازش صف (برای استفاده در hooks)
// ═══════════════════════════════════════════
/**
 * پردازش صف آفلاین و ارسال درخواست‌ها
 * @param {function} apiClient - کلاینت API (axios instance)
 * @returns {Promise<{ processed: number, failed: number }>}
 */
export const processOfflineQueue = async (apiClient) => {
  const { queue, isProcessing, startProcessing, stopProcessing, dequeue, incrementRetry } =
    useOfflineQueueStore.getState();

  if (isProcessing || queue.length === 0) {
    return { processed: 0, failed: 0 };
  }

  startProcessing();
  let processed = 0;
  let failed = 0;

  while (true) {
    const item = useOfflineQueueStore.getState().peek();
    if (!item) break;

    try {
      const response = await apiClient.request({
        method: item.method,
        url: item.url,
        data: item.body,
      });

      if (response.status >= 200 && response.status < 300) {
        dequeue(item.id);
        processed++;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`Offline queue request failed: ${item.method} ${item.url}`, error);

      if (item.retryCount >= 3) {
        // بیش از ۳ بار تلاش — حذف از صف
        dequeue(item.id);
        failed++;
      } else {
        incrementRetry(item.id);
        failed++;
        // ادامه به درخواست بعدی
        dequeue(item.id);
      }
    }
  }

  stopProcessing();
  return { processed, failed };
};
