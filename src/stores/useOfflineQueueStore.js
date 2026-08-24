// src/stores/useOfflineQueueStore.js
/**
 * صف درخواست‌های آفلاین
 *
 * وقتی کاربر آفلاین است، درخواست‌های POST/PUT/DELETE در صف ذخیره می‌شوند
 * و پس از اتصال مجدد، به صورت خودکار ارسال می‌شوند.
 *
 * هماهنگ با Service Worker (sync queue)
 *
 * ✅ FIX فاز ۳: جلوگیری از Retry Storm
 * - تأخیر بین درخواست‌ها
 * - محدودیت تعداد در هر دور
 * - حذف حلقه بی‌نهایت
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// حداکثر تعداد درخواست‌ها در صف
const MAX_QUEUE_SIZE = 50;

// حداکثر زمان نگهداری درخواست در صف (۲۴ ساعت)
const MAX_QUEUE_AGE = 24 * 60 * 60 * 1000;

// ═══════ ✅ FIX فاز ۳: پارامترهای backoff ═══════
const RETRY_BASE_DELAY_MS = 1000; // ۱ ثانیه
const RETRY_MAX_DELAY_MS = 30000; // ۳۰ ثانیه
const RETRY_BACKOFF_FACTOR = 2; // ضربدر ۲ در هر تلاش
const MAX_REQUESTS_PER_BATCH = 20; // حداکثر ۲۰ درخواست در هر دور
const MAX_CONCURRENT_REQUESTS = 3; // حداکثر ۳ درخواست همزمان

/**
 * ✅ محاسبه تأخیر بر اساس تعداد تلاش‌ها (نمایی)
 */
const getBackoffDelay = (retryCount) => {
  const delay = RETRY_BASE_DELAY_MS * Math.pow(RETRY_BACKOFF_FACTOR, retryCount);
  return Math.min(delay, RETRY_MAX_DELAY_MS);
};

/**
 * انتظار
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useOfflineQueueStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      queue: [], // [{ id, method, url, body, timestamp, retryCount }]
      isProcessing: false,

      // ─── Actions ───
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
          const now = Date.now();
          const filtered = state.queue.filter((item) => now - item.timestamp < MAX_QUEUE_AGE);
          const newQueue = [...filtered, newItem].slice(-MAX_QUEUE_SIZE);
          return { queue: newQueue };
        });
      },

      dequeue: (id) => {
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        }));
      },

      clearQueue: () => {
        set({ queue: [] });
      },

      incrementRetry: (id) => {
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id ? { ...item, retryCount: item.retryCount + 1 } : item
          ),
        }));
      },

      startProcessing: () => {
        set({ isProcessing: true });
      },

      stopProcessing: () => {
        set({ isProcessing: false });
      },

      peek: () => {
        const { queue } = get();
        return queue.length > 0 ? queue[0] : null;
      },
    }),
    {
      name: 'beau-offline-queue-storage',
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

// ═══════════════════════════════════════════════════════
//    تابع پردازش صف (برای استفاده در hooks)
// ═══════════════════════════════════════════════════════

/**
 * پردازش صف آفلاین و ارسال درخواست‌ها
 *
 * ✅ FIX فاز ۳:
 * - پردازش دسته‌ای (حداکثر ۲۰ درخواست در هر دور)
 * - تأخیر بین درخواست‌های ناموفق (جلوگیری از Retry Storm)
 * - حذف حلقه `while(true)`
 *
 * @param {function} apiClient - کلاینت API (axios instance)
 * @returns {Promise<{ processed: number, failed: number }>}
 */
export const processOfflineQueue = async (apiClient) => {
  const { isProcessing, startProcessing, stopProcessing, dequeue, incrementRetry } =
    useOfflineQueueStore.getState();

  // جلوگیری از پردازش همزمان
  if (isProcessing) {
    return { processed: 0, failed: 0 };
  }

  const queue = useOfflineQueueStore.getState().queue;
  if (queue.length === 0) {
    return { processed: 0, failed: 0 };
  }

  startProcessing();
  let processed = 0;
  let failed = 0;

  // ✅ FIX فاز ۳: پردازش دسته‌ای به جای حلقه بی‌نهایت
  const itemsToProcess = [...queue].slice(0, MAX_REQUESTS_PER_BATCH);

  for (const item of itemsToProcess) {
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
        // ✅ FIX فاز ۳: تأخیر قبل از درخواست بعدی
        const delay = getBackoffDelay(item.retryCount);
        await sleep(delay);
      }
    }
  }

  stopProcessing();
  return { processed, failed };
};
