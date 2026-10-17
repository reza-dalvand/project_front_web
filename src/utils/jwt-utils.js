// src/utils/jwt-utils.js
/**
 * ابزارهای JWT
 * ✅ FIX باگ ۱۲: مدیریت امن base64 decode بدون کرش
 * ✅ FIX دسته ۴:
 * - حذف double decoding خطرناک در decodeJWT
 * - افزودن cache محدود برای کاهش CPU overhead
 * - decode ایمن‌تر UTF-8 با TextDecoder
 */

const STORAGE_KEY = 'beau-club-secure-xor-key-2024-fixed';

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
    console.warn('Token decryption failed, clearing invalid token.');
    return '';
  }
};

// ═══════════════════════════════════════════════
//    Base64URL Decode — ایمن و بدون corruption
// ═══════════════════════════════════════════════

const addBase64Padding = (base64) => {
  const remainder = base64.length % 4;
  if (!remainder) return base64;
  return base64 + '='.repeat(4 - remainder);
};

const binaryStringToUtf8 = (binary) => {
  // ✅ روش ترجیحی: TextDecoder
  if (typeof TextDecoder !== 'undefined') {
    try {
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    } catch {
      // fallback
    }
  }

  // fallback قدیمی
  try {
    return decodeURIComponent(escape(binary));
  } catch {
    return binary;
  }
};

const base64UrlDecode = (base64url) => {
  if (!base64url || typeof base64url !== 'string') return '';

  const base64 = addBase64Padding(
    base64url.replace(/-/g, '+').replace(/_/g, '/')
  );

  let binary = '';

  try {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      binary = window.atob(base64);
    } else if (typeof atob === 'function') {
      binary = atob(base64);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf-8');
    } else if (
      typeof globalThis !== 'undefined' &&
      typeof globalThis.atob === 'function'
    ) {
      binary = globalThis.atob(base64);
    } else {
      return '';
    }
  } catch {
    return '';
  }

  return binaryStringToUtf8(binary);
};

// ═══════════════════════════════════════════════
//    JWT Decode + Cache محدود
// ═══════════════════════════════════════════════

const JWT_DECODE_CACHE_MAX = 100;
const _jwtDecodeCache = new Map();

const pruneJwtDecodeCache = () => {
  if (_jwtDecodeCache.size < JWT_DECODE_CACHE_MAX) return;

  const keysToDelete = Array.from(_jwtDecodeCache.keys()).slice(
    0,
    Math.floor(JWT_DECODE_CACHE_MAX / 2)
  );

  keysToDelete.forEach((key) => _jwtDecodeCache.delete(key));
};

export const decodeJWT = (token) => {
  if (!token || typeof token !== 'string') return null;

  if (_jwtDecodeCache.has(token)) {
    return _jwtDecodeCache.get(token);
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      pruneJwtDecodeCache();
      _jwtDecodeCache.set(token, null);
      return null;
    }

    const payload = parts[1];
    const decoded = base64UrlDecode(payload);

    if (!decoded) {
      pruneJwtDecodeCache();
      _jwtDecodeCache.set(token, null);
      return null;
    }

    const parsed = JSON.parse(decoded);

    pruneJwtDecodeCache();
    _jwtDecodeCache.set(token, parsed);

    return parsed;
  } catch {
    pruneJwtDecodeCache();
    _jwtDecodeCache.set(token, null);
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