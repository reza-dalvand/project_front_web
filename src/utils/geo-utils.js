// src/utils/geo-utils.js
import { toPersianDigit } from './numberUtils';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings } from 'capacitor-native-settings';

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

// ═══════ مدیریت دسترسی و GPS در Native Platform ═══════

/**
 * 📱 باز کردن تنظیمات موقعیت مکانی گوشی
 * 
 * ✅ Android: باز کردن Settings > Location
 * ✅ iOS: باز کردن Settings > Privacy > Location Services
 * 
 * @returns {Promise<boolean>} آیا تنظیمات باز شد؟
 */
export const openLocationSettings = async () => {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) return false;

  try {
    await NativeSettings.open({
      optionAndroid: 'location',
      optionIOS: 'locationServices',
    });
    return true;
  } catch (error) {
    console.error('Cannot open location settings:', error);
    return false;
  }
};

/**
 * 🔍 بررسی وضعیت GPS (روشن/خاموش بودن)
 * 
 * @returns {Promise<boolean>} آیا GPS روشن است؟
 */
const checkGpsEnabled = async () => {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    // در Web، مرورگر خودش مدیریت می‌کند
    return true;
  }

  try {
    // تلاش برای دریافت موقعیت با timeout کوتاه
    // اگر GPS خاموش باشد، خطای خاصی برمی‌گردد
    await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 3000, // 3 ثانیه برای بررسی سریع
      maximumAge: 0,
    });
    return true;
  } catch (error) {
    // اگر خطا مربوط به GPS disabled باشد
    const errorMsg = error.message?.toLowerCase() || '';
    
    if (
      errorMsg.includes('disabled') ||
      errorMsg.includes('unavailable') ||
      errorMsg.includes('service') ||
      error.code === 2 // POSITION_UNAVAILABLE
    ) {
      return false;
    }
    
    // سایر خطاها (مثل permission) را نادیده بگیریم
    return true;
  }
};

/**
 * 📱 درخواست دسترسی موقعیت جغرافیایی
 */
export const requestLocationPermission = async () => {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      // 1. بررسی وضعیت فعلی
      const status = await Geolocation.checkPermissions();

      if (status.location === 'granted' || status.coarseLocation === 'granted') {
        return { granted: true, denied: false, needsSettings: false };
      }

      if (status.location === 'denied' || status.coarseLocation === 'denied') {
        return { granted: false, denied: true, needsSettings: true };
      }

      // 2. نمایش دیالوگ اجازه دسترسی
      const requestResult = await Geolocation.requestPermissions({
        permissions: ['location', 'coarseLocation'],
      });

      const granted =
        requestResult.location === 'granted' ||
        requestResult.coarseLocation === 'granted';

      return {
        granted,
        denied: !granted,
        needsSettings: !granted,
      };
    } catch (error) {
      console.error('Permission request error:', error);
      return { granted: false, denied: true, needsSettings: true };
    }
  }

  // Web: مرورگر خودش دیالوگ نشان می‌دهد
  return { granted: true, denied: false, needsSettings: false };
};

/**
 * 🔧 باز کردن تنظیمات اپلیکیشن
 */
export const openAppSettings = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const { App } = await import('@capacitor/app');
      await App.openSettings?.();
    } catch (error) {
      console.error('Cannot open app settings:', error);
    }
  }
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

/**
 * 📍 دریافت موقعیت فعلی کاربر
 * 
 * ✅ ترتیب عملیات در Native (Android/iOS):
 *    1. بررسی روشن بودن GPS
 *    2. اگر خاموش است → باز کردن Location Settings
 *    3. درخواست Runtime Permission
 *    4. دریافت موقعیت
 * 
 * ✅ در Web:
 *    استفاده از navigator.geolocation
 */
export const getCurrentLocation = async (options = {}) => {
  const { preferSpeed = true, showSettingsPrompt = true } = options;
  const isNative = Capacitor.isNativePlatform();

  // ─── Native Platform: Android / iOS ───
  if (isNative) {
    // ═══ مرحله ۱: بررسی روشن بودن GPS ═══
    const gpsEnabled = await checkGpsEnabled();
    
    if (!gpsEnabled) {
      // GPS خاموش است
      const error = new Error('GPS گوشی شما خاموش است. لطفاً آن را روشن کنید.');
      error.code = 2; // POSITION_UNAVAILABLE
      error.gpsDisabled = true;
      
      if (showSettingsPrompt) {
        // باز کردن Location Settings
        await openLocationSettings();
      }
      
      throw error;
    }

    // ═══ مرحله ۲: درخواست دسترسی ═══
    const permission = await requestLocationPermission();

    if (!permission.granted) {
      const error = new Error(
        permission.needsSettings
          ? 'دسترسی به موقعیت رد شده است. لطفاً از تنظیمات اجازه دهید.'
          : 'دسترسی به موقعیت جغرافیایی داده نشد.'
      );
      error.code = 1; // PERMISSION_DENIED
      error.needsSettings = permission.needsSettings;
      throw error;
    }

    // ═══ مرحله ۳: دریافت موقعیت ═══
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: !preferSpeed,
        timeout: preferSpeed ? 15000 : 25000,
        maximumAge: preferSpeed ? 120000 : 30000,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: preferSpeed ? 'network' : 'gps',
      };
    } catch (capacitorError) {
      const error = new Error(capacitorError.message || 'خطا در دریافت موقعیت');
      
      const errorMsg = capacitorError.message?.toLowerCase() || '';
      
      if (
        errorMsg.includes('disabled') ||
        errorMsg.includes('unavailable') ||
        errorMsg.includes('service')
      ) {
        error.code = 2; // GPS خاموش
        error.gpsDisabled = true;
        
        if (showSettingsPrompt) {
          await openLocationSettings();
        }
      } else if (
        errorMsg.includes('denied') ||
        errorMsg.includes('permission')
      ) {
        error.code = 1; // PERMISSION_DENIED
        error.needsSettings = true;
      } else if (errorMsg.includes('timeout')) {
        error.code = 3; // TIMEOUT
      } else {
        error.code = 0;
      }
      
      throw error;
    }
  }

  // ─── Web Platform ───
  if (typeof window === 'undefined' || !navigator.geolocation) {
    const error = new Error('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
    error.code = 0;
    throw error;
  }

  if (preferSpeed) {
    try {
      return await getPositionWithStrategy({
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 120000,
      });
    } catch (networkError) {
      if (networkError.code === 1) throw networkError;
    }
  }

  try {
    return await getPositionWithStrategy({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 30000,
    });
  } catch (gpsError) {
    if (preferSpeed) {
      try {
        return await getPositionWithStrategy({
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000,
        });
      } catch (finalError) {
        if (finalError.code === 1) throw finalError;
      }
    }
    throw gpsError;
  }
};