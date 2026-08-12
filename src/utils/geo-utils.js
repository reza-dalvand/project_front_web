// src/utils/geo-utils.js
/**
 * 📍 محاسبات جغرافیایی
 * استفاده شده در: فیلتر فاصله جستجو، نقشه، مسیریابی
 */

/**
 * محاسبه فاصله بین دو نقطه (کیلومتر) - الگوریتم Haversine
 * @param {number} lat1 - عرض جغرافیایی نقطه اول
 * @param {number} lon1 - طول جغرافیایی نقطه اول
 * @param {number} lat2 - عرض جغرافیایی نقطه دوم
 * @param {number} lon2 - طول جغرافیایی نقطه دوم
 * @returns {number} - فاصله به کیلومتر
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // شعاع زمین (کیلومتر)
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

/**
 * محاسبه فاصله بین دو نقطه (متر)
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const km = calculateDistance(lat1, lon1, lat2, lon2);
  return km !== null ? km * 1000 : null;
};

/**
 * فرمت فاصله برای نمایش
 * @param {number} distanceKm - فاصله به کیلومتر
 * @returns {string}
 */
export const formatDistance = (distanceKm) => {
  if (!distanceKm || distanceKm <= 0) return '';

  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} متر`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} کیلومتر`;
  }

  return `${Math.round(distanceKm)} کیلومتر`;
};

/**
 * ساخت URL برای مسیریابی در گوگل مپ
 */
export const buildGoogleMapsUrl = (lat, lng) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
};

/**
 * ساخت URL برای مسیریابی در بلد
 */
export const buildBaladUrl = (lat, lng) => {
  return `https://balad.ir/route?destination=${lat},${lng}`;
};

/**
 * ساخت URL برای مسیریابی در نشان
 */
export const buildNeshanUrl = (lat, lng) => {
  return `https://neshan.org/route?destination=${lat},${lng}`;
};

/**
 * دریافت موقعیت فعلی کاربر
 * @returns {Promise<{ latitude: number, longitude: number }>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * بررسی اینکه آیا موقعیت در محدوده مشخص است
 * @param {number} lat
 * @param {number} lng
 * @param {number} centerLat
 * @param {number} centerLng
 * @param {number} radiusKm
 * @returns {boolean}
 */
export const isWithinRadius = (lat, lng, centerLat, centerLng, radiusKm) => {
  const distance = calculateDistance(lat, lng, centerLat, centerLng);
  return distance !== null && distance <= radiusKm;
};
