// src/utils/geo-utils.js

/**
 * 📍 محاسبات جغرافیایی
 * استراتژی دریافت موقعیت:
 *   مرحله ۱: Network Location (WiFi/Cell) → سریع، ۲-۵ ثانیه
 *   مرحله ۲: GPS → دقیق‌تر ولی کندتر، فقط اگر مرحله ۱ جواب نداد
 */

// ═══════ محاسبات فاصله (بدون تغییر) ═══════

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const km = calculateDistance(lat1, lon1, lat2, lon2);
  return km !== null ? km * 1000 : null;
};

export const formatDistance = (distanceKm) => {
  if (!distanceKm || distanceKm <= 0) return '';
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} متر`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} کیلومتر`;
  return `${Math.round(distanceKm)} کیلومتر`;
};

export const buildGoogleMapsUrl = (lat, lng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export const buildBaladUrl = (lat, lng) => `https://balad.ir/route?destination=${lat},${lng}`;

export const buildNeshanUrl = (lat, lng) => `https://neshan.org/route?destination=${lat},${lng}`;

export const isWithinRadius = (lat, lng, centerLat, centerLng, radiusKm) => {
  const distance = calculateDistance(lat, lng, centerLat, centerLng);
  return distance !== null && distance <= radiusKm;
};

// ═══════ 🎯 دریافت موقعیت — بازنویسی کامل ═══════

/**
 * دریافت موقعیت با یک استراتژی مشخص
 */
const getPositionWithStrategy = (options) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: options.enableHighAccuracy ? 'gps' : 'network',
        });
      },
      (error) => reject(error),
      options
    );
  });
};

/**
 * 🎯 دریافت موقعیت فعلی کاربر
 *
 * استراتژی دو مرحله‌ای:
 *   ۱. Network Location (WiFi/Cell) → سریع، معمولاً ۲-۵ ثانیه
 *   ۲. GPS → فقط اگر مرحله ۱ شکست خورد
 *
 * @param {object} options
 * @param {boolean} options.preferSpeed - اولویت سرعت (پیش‌فرض: true)
 * @returns {Promise<{latitude, longitude, accuracy, source}>}
 */
export const getCurrentLocation = async (options = {}) => {
  const { preferSpeed = true } = options;

  if (typeof window === 'undefined' || !navigator.geolocation) {
    const error = new Error('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
    error.code = 0;
    throw error;
  }

  // ─── مرحله ۱: Network Location (سریع) ───
  if (preferSpeed) {
    try {
      const result = await getPositionWithStrategy({
        enableHighAccuracy: false, // ← WiFi/Cell → سریع
        timeout: 10000, // ← ۱۰ ثانیه
        maximumAge: 120000, // ← کش ۲ دقیقه‌ای → اگر تازه گرفته شده، فوری برگرد
      });
      return result;
    } catch (networkError) {
      // اگر خطای PERMISSION_DENIED بود، مستقیم reject کن
      if (networkError.code === 1) throw networkError;
      // در غیر این صورت → مرحله ۲
    }
  }

  // ─── مرحله ۲: GPS (دقیق‌تر ولی کندتر) ───
  try {
    const result = await getPositionWithStrategy({
      enableHighAccuracy: true, // ← GPS
      timeout: 20000, // ← ۲۰ ثانیه (بیشتر از قبل)
      maximumAge: 30000, // ← کش ۳۰ ثانیه‌ای
    });
    return result;
  } catch (gpsError) {
    // ─── مرحله ۳: آخرین تلاش — Network بدون preferSpeed ───
    if (preferSpeed) {
      try {
        const result = await getPositionWithStrategy({
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000, // ← کش ۵ دقیقه‌ای
        });
        return result;
      } catch (finalError) {
        if (finalError.code === 1) throw finalError; // Permission denied
      }
    }
    throw gpsError;
  }
};
