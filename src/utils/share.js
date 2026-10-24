// src/utils/share.js
/**
 * 🔗 Utility برای ساخت و اشتراک‌گذاری لینک پست‌ها
 *
 * در وضعیت فعلی پروژه، آیتم‌های نمایش‌داده‌شده در اکسپلور و نمونه‌کارهای
 * کسب‌وکار در واقع از مدل Portfolio هستند. بنابراین لینک استاندارد پست
 * به شکل زیر ساخته می‌شود:
 *
 * /explore?post=<portfolioId>
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
 * ساخت لینک اشتراک‌گذاری برای یک Portfolio
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
 * alias عمومی‌تر
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
 * اشتراک‌گذاری یا کپی لینک Portfolio
 *
 * اول navigator.share، بعد clipboard، در نهایت prompt.
 *
 * @param {number|string} portfolioId
 * @param {{ title?: string, text?: string }} options
 * @returns {Promise<boolean>}
 */
export const sharePortfolio = async (portfolioId, options = {}) => {
  const url = buildPortfolioShareUrl(portfolioId);
  if (!url) return false;

  const title = options.title || 'مشاهده پست در بیو کلاب';
  const text = options.text || 'این پست رو در بیو کلاب ببین';

  // ✅ Web Share API
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    } catch (error) {
      // اگر کاربر share را cancel کرد، دیگر fallback نمی‌دهیم
      if (error?.name === 'AbortError') {
        return false;
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
      return true;
    } catch {
      // ادامه می‌دهیم به fallback نهایی
    }
  }

  // ✅ Last resort: prompt
  if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
    try {
      window.prompt('لینک پست:', url);
      return true;
    } catch {
      return false;
    }
  }

  return false;
};

/**
 * alias عمومی‌تر برای share
 *
 * @param {object|string|number} postOrId
 * @param {{ title?: string, text?: string }} options
 * @returns {Promise<boolean>}
 */
export const sharePost = async (postOrId, options = {}) => {
  const id =
    typeof postOrId === 'object' && postOrId !== null
      ? postOrId.id
      : postOrId;

  return sharePortfolio(id, options);
};