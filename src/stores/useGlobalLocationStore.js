// src/stores/useGlobalLocationStore.js
/**
 * 🌍 استور سراسری فیلتر موقعیت
 *
 * قوانین:
 *  - سه حالت: 'all' | 'province_city' | 'gps'
 *  - GPS اولویت دارد → استان/شهر غیرفعال
 *  - خطای GPS → بازگشت به آخرین استان/شهر ذخیره‌شده
 *  - بدون فیلتر → نمایش همه محتوا
 *  - ذخیره در localStorage (مداوم)
 *
 * ✅ FIX 5.3: مدیریت داده‌های قدیمی (stale data)
 *  - اضافه کردن timestamp برای GPS
 *  - غیرفعال‌سازی خودکار GPS هنگام rehydration اگر مختصات نباشد
 *  - اعتبارسنجی ساختار داده‌ها
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const LOCATION_TYPES = {
  ALL: 'all',
  PROVINCE_CITY: 'province_city',
  GPS: 'gps',
};

// ✅ FIX 5.3: نسخه استور برای migration
const LOCATION_STORE_VERSION = 2;

// ✅ FIX 5.3: حداکثر عمر داده‌های GPS (۲۴ ساعت)
// بعد از این مدت، GPS خودکار غیرفعال می‌شود
const GPS_STALENESS_THRESHOLD_MS = 24 * 60 * 60 * 1000;

export const useGlobalLocationStore = create(
  persist(
    (set, get) => ({
      // ─── State ───
      locationType: LOCATION_TYPES.ALL,
      provinceId: null,
      cityId: null,
      latitude: null,
      longitude: null,
      gpsEnabled: false,
      gpsLoading: false,
      gpsDenied: false,

      // ✅ FIX 5.3: timestamp آخرین به‌روزرسانی GPS
      _gpsTimestamp: null,
      // ✅ FIX 5.3: timestamp آخرین به‌روزرسانی استان/شهر
      _locationTimestamp: null,
      // ✅ FIX 5.3: نسخه استور
      _version: LOCATION_STORE_VERSION,

      // ─── Actions ───

      /**
       * تنظیم فیلتر استان/شهر
       * اگر GPS فعال باشد، ابتدا غیرفعال می‌شود
       */
      setLocation: (provinceId, cityId) => {
        set({
          locationType: provinceId ? LOCATION_TYPES.PROVINCE_CITY : LOCATION_TYPES.ALL,
          provinceId: provinceId || null,
          cityId: cityId || null,
          gpsEnabled: false,
          latitude: null,
          longitude: null,
          gpsLoading: false,
          gpsDenied: false,
          _gpsTimestamp: null,
          _locationTimestamp: provinceId ? Date.now() : null,
        });
      },

      /**
       * فعال‌سازی GPS
       * استان/شهر را غیرفعال می‌کند ولی حذف نمی‌کند (برای فال‌بک)
       */
      enableGps: (latitude, longitude) => {
        set({
          locationType: LOCATION_TYPES.GPS,
          gpsEnabled: true,
          gpsLoading: false,
          gpsDenied: false,
          latitude,
          longitude,
          // ✅ FIX 5.3: ذخیره timestamp برای تشخیص staleness
          _gpsTimestamp: Date.now(),
          // provinceId و cityId حفظ می‌شوند برای فال‌بک
        });
      },

      /**
       * غیرفعال‌سازی GPS → بازگشت به استان/شهر ذخیره‌شده
       */
      disableGps: () => {
        const { provinceId } = get();
        if (provinceId) {
          // بازگشت به آخرین استان/شهر
          set({
            locationType: LOCATION_TYPES.PROVINCE_CITY,
            gpsEnabled: false,
            gpsLoading: false,
            gpsDenied: false,
            latitude: null,
            longitude: null,
            _gpsTimestamp: null,
          });
        } else {
          // هیچ فیلتری وجود ندارد → نمایش همه
          set({
            locationType: LOCATION_TYPES.ALL,
            gpsEnabled: false,
            gpsLoading: false,
            gpsDenied: false,
            latitude: null,
            longitude: null,
            _gpsTimestamp: null,
          });
        }
      },

      /**
       * خطای GPS → فال‌بک به استان/شهر
       */
      handleGpsError: () => {
        const { provinceId } = get();
        if (provinceId) {
          set({
            locationType: LOCATION_TYPES.PROVINCE_CITY,
            gpsEnabled: false,
            gpsLoading: false,
            gpsDenied: true,
            latitude: null,
            longitude: null,
            _gpsTimestamp: null,
          });
        } else {
          set({
            locationType: LOCATION_TYPES.ALL,
            gpsEnabled: false,
            gpsLoading: false,
            gpsDenied: true,
            latitude: null,
            longitude: null,
            _gpsTimestamp: null,
          });
        }
      },

      setGpsLoading: (loading) => set({ gpsLoading: loading }),
      setGpsDenied: (denied) => set({ gpsDenied: denied }),

      /**
       * ✅ FIX 5.3: ریست کامل موقعیت مکانی
       */
      resetLocation: () => {
        set({
          locationType: LOCATION_TYPES.ALL,
          provinceId: null,
          cityId: null,
          latitude: null,
          longitude: null,
          gpsEnabled: false,
          gpsLoading: false,
          gpsDenied: false,
          _gpsTimestamp: null,
          _locationTimestamp: null,
        });
      },

      /**
       * ساخت پارامترهای مکانی برای ارسال به API
       * @returns {object} پارامترهای قابل ارسال به بک‌اند
       */
      getLocationParams: () => {
        const { locationType, provinceId, cityId, latitude, longitude, gpsEnabled } = get();

        if (locationType === LOCATION_TYPES.GPS && gpsEnabled && latitude && longitude) {
          return { lat: latitude, lng: longitude };
        }

        if (locationType === LOCATION_TYPES.PROVINCE_CITY && provinceId) {
          const params = { province_id: provinceId };
          if (cityId) params.city_id = cityId;
          return params;
        }

        // حالت ALL → بدون فیلتر مکانی
        return {};
      },

      /**
       * آیا فیلتر مکانی فعال است؟
       */
      hasActiveLocationFilter: () => {
        const { locationType } = get();
        return locationType !== LOCATION_TYPES.ALL;
      },

      /**
       * دریافت متن نمایشی موقعیت فعال
       */
      getLocationLabel: () => {
        const { locationType, gpsEnabled } = get();
        if (locationType === LOCATION_TYPES.GPS && gpsEnabled) {
          return '📍 موقعیت فعلی شما';
        }
        if (locationType === LOCATION_TYPES.PROVINCE_CITY) {
          return '🏙️ فیلتر استان/شهر';
        }
        return '🌐 همه مناطق';
      },

      /**
       * ✅ FIX 5.3: بررسی قدیمی بودن داده‌های GPS
       * @returns {boolean} true = داده‌ها قدیمی هستند
       */
      isGpsStale: () => {
        const { _gpsTimestamp, gpsEnabled } = get();
        if (!gpsEnabled || !_gpsTimestamp) return true;
        return Date.now() - _gpsTimestamp > GPS_STALENESS_THRESHOLD_MS;
      },
    }),
    {
      name: 'beau-global-location-storage',
      version: LOCATION_STORE_VERSION,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      // ═══════════════════════════════════════════════════════════════
      // ✅ FIX امنیت: حذف مختصات GPS دقیق از localStorage
      // ═══════════════════════════════════════════════════════════════
      partialize: (state) => ({
        locationType: state.locationType,
        provinceId: state.provinceId,
        cityId: state.cityId,
        gpsEnabled: state.gpsEnabled,
        // ✅ FIX 5.3: ذخیره timestamp برای تشخیص staleness
        _gpsTimestamp: state._gpsTimestamp,
        _locationTimestamp: state._locationTimestamp,
        _version: LOCATION_STORE_VERSION,
        // ❌ حذف: latitude, longitude (مختصات دقیق ذخیره نمی‌شوند)
      }),

      // ═══════════════════════════════════════════════════════════════
      // ✅ FIX 5.3: Migration برای نسخه‌های آینده
      // ═══════════════════════════════════════════════════════════════
      migrate: (persistedState, version) => {
        if (!persistedState || version < LOCATION_STORE_VERSION) {
          console.warn(
            `[useGlobalLocationStore] Migrating from v${version} to v${LOCATION_STORE_VERSION}. Resetting.`
          );
          return {
            locationType: LOCATION_TYPES.ALL,
            provinceId: null,
            cityId: null,
            gpsEnabled: false,
            _gpsTimestamp: null,
            _locationTimestamp: null,
            _version: LOCATION_STORE_VERSION,
          };
        }
        return persistedState;
      },

      // ═══════════════════════════════════════════════════════════════
      // ✅ FIX 5.3: اعتبارسنجی و رفع staleness هنگام rehydration
      // ═══════════════════════════════════════════════════════════════
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('[useGlobalLocationStore] Rehydration error:', error);
            try {
              useGlobalLocationStore.persist.clearStorage();
            } catch {
              // silently ignore
            }
            return;
          }

          if (!state) return;

          // ─── FIX 5.3: بررسی gpsEnabled بدون مختصات ───
          // چون latitude و longitude در partialize ذخیره نمی‌شوند،
          // پس از rehydration همیشه null هستند.
          // اگر gpsEnabled=true باشد ولی مختصات نباشد → غیرفعال کن
          if (state.gpsEnabled && (!state.latitude || !state.longitude)) {
            console.warn(
              '[useGlobalLocationStore] GPS was enabled but coordinates are missing after rehydration. Disabling GPS.'
            );
            state.gpsEnabled = false;
            state.locationType = state.provinceId
              ? LOCATION_TYPES.PROVINCE_CITY
              : LOCATION_TYPES.ALL;
            state._gpsTimestamp = null;
          }

          // ─── FIX 5.3: بررسی staleness داده‌های GPS ───
          if (
            state.gpsEnabled &&
            state._gpsTimestamp &&
            Date.now() - state._gpsTimestamp > GPS_STALENESS_THRESHOLD_MS
          ) {
            console.warn(
              '[useGlobalLocationStore] GPS data is stale (>24h old). Disabling GPS.'
            );
            state.gpsEnabled = false;
            state.locationType = state.provinceId
              ? LOCATION_TYPES.PROVINCE_CITY
              : LOCATION_TYPES.ALL;
            state._gpsTimestamp = null;
          }

          // ─── اعتبارسنجی locationType ───
          const validTypes = Object.values(LOCATION_TYPES);
          if (!validTypes.includes(state.locationType)) {
            state.locationType = LOCATION_TYPES.ALL;
          }

          // ─── اعتبارسنجی provinceId و cityId ───
          // اگر locationType=province_city باشد ولی provinceId نباشد → ALL
          if (
            state.locationType === LOCATION_TYPES.PROVINCE_CITY &&
            !state.provinceId
          ) {
            state.locationType = LOCATION_TYPES.ALL;
          }

          // ─── اطمینان از وجود timestamp ها ───
          if (typeof state._gpsTimestamp !== 'number' && state._gpsTimestamp !== null) {
            state._gpsTimestamp = null;
          }
          if (typeof state._locationTimestamp !== 'number' && state._locationTimestamp !== null) {
            state._locationTimestamp = null;
          }
        };
      },
    }
  )
);