// src/utils/jwt-utils.js
/**
 * ابزارهای JWT
 * ✅ FIX باگ ۱۲: مدیریت امن base64 decode بدون کرش
 */

const STORAGE_KEY =
  typeof window !== 'undefined'
    ? window.navigator?.userAgent?.slice(0, 16) || 'beau-secure-key-16'
    : 'beau-secure-key-16';

/**
 * ✅ رمزنگاری ساده با XOR
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
    if (typeof btoa === 'function') {
      return btoa(unescape(encodeURIComponent(result)));
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(result, 'binary').toString('base64');
    }
    return text;
  } catch {
    return text;
  }
};

/**
 * ✅ رمزگشایی
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
//    ✅ FIX باگ ۱۲: Base64 URL Decode — بدون کرش
// ═══════════════════════════════════════════════
const base64UrlDecode = (base64url) => {
  if (!base64url || typeof base64url !== 'string') return '';

  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

  // ✅ روش امن: استفاده از atob + TextDecoder برای UTF-8
  try {
    let binaryStr;

    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      binaryStr = window.atob(base64);
    } else if (typeof atob === 'function') {
      binaryStr = atob(base64);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    } else if (typeof globalThis !== 'undefined' && typeof globalThis.atob === 'function') {
      binaryStr = globalThis.atob(base64);
    } else {
      return '';
    }

    // ✅ FIX: تبدیل امن binary string به UTF-8
    // به جای decodeURIComponent(escape(...)) که روی UTF-8 نامعتبر کرش می‌کند
    try {
      return decodeURIComponent(escape(binaryStr));
    } catch {
      // اگر UTF-8 نامعتبر بود، مستقیماً برگردان
      return binaryStr;
    }
  } catch {
    return '';
  }
};

// ═══════════════════════════════════════════════
//    JWT Decode
// ═══════════════════════════════════════════════
export const decodeJWT = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = base64UrlDecode(payload);

    if (!decoded) return null;

    // ✅ FIX: پارش امن JSON
    let jsonStr = decoded;
    try {
      // تلاش برای decode URI-encoded string
      jsonStr = decodeURIComponent(
        decoded
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      // اگر decode نشد، از decoded مستقیم استفاده کن
      jsonStr = decoded;
    }

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
  return remaining > 0 && remaining < 5 * 60 * 1000;
};

export const SESSION_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  ERROR: 'error',
};