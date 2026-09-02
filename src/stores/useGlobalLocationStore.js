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
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const LOCATION_TYPES = {
  ALL: 'all',
  PROVINCE_CITY: 'province_city',
  GPS: 'gps',
};

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
          });
        } else {
          set({
            locationType: LOCATION_TYPES.ALL,
            gpsEnabled: false,
            gpsLoading: false,
            gpsDenied: true,
            latitude: null,
            longitude: null,
          });
        }
      },

      setGpsLoading: (loading) => set({ gpsLoading: loading }),
      setGpsDenied: (denied) => set({ gpsDenied: denied }),

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
    }),
    {
      name: 'beau-global-location-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        locationType: state.locationType,
        provinceId: state.provinceId,
        cityId: state.cityId,
        latitude: state.latitude,
        longitude: state.longitude,
        gpsEnabled: state.gpsEnabled,
      }),
    }
  )
);
