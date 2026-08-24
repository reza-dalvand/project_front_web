// src/utils/static-params.js
/**
 * 🏗️ توابع کمکی برای generateStaticParams
 *
 * این توابع در زمان build اجرا می‌شوند و ID های صفحات
 * داینامیک را از بک‌اند دریافت می‌کنند.
 *
 * ⚠️ توجه: این توابع فقط در زمان build اجرا می‌شوند
 * و به store یا context دسترسی ندارند.
 */

import env from '@/config/env';

const API_BASE = env.API_BASE_URL;
const TIMEOUT_MS = 10000;

/**
 * fetch با timeout برای جلوگیری از hang شدن build
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

/**
 * دریافت لیست ID های کسب‌وکارها
 * Endpoint: GET /businesses/list/?page_size=1000
 */
export async function getBusinessIds() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/businesses/list/?page_size=1000`
    );

    if (response?.success && Array.isArray(response.data)) {
      return response.data
        .map((b) => b.booking_slug || String(b.id))
        .filter(Boolean);
    }

    // فرمت paginated
    if (response?.success && Array.isArray(response.results)) {
      return response.results
        .map((b) => b.booking_slug || String(b.id))
        .filter(Boolean);
    }

    return [];
  } catch (error) {
    console.warn('[generateStaticParams] Failed to fetch business IDs:', error.message);
    return [];
  }
}

/**
 * دریافت لیست ID های دسته‌بندی‌ها
 * Endpoint: GET /categories/business-categories/
 */
export async function getCategoryIds() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/categories/business-categories/`
    );

    if (response?.success && Array.isArray(response.data)) {
      return response.data.map((c) => String(c.id)).filter(Boolean);
    }

    return [];
  } catch (error) {
    console.warn('[generateStaticParams] Failed to fetch category IDs:', error.message);
    return [];
  }
}

/**
 * دریافت لیست ID های آگهی‌های اجاره لاین
 * Endpoint: GET /ads/line-rentals/?page_size=1000
 */
export async function getLineRentalIds() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/ads/line-rentals/?page_size=1000`
    );

    if (response?.success && Array.isArray(response.data)) {
      return response.data.map((r) => String(r.id)).filter(Boolean);
    }

    if (response?.success && Array.isArray(response.results)) {
      return response.results.map((r) => String(r.id)).filter(Boolean);
    }

    return [];
  } catch (error) {
    console.warn('[generateStaticParams] Failed to fetch line rental IDs:', error.message);
    return [];
  }
}

/**
 * دریافت لیست ID های درخواست‌های مدل
 * Endpoint: GET /ads/model-requests/?page_size=1000
 */
export async function getModelRequestIds() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/ads/model-requests/?page_size=1000`
    );

    if (response?.success && Array.isArray(response.data)) {
      return response.data.map((r) => String(r.id)).filter(Boolean);
    }

    if (response?.success && Array.isArray(response.results)) {
      return response.results.map((r) => String(r.id)).filter(Boolean);
    }

    return [];
  } catch (error) {
    console.warn('[generateStaticParams] Failed to fetch model request IDs:', error.message);
    return [];
  }
}

/**
 * ساخت پارامترهای استاتیک از لیست ID ها
 * @param {string[]} ids - لیست شناسه‌ها
 * @returns {Array<{id: string}>}
 */
export function buildStaticParams(ids) {
  return ids.map((id) => ({ id: String(id) }));
}

/**
 * Fallback: پارامترهای پیش‌فرض برای حالتی که API در دسترس نیست
 * این ID ها فقط برای جلوگیری از خطای build هستند
 */
export const FALLBACK_IDS = {
  business: ['demo-salon'],
  category: ['1', '2', '3'],
  lineRental: ['1'],
  modelRequest: ['1'],
};