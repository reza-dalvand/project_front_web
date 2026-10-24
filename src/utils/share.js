// src/utils/share.js
/**
 * 🔗 Utility برای ساخت و اشتراک‌گذاری لینک پست‌ها و نمونه‌کارها
 *
 * لینک استاندارد اکسپلور:
 * /explore?post=<portfolioId>
 *
 * لینک استاندارد نمونه‌کار داخل کسب‌وکار:
 * /business?slug=<businessSlug>&portfolio=<portfolioId>
 */
import env from '@/config/env';

const getBaseUrl = () => {
  if (env?.SITE_DOMAIN) {
    return String(env.SITE_DOMAIN).replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return '';
};

/**
 * ساخت لینک اشتراک‌گذاری برای یک Portfolio در اکسپلور
 *
 * @param {number|string} portfolioId
 * @returns {string}
 */
export const buildPortfolioShareUrl = (portfolioId) => {
  if (!portfolioId) return '';

  const base = getBaseUrl();
  if (!base) return '';

  return `${base}/explore?post=${encodeURIComponent(portfolioId)}`;
};

/**
 * ساخت لینک اشتراک‌گذاری برای یک Portfolio داخل صفحه کسب‌وکار
 *
 * @param {string} businessSlug
 * @param {number|string} portfolioId
 * @returns {string}
 */
export const buildBusinessPortfolioShareUrl = (businessSlug, portfolioId) => {
  if (!portfolioId) return '';

  const base = getBaseUrl();
  if (!base) return '';

  if (!businessSlug) {
    return buildPortfolioShareUrl(portfolioId);
  }

  return `${base}/business?slug=${encodeURIComponent(businessSlug)}&portfolio=${encodeURIComponent(portfolioId)}`;
};

/**
 * alias عمومی برای ساخت لینک پست
 *
 * @param {object|string|number} postOrId
 * @returns {string}
 */
export const buildPostShareUrl = (postOrId) => {
  const id =
    typeof postOrId === 'object' && postOrId !== null
      ? postOrId.id
      : postOrId;

  return buildPortfolioShareUrl(id);
};

/**
 * اشتراک‌گذاری با URL مشخص
 *
 * خروجی‌ها:
 * - shared: کاربر با Web Share API به اشتراک گذاشت
 * - copied: لینک در clipboard کپی شد
 * - cancelled: کاربر share را لغو کرد
 * - failed: امکان اشتراک‌گذاری وجود نداشت
 *
 * @param {string} url
 * @param {{ title?: string, text?: string }} options
 * @returns {Promise<'shared'|'copied'|'cancelled'|'failed'>}
 */
export const shareWithUrl = async (url, options = {}) => {
  if (!url) return 'failed';

  const title = options.title || 'بیو کلاب';
  const text = options.text || 'این پست رو در بیو کلاب ببین';

  // ✅ Web Share API
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return 'shared';
    } catch (error) {
      // اگر کاربر share را cancel کرد، دیگر fallback نمی‌دهیم
      if (error?.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }

  // ✅ Clipboard fallback
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      // ادامه می‌دهیم به fallback نهایی
    }
  }

  // ✅ Last resort: prompt
  if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
    try {
      window.prompt('لینک اشتراک‌گذاری:', url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
};

/**
 * اشتراک‌گذاری لینک Portfolio در اکسپلور
 *
 * @param {number|string} portfolioId
 * @param {{ title?: string, text?: string }} options
 * @returns {Promise<'shared'|'copied'|'cancelled'|'failed'>}
 */
export const sharePortfolio = async (portfolioId, options = {}) => {
  const url = buildPortfolioShareUrl(portfolioId);
  return shareWithUrl(url, options);
};

/**
 * اشتراک‌گذاری لینک Portfolio در صفحه کسب‌وکار
 *
 * @param {string} businessSlug
 * @param {number|string} portfolioId
 * @param {{ title?: string, text?: string }} options
 * @returns {Promise<'shared'|'copied'|'cancelled'|'failed'>}
 */
export const shareBusinessPortfolio = async (businessSlug, portfolioId, options = {}) => {
  const url = buildBusinessPortfolioShareUrl(businessSlug, portfolioId);
  return shareWithUrl(url, options);
};

/**
 * alias عمومی برای share
 *
 * @param {object|string|number} postOrId
 * @param {{ title?: string, text?: string }} options
 * @returns {Promise<'shared'|'copied'|'cancelled'|'failed'>}
 */
export const sharePost = async (postOrId, options = {}) => {
  const id =
    typeof postOrId === 'object' && postOrId !== null
      ? postOrId.id
      : postOrId;

  return sharePortfolio(id, options);
};