// src/utils/jwt-utils.js
/**
 * ابزارهای JWT
 * decode، بررسی انقضا، و مدیریت توکن‌ها
 *
 * ✅ سازگار با مرورگر، SSR (Next.js) و Edge Runtime
 * ✅ FIX فاز ۱: استفاده از ترتیب بررسی بهتر و سازگاری کامل
 */

/**
 * ✅ FIX فاز ۱: تبدیل Base64url به Base64 و سپس به رشته
 * سازگار با: مرورگر، محیط‌های غیر-مرورگر، و محیط‌های بدون Buffer
 *
 * @param {string} base64url
 * @returns {string}
 */
const base64UrlDecode = (base64url) => {
  // تبدیل Base64url به Base64
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

  // ✅ FIX فاز ۱: ترتیب بررسی بهتر
  // ۱. ابتدا بررسی مرورگر (سریع‌ترین روش)
  if (typeof window !== 'undefined') {
    if (typeof window.atob === 'function') {
      return window.atob(base64);
    }
    // برخی مرورگرهای قدیمی atob ندارند
    if (typeof atob === 'function') {
      return atob(base64);
    }
  }

  // ۲. بررسی محیط‌های غیر-مرورگر (Node, Cloudflare Workers, etc.)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('binary');
  }

  // ۳. بررسی محیط‌های جدید با globalThis
  if (typeof globalThis !== 'undefined' && typeof globalThis.atob === 'function') {
    return globalThis.atob(base64);
  }

  // ۴. Fallback: decode دستی Base64 (سازگار با همه محیط‌ها)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = base64.replace(/=+$/, '');
  let output = '';

  if (str.length % 4 === 1) {
    throw new Error('Invalid base64 string');
  }

  for (let i = 0; i < str.length; i += 4) {
    const a = chars.indexOf(str.charAt(i));
    const b = chars.indexOf(str.charAt(i + 1));
    const c = chars.indexOf(str.charAt(i + 2));
    const d = chars.indexOf(str.charAt(i + 3));

    output += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== 64 && c !== -1) {
      output += String.fromCharCode(((b & 15) << 4) | (c >> 2));
    }
    if (d !== 64 && d !== -1) {
      output += String.fromCharCode(((c & 3) << 6) | d);
    }
  }

  return output;
};

/**
 * Decode کردن JWT بدون کتابخانه
 * سازگار با مرورگر و محیط‌های غیر-مرورگر
 *
 * @param {string} token
 * @returns {object|null} payload
 */
export const decodeJWT = (token) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = base64UrlDecode(payload);

    // تبدیل به رشته قابل خواندن
    // استفاده از decodeURIComponent برای پشتیبانی از کاراکترهای یونیکد (فارسی)
    const jsonStr = decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

/**
 * بررسی اینکه توکن منقضی شده یا نه
 * @param {string} token
 * @returns {boolean} true = منقضی شده
 */
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  // exp به ثانیه است، Date.now() به میلی‌ثانیه
  return Date.now() >= payload.exp * 1000;
};

/**
 * زمان باقی‌مانده تا انقضای توکن (میلی‌ثانیه)
 * @param {string} token
 * @returns {number} میلی‌ثانیه باقی‌مانده (0 اگر منقضی)
 */
export const getTokenRemainingTime = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return 0;
  const remaining = payload.exp * 1000 - Date.now();
  return Math.max(0, remaining);
};

/**
 * استخراج user_id از توکن
 * @param {string} token
 * @returns {number|null}
 */
export const getUserIdFromToken = (token) => {
  const payload = decodeJWT(token);
  return payload?.user_id || null;
};

/**
 * بررسی اینکه توکن به زودی منقضی می‌شود (کمتر از ۵ دقیقه)
 * @param {string} token
 * @returns {boolean}
 */
export const isTokenExpiringSoon = (token) => {
  const remaining = getTokenRemainingTime(token);
  return remaining > 0 && remaining < 5 * 60 * 1000; // ۵ دقیقه
};
