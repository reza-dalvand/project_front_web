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

const MAX_QUEUE_SIZE = 50;
const MAX_QUEUE_AGE = 24 * 60 * 60 * 1000;

const RETRY_BASE_DELAY_MS = 1000;
const RETRY_MAX_DELAY_MS = 30000;
const RETRY_BACKOFF_FACTOR = 2;
const MAX_REQUESTS_PER_BATCH = 20;
const MAX_CONCURRENT_REQUESTS = 3;

const getBackoffDelay = (retryCount) => {
  const delay = RETRY_BASE_DELAY_MS * Math.pow(RETRY_BACKOFF_FACTOR, retryCount);
  return Math.min(delay, RETRY_MAX_DELAY_MS);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useOfflineQueueStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      queue: [],
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

      // ═══════════════════════════════════════════════════════
      // ✅ F-06 Fix: پاک‌سازی کامل صف هنگام لاگه‌اوت
      // ═══════════════════════════════════════════════════════
      clearQueue: () => {
        set({
          queue: [],
          isProcessing: false,
        });
        try {
          useOfflineQueueStore.persist.clearStorage();
        } catch {}
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

export const processOfflineQueue = async (apiClient) => {
  const { isProcessing, startProcessing, stopProcessing, dequeue, incrementRetry } =
    useOfflineQueueStore.getState();

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
        dequeue(item.id);
        failed++;
      } else {
        incrementRetry(item.id);
        failed++;
        const delay = getBackoffDelay(item.retryCount);
        await sleep(delay);
      }
    }
  }

  stopProcessing();
  return { processed, failed };
};