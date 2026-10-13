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

// ═══════ ثابت‌های GPS ═══════

/**
 * زمان انتظار برای گرفتن موقعیت دقیق GPS.
 * اگر می‌خواهی سریع‌تر fail شود این را کم کن، ولی شانس timeout بیشتر می‌شود.
 */
const NATIVE_POSITION_TIMEOUT_MS = 15000;

/**
 * بعد از باز کردن Settings، حداکثر چقدر صبر کنیم کاربر برگردد.
 */
const NATIVE_SETTINGS_WAIT_TIMEOUT_MS = 60000;

/**
 * بعد از resume شدن اپ، کمی صبر کنیم تا Android وضعیت Location Services را به‌روز کند.
 */
const NATIVE_RESUME_SETTLE_MS = 800;

const WEB_HIGH_ACCURACY_TIMEOUT_MS = 15000;
const WEB_FALLBACK_TIMEOUT_MS = 10000;

/**
 * برای جلوگیری از اجرای موازی چند درخواست موقعیت.
 */
let nativeLocationPromise = null;

// ═══════ توابع کمکی خطا ═══════

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorText = (error) =>
  String(error?.message || error?.errorMessage || error || '').toLowerCase();

const createLocationError = (message, code, extra = {}) => {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, extra);
  return error;
};

const isPermissionDeniedError = (error) => {
  const text = getErrorText(error);
  return (
    error?.code === 1 ||
    text.includes('denied') ||
    text.includes('permission') ||
    text.includes('not allowed') ||
    text.includes('user denied')
  );
};

const isLocationDisabledError = (error) => {
  const text = getErrorText(error);
  return (
    error?.code === 2 ||
    text.includes('disabled') ||
    text.includes('off') ||
    text.includes('unavailable') ||
    text.includes('service') ||
    text.includes('provider') ||
    text.includes('location settings')
  );
};

const isTimeoutError = (error) => {
  const text = getErrorText(error);
  return error?.code === 3 || text.includes('timeout') || text.includes('timed out');
};

// ═══════ باز کردن تنظیمات ═══════

/**
 * 📱 باز کردن تنظیمات موقعیت مکانی گوشی
 *
 * ✅ Android: Settings > Location
 * ✅ iOS: Settings > Privacy > Location Services
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
 * 🔧 باز کردن تنظیمات اپلیکیشن
 *
 * برای مواردی مثل:
 * - دسترسی location رد شده
 * - Android 12+ کاربر "Precise location" را فعال نکرده
 */
export const openAppSettings = async () => {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const { App: CapApp } = await import('@capacitor/app');

    if (typeof CapApp.openSettings === 'function') {
      await CapApp.openSettings();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Cannot open app settings:', error);
    return false;
  }
};

/**
 * بعد از باز کردن Settings، منتظر resume شدن اپ می‌ماند.
 *
 * ⚠️ نکته مهم:
 * listener قبل از action وصل می‌شود تا اگر app خیلی سریع pause/resume شد، event را از دست ندهیم.
 */
const waitForAppResumeAfterAction = async (
  action,
  timeoutMs = NATIVE_SETTINGS_WAIT_TIMEOUT_MS
) => {
  if (!Capacitor.isNativePlatform()) return false;

  let listener = null;
  let timer = null;

  try {
    const { App: CapApp } = await import('@capacitor/app');

    let resolveResume;
    const resumePromise = new Promise((resolve) => {
      resolveResume = resolve;
    });

    timer = setTimeout(() => {
      resolveResume(false);
      timer = null;
    }, timeoutMs);

    listener = await CapApp.addListener('resume', () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      resolveResume(true);
    });

    const opened = await action();

    if (!opened) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      return false;
    }

    return await resumePromise;
  } catch (error) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    throw error;
  } finally {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (listener) {
      try {
        await listener.remove();
      } catch {
        // ignore
      }
    }
  }
};

// ═══════ دسترسی Location ═══════

const evaluatePermissionStatus = (status) => {
  /**
   * برای GPS دقیق، ideally به fine location نیاز داریم.
   * در بعضی نسخه‌های Capacitor ممکن است status.location نماینده fine باشد.
   */
  const fineGranted =
    status?.fineLocation === 'granted' || status?.location === 'granted';

  const coarseGranted = status?.coarseLocation === 'granted';
  const anyGranted = fineGranted || coarseGranted;

  const denied =
    status?.location === 'denied' ||
    status?.fineLocation === 'denied' ||
    status?.coarseLocation === 'denied';

  return {
    granted: anyGranted,
    fineGranted,
    coarseGranted,
    denied,
    needsSettings: !fineGranted,
  };
};

const ensureNativePermission = async () => {
  try {
    let status = await Geolocation.checkPermissions();
    let result = evaluatePermissionStatus(status);

    if (result.fineGranted) {
      return result;
    }

    const requestResult = await Geolocation.requestPermissions({
      permissions: ['location', 'coarseLocation', 'fineLocation'],
    });

    result = evaluatePermissionStatus(requestResult);

    if (result.fineGranted) {
      return result;
    }

    return {
      ...result,
      needsSettings: true,
    };
  } catch (error) {
    console.error('Permission request error:', error);
    return {
      granted: false,
      fineGranted: false,
      coarseGranted: false,
      denied: true,
      needsSettings: true,
      error,
    };
  }
};

/**
 * 📱 درخواست دسترسی موقعیت جغرافیایی
 *
 * برای backward compatibility نگه داشته شد.
 */
export const requestLocationPermission = async () => {
  if (!Capacitor.isNativePlatform()) {
    return { granted: true, denied: false, needsSettings: false };
  }

  const result = await ensureNativePermission();

  return {
    granted: result.granted,
    denied: !result.granted,
    needsSettings: result.needsSettings,
  };
};

// ═══════ وضعیت سرویس‌های Location ═══════

/**
 * به‌جای checkGpsEnabled قدیمی که خودش getCurrentPosition می‌زد،
 * از getProviderStatus استفاده می‌کنیم.
 *
 * این خیلی سریع‌تر و دقیق‌تر است.
 */
const ensureNativeLocationServices = async () => {
  try {
    const status = await Geolocation.getProviderStatus();

    const locationServicesEnabled = status?.locationServicesEnabled !== false;
    const gpsEnabled = status?.gpsEnabled !== false;

    if (!locationServicesEnabled) {
      return { enabled: false, reason: 'location_services' };
    }

    if (!gpsEnabled) {
      return { enabled: false, reason: 'gps' };
    }

    return { enabled: true };
  } catch (error) {
    console.warn('getProviderStatus failed, falling back to direct attempt:', error);

    /**
     * اگر API در دسترس نبود، جلوی کاربر را نمی‌گیریم.
     * بعداً از خطای getCurrentPosition تشخیص می‌دهیم.
     */
    return { enabled: true, unknown: true };
  }
};

// ═══════ گرفتن موقعیت ═══════

const acquireNativePosition = async () => {
  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: NATIVE_POSITION_TIMEOUT_MS,
    maximumAge: 0,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    source: position.coords.accuracy <= 100 ? 'gps' : 'fused',
  };
};

const retryAfterNativeSettings = async (opener, options, retryCount) => {
  if (retryCount > 0) return false;
  if (options?.showSettingsPrompt === false) return false;

  try {
    const resumed = await waitForAppResumeAfterAction(opener);

    if (!resumed) return false;

    await sleep(NATIVE_RESUME_SETTLE_MS);
    return true;
  } catch (error) {
    console.error('Auto retry after settings failed:', error);
    return false;
  }
};

const getCurrentLocationNative = async (options = {}, retryCount = 0) => {
  const { showSettingsPrompt = true } = options;
  const nextOptions = { ...options, showSettingsPrompt };

  // ═══ مرحله ۱: permission دقیق ═══
  const permission = await ensureNativePermission();

  if (!permission.fineGranted) {
    const error = createLocationError(
      'دسترسی دقیق به موقعیت داده نشده است. لطفاً از تنظیمات اپ اجازه دهید.',
      1,
      {
        needsSettings: true,
      }
    );

    const shouldRetry = await retryAfterNativeSettings(
      () => openAppSettings(),
      nextOptions,
      retryCount
    );

    if (shouldRetry) {
      return getCurrentLocationNative(nextOptions, retryCount + 1);
    }

    throw error;
  }

  // ═══ مرحله ۲: بررسی روشن بودن GPS / Location Services ═══
  const services = await ensureNativeLocationServices();

  if (!services.enabled) {
    const error = createLocationError(
      'GPS یا خدمات موقعیت‌یابی گوشی خاموش است. لطفاً آن را روشن کنید.',
      2,
      {
        gpsDisabled: true,
        reason: services.reason,
      }
    );

    const shouldRetry = await retryAfterNativeSettings(
      () => openLocationSettings(),
      nextOptions,
      retryCount
    );

    if (shouldRetry) {
      return getCurrentLocationNative(nextOptions, retryCount + 1);
    }

    throw error;
  }

  // ═══ مرحله ۳: گرفتن موقعیت دقیق ═══
  try {
    return await acquireNativePosition();
  } catch (posError) {
    if (isLocationDisabledError(posError)) {
      const error = createLocationError(
        'GPS گوشی خاموش است. لطفاً آن را روشن کنید.',
        2,
        {
          gpsDisabled: true,
        }
      );

      const shouldRetry = await retryAfterNativeSettings(
        () => openLocationSettings(),
        nextOptions,
        retryCount
      );

      if (shouldRetry) {
        return getCurrentLocationNative(nextOptions, retryCount + 1);
      }

      throw error;
    }

    if (isPermissionDeniedError(posError)) {
      const error = createLocationError(
        'دسترسی به موقعیت رد شده است. لطفاً از تنظیمات اپ اجازه دهید.',
        1,
        {
          needsSettings: true,
        }
      );

      const shouldRetry = await retryAfterNativeSettings(
        () => openAppSettings(),
        nextOptions,
        retryCount
      );

      if (shouldRetry) {
        return getCurrentLocationNative(nextOptions, retryCount + 1);
      }

      throw error;
    }

    if (isTimeoutError(posError)) {
      throw createLocationError(
        'دریافت موقعیت دقیق زمان‌بر شد. لطفاً دوباره تلاش کنید.',
        3
      );
    }

    throw createLocationError(
      posError?.message || 'خطا در دریافت موقعیت',
      posError?.code || 0
    );
  }
};

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

const getCurrentLocationWeb = async (options = {}) => {
  const { preferSpeed = false } = options;

  if (typeof window === 'undefined' || !navigator.geolocation) {
    throw createLocationError('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند', 0);
  }

  if (preferSpeed) {
    try {
      return await getPositionWithStrategy({
        enableHighAccuracy: false,
        timeout: WEB_FALLBACK_TIMEOUT_MS,
        maximumAge: 120000,
      });
    } catch (networkError) {
      if (networkError.code === 1) throw networkError;
    }
  }

  return await getPositionWithStrategy({
    enableHighAccuracy: true,
    timeout: WEB_HIGH_ACCURACY_TIMEOUT_MS,
    maximumAge: 0,
  });
};

/**
 * 📍 دریافت موقعیت فعلی کاربر
 *
 * ✅ Native:
 *    - permission دقیق
 *    - بررسی Location Services / GPS با getProviderStatus
 *    - اگر خاموش بود، Settings باز می‌شود
 *    - بعد از بازگشت کاربر، auto-retry می‌شود
 *    - موقعیت با high accuracy گرفته می‌شود
 *
 * ✅ Web:
 *    - به‌صورت پیش‌فرض high accuracy
 */
export const getCurrentLocation = async (options = {}) => {
  if (nativeLocationPromise) {
    return nativeLocationPromise;
  }

  const isNative = Capacitor.isNativePlatform();

  nativeLocationPromise = (
    isNative
      ? getCurrentLocationNative(options, 0)
      : getCurrentLocationWeb(options)
  ).finally(() => {
    nativeLocationPromise = null;
  });

  return nativeLocationPromise;
};