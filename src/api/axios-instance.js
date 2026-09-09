/**
 * 🌐 Axios Instance مرکزی — فاز ۲ + ✅ پشتیبانی از تعلیق کاربر
 *
 * ✅ فاز ۱: رفع ریسک حلقه بی‌نهایت در رفرش توکن
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
//    Response Interceptor: مدیریت خطا + refresh + suspension
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

/**
 * ✅ FIX فاز ۱: تابع کمکی برای تشخیص درخواست‌های احراز هویت
 */
const isAuthEndpoint = (url) => {
  if (!url) return false;
  return (
    url.includes('/auth/') ||
    url.includes('/accounts/auth/') ||
    url.includes('/token/refresh') ||
    url.includes('/token/verify') ||
    url.includes('/logout') ||
    url.includes('/otp/send') ||
    url.includes('/otp/verify')
  );
};

/**
 * ✅ NEW: URLهایی که کاربر تعلیق‌شده هم می‌تواند استفاده کند
 * این endpointها نباید باعث نمایش مکرر مدال تعلیق شوند
 */
const isSuspensionAllowedEndpoint = (url) => {
  if (!url) return false;
  return (
    url.includes('/auth/logout') ||
    url.includes('/auth/token/refresh') ||
    url.includes('/support/tickets') ||
    url.includes('/support/faq')
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorData = error.response?.data;
    const errorCode = errorData?.error_code || errorData?.code;
    const statusCode = error.response?.status;

    // ═══════════════════════════════════════════════
    // ✅ NEW: هندل کاربر تعلیق‌شده (403 + ACCOUNT_SUSPENDED)
    // ═══════════════════════════════════════════════
    if (
      (errorCode === 'ACCOUNT_SUSPENDED' || 
       (statusCode === 403 && errorCode === 'ACCOUNT_SUSPENDED')) &&
      !isSuspensionAllowedEndpoint(originalRequest?.url)
    ) {
      try {
        const { useAuthStore } = await import('@/stores/useAuthStore');
        const authState = useAuthStore.getState();

        // اگر کاربر لاگین است اما suspended نشده، state را آپدیت کن
        if (authState.isAuthenticated && !authState.isSuspended) {
          useAuthStore.setState({
            isSuspended: true,
            suspensionReason:
              errorData?.message || 'حساب کاربری شما به دلیل تخلف تعلیق شده است.',
          });
        }
      } catch {
        // ignore
      }
      return Promise.reject(error);
    }

    // ═══════════════════════════════════════════════
    // مدیریت خطاهای ۴۰۱ — Refresh Token
    // ═══════════════════════════════════════════════

    // اگر درخواست وجود ندارد یا تکراری است، رد شو
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ✅ FIX فاز ۱: اگر خود درخواست رفرش است، وارد حلقه نشو
    if (originalRequest._isRefreshRequest) {
      return Promise.reject(error);
    }

    // فقط برای خطاهای ۴۰۱
    if (statusCode !== 401) {
      return Promise.reject(error);
    }

    // ✅ FIX فاز ۱: درخواست‌های احراز هویت هرگز وارد چرخه رفرش نشوند
    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // اگر درخواست دیگری در حال رفرش است، وارد صف شو
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
        clearTokens();
        return Promise.reject(error);
      }

      const response = await api.post(
        '/accounts/auth/token/refresh/',
        { refresh: refreshToken },
        {
          _isRefreshRequest: true,
          timeout: API_CONFIG.timeout,
          skipAuthInterceptor: true,
        }
      );

      const { access, refresh: newRefresh } = response.data;

      if (!access) {
        throw new Error('Invalid refresh response: no access token');
      }

      setTokens({
        access,
        refresh: newRefresh || refreshToken,
      });

      processQueue(null, access);
      originalRequest.headers.Authorization = `Bearer ${access}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // خروج خودکار از حساب در صورت شکست رفرش
      try {
        const { useAuthStore } = await import('@/stores/useAuthStore');
        const { clearTokens } = useTokenStore.getState();
        clearTokens();
        useAuthStore.getState().logout();
      } catch {
        // ignore
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;