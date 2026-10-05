/**
 * ابزارهای JWT
 * decode، بررسی انقضا، و مدیریت توکن‌ها
 *
 * ✅ سازگار با مرورگر، SSR (Next.js) و Edge Runtime
 * ✅ FIX فاز ۱: استفاده از ترتیب بررسی بهتر و سازگاری کامل
 * ✅ FIX F-13: اضافه شدن توابع رمزنگاری ساده برای ذخیره‌سازی امن‌تر
 */

// ═══════════════════════════════════════════════
//    کلید رمزنگاری ساده (XOR Obfuscation)
// ═══════════════════════════════════════════════
// ⚠️ این رمزنگاری قوی نیست، فقط سطح دسترسی را بالاتر می‌برد
// برای امنیت واقعی باید از httpOnly cookie استفاده شود
const STORAGE_KEY = typeof window !== 'undefined' 
  ? (window.navigator?.userAgent?.slice(0, 16) || 'beau-secure-key-16') 
  : 'beau-secure-key-16';

/**
 * ✅ FIX F-13: رمزنگاری ساده با XOR
 * @param {string} text - متن اصلی
 * @returns {string} متن رمزنگاری شده (base64)
 */
export const encryptToken = (text) => {
  if (!text) return '';
  try {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ STORAGE_KEY.charCodeAt(i % STORAGE_KEY.length)
      );
    }
    // تبدیل به base64
    if (typeof btoa === 'function') {
      return btoa(unescape(encodeURIComponent(result)));
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(result, 'binary').toString('base64');
    }
    return text; // fallback
  } catch {
    return text;
  }
};

/**
 * ✅ FIX F-13: رمزگشایی
 * @param {string} encrypted - متن رمزنگاری شده
 * @returns {string} متن اصلی
 */
export const decryptToken = (encrypted) => {
  if (!encrypted) return '';
  try {
    let decoded;
    if (typeof atob === 'function') {
      decoded = decodeURIComponent(escape(atob(encrypted)));
    } else if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(encrypted, 'base64').toString('binary');
    } else {
      return encrypted;
    }
    
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ STORAGE_KEY.charCodeAt(i % STORAGE_KEY.length)
      );
    }
    return result;
  } catch {
    return encrypted;
  }
};

// ═══════════════════════════════════════════════
//    Base64 URL Decode
// ═══════════════════════════════════════════════
const base64UrlDecode = (base64url) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

  if (typeof window !== 'undefined') {
    if (typeof window.atob === 'function') {
      return window.atob(base64);
    }
    if (typeof atob === 'function') {
      return atob(base64);
    }
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('binary');
  }

  if (typeof globalThis !== 'undefined' && typeof globalThis.atob === 'function') {
    return globalThis.atob(base64);
  }

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

// ═══════════════════════════════════════════════
//    JWT Decode
// ═══════════════════════════════════════════════
export const decodeJWT = (token) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = base64UrlDecode(payload);

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

// ═══════════════════════════════════════════════
//    Token Status Checks
// ═══════════════════════════════════════════════
export const isTokenExpired = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export const getTokenRemainingTime = (token) => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return 0;
  const remaining = payload.exp * 1000 - Date.now();
  return Math.max(0, remaining);
};

export const getUserIdFromToken = (token) => {
  const payload = decodeJWT(token);
  return payload?.user_id || null;
};

export const isTokenExpiringSoon = (token) => {
  const remaining = getTokenRemainingTime(token);
  return remaining > 0 && remaining < 5 * 60 * 1000; // ۵ دقیقه
};

// ═══════════════════════════════════════════════
//    ✅ FIX F-15: Session Status Types
// ═══════════════════════════════════════════════
export const SESSION_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  ERROR: 'error',
};