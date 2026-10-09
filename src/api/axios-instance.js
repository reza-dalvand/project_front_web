/**
 * 🌐 Axios Instance مرکزی — فاز ۲ + ✅ پشتیبانی از تعلیق کاربر
 *
 * ✅ FIX: حذف require() در interceptor برای جلوگیری از کرش در Edge/SSR
 * ✅ FIX F-19: بررسی skipAuthInterceptor در request interceptor
 */
import axios from 'axios';
import { API_CONFIG } from './config';
import { useTokenStore } from '@/stores/useTokenStore';

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
    // ✅ FIX F-19: اگر درخواست مشخص کرده که auth نمی‌خواهد، رد کن
    if (config.skipAuthInterceptor) {
      return config;
    }

    try {
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

    // ─── مدیریت تعلیق حساب ───
    if (
      (errorCode === 'ACCOUNT_SUSPENDED' ||
        (statusCode === 403 && errorCode === 'ACCOUNT_SUSPENDED')) &&
      !isSuspensionAllowedEndpoint(originalRequest?.url)
    ) {
      try {
        const { useAuthStore } = await import('@/stores/useAuthStore');
        const authState = useAuthStore.getState();

        if (authState.isAuthenticated && !authState.isSuspended) {
          useAuthStore.setState({
            isSuspended: true,
            suspensionReason: errorData?.message || 'حساب کاربری شما به دلیل تخلف تعلیق شده است.',
          });
        }
      } catch {
        // ignore
      }
      return Promise.reject(error);
    }

    // ─── بررسی‌های اولیه برای refresh ───
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ✅ اگر خود درخواست refresh شکست خورد، دیگر تلاش نکن
    if (originalRequest._isRefreshRequest) {
      return Promise.reject(error);
    }

    if (statusCode !== 401) {
      return Promise.reject(error);
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // ─── صف‌بندی درخواست‌ها هنگام refresh ───
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
      const { getRefreshToken, setTokens, clearTokens } = useTokenStore.getState();
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        processQueue(new Error('No refresh token'), null);
        return Promise.reject(error);
      }

      const response = await api.post(
        '/accounts/auth/token/refresh/',
        { refresh: refreshToken },
        {
          _isRefreshRequest: true,
          timeout: API_CONFIG.timeout,
          skipAuthInterceptor: true, // ✅ FIX F-19: جلوگیری از تزریق توکن منقضی‌شده
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