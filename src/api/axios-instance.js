/**
 * 🛡️ Axios Instance مرکزی — فاز ۲ + ✅ پشتیبانی از تعلیق کاربر
 *
 * ✅ فاز ۱: رفع ریسک حلقه بی‌نهایت در رفرش توکن
 * ✅ FIX F-14: رفع Race Condition در رفرش همزمان
 * ✅ NEW: هندل ACCOUNT_SUSPENDED (403) برای نمایش مدال تعلیق
 */
import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// ═══════════════════════════════════════════════
//    Request Interceptor: تزریق JWT
// ═══════════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    try {
      const { useTokenStore } = require('@/stores/useTokenStore');
      const token = useTokenStore.getState().getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // در SSR یا تست، store ممکن است موجود نباشد
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ═══════════════════════════════════════════════
//    ✅ FIX F-14: Response Interceptor با Race Condition Fix
// ═══════════════════════════════════════════════
let isRefreshing = false;
let failedQueue = [];

/**
 * پردازش صف درخواست‌های منتظر
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ─── هندل خطای ۴۰۳ تعلیق ───
    if (error.response?.status === 403) {
      const errorCode = error.response?.data?.code || error.response?.data?.data?.code;
      if (errorCode === 'ACCOUNT_SUSPENDED' || errorCode === 'ACCOUNT_DEACTIVATED') {
        try {
          const { useAuthStore } = await import('@/stores/useAuthStore');
          useAuthStore.getState().setSuspensionStatus(true, error.response?.data?.message || '');
        } catch {
          // ignore
        }
      }
    }

    // ─── هندل خطای ۴۰۱ — تلاش برای refresh ───
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/logout')
    ) {
      // اگر قبلاً در حال refresh هستیم، به صف اضافه کن
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { useTokenStore } = await import('@/stores/useTokenStore');
        const refreshToken = useTokenStore.getState().getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // ✅ FIX F-14: استفاده از authService.refreshToken
        const { authService } = await import('./services/auth.service');
        const result = await authService.refreshToken(refreshToken);
        const data = result?.data;

        if (!data || !data.access) {
          throw new Error('Invalid refresh response');
        }

        const newAccessToken = data.access;
        const newRefreshToken = data.refresh || refreshToken;

        // ذخیره توکن‌های جدید
        useTokenStore.getState().setTokens({
          access: newAccessToken,
          refresh: newRefreshToken,
        });

        // پردازش صف با توکن جدید
        processQueue(null, newAccessToken);

        // تلاش مجدد درخواست اصلی
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // پردازش صف با خطا
        processQueue(refreshError, null);

        // خروج خودکار
        try {
          const { useAuthStore } = await import('@/stores/useAuthStore');
          const { useTokenStore } = await import('@/stores/useTokenStore');
          useTokenStore.getState().clearTokens();
          useAuthStore.getState().logout();
        } catch {
          // ignore
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;