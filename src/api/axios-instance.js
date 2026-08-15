// src/api/axios-instance.js
/**
 * 🌐 Axios Instance مرکزی — فاز ۲
 *
 * تغییرات:
 * - اصلاح refresh flow برای هماهنگی با CustomTokenRefreshView بک‌اند
 * - بک‌اند در refresh برمی‌گرداند: { access, refresh } (نه access_token)
 * - مدیریت بهتر خطاهای 401
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
//    Response Interceptor: مدیریت خطا + refresh
// ═══════════════════════════════════════════════
let isRefreshing = false;
let failedQueue = [];

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

    // فقط برای 401 و درخواست‌های تکراری نباشد
    if (error.response?.status === 401 && !originalRequest._retry) {
      // اگر درخواست خود auth است (login, verify, ...) → refresh نکن
      const isAuthEndpoint = originalRequest.url?.includes('/auth/');
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

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
        const { getRefreshToken, setTokens, clearTokens } = useTokenStore.getState();

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // ✅ اصلاح: استفاده از فرمت صحیح بک‌اند
        // بک‌اند در CustomTokenRefreshView برمی‌گرداند: { access, refresh }
        const response = await axios.post(`${API_CONFIG.baseURL}/accounts/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        setTokens({ access, refresh });
        processQueue(null, access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        try {
          const { useAuthStore } = await import('@/stores/useAuthStore');
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
