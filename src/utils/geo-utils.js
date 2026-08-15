// src/utils/geo-utils.js
import { toPersianDigit } from './numberUtils';

// ═══════ محاسبات فاصله ═══════
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

// ✅ FIX: استفاده از toPersianDigit برای تبدیل اعداد به فارسی
export const formatDistance = (distanceKm) => {
  if (!distanceKm || distanceKm <= 0) return '';
  if (distanceKm < 1) return `${toPersianDigit(Math.round(distanceKm * 1000))} متر`;
  if (distanceKm < 10) return `${toPersianDigit(distanceKm.toFixed(1))} کیلومتر`;
  return `${toPersianDigit(Math.round(distanceKm))} کیلومتر`;
};

export const buildGoogleMapsUrl = (lat, lng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
export const buildBaladUrl = (lat, lng) => `https://balad.ir/route?destination=${lat},${lng}`;
export const buildNeshanUrl = (lat, lng) => `https://neshan.org/route?destination=${lat},${lng}`;

export const isWithinRadius = (lat, lng, centerLat, centerLng, radiusKm) => {
  const distance = calculateDistance(lat, lng, centerLat, centerLng);
  return distance !== null && distance <= radiusKm;
};

// ═══════ دریافت موقعیت ═══════
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

export const getCurrentLocation = async (options = {}) => {
  const { preferSpeed = true } = options;
  if (typeof window === 'undefined' || !navigator.geolocation) {
    const error = new Error('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
    error.code = 0;
    throw error;
  }

  if (preferSpeed) {
    try {
      const result = await getPositionWithStrategy({
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 120000,
      });
      return result;
    } catch (networkError) {
      if (networkError.code === 1) throw networkError;
    }
  }

  try {
    const result = await getPositionWithStrategy({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 30000,
    });
    return result;
  } catch (gpsError) {
    if (preferSpeed) {
      try {
        const result = await getPositionWithStrategy({
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000,
        });
        return result;
      } catch (finalError) {
        if (finalError.code === 1) throw finalError;
      }
    }
    throw gpsError;
  }
};
