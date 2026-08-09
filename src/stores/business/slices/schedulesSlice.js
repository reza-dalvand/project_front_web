// src/stores/business/slices/schedulesSlice.js

/**
 * Slice زمان‌بندی
 * اکشن‌های مدیریت ساعات کاری و نوبت‌های هر خدمت
 */
export const createSchedulesSlice = (set) => ({
  // ─── ذخیره زمان‌بندی یک خدمت در یک روز خاص ───
  saveSchedule: (ownerId, serviceId, dateKey, scheduleData) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        schedules: {
          ...state.businessData.schedules,
          [ownerId]: {
            ...(state.businessData.schedules?.[ownerId] || {}),
            [serviceId]: {
              ...(state.businessData.schedules?.[ownerId]?.[serviceId] || {}),
              [dateKey]: {
                ...scheduleData,
                updatedAt: new Date().toISOString(),
              },
            },
          },
        },
      },
    })),

  // ─── حذف زمان‌بندی یک روز خاص ───
  deleteSchedule: (ownerId, serviceId, dateKey) =>
    set((state) => {
      const ownerSchedules = { ...(state.businessData.schedules?.[ownerId] || {}) };
      const serviceSchedules = { ...(ownerSchedules[serviceId] || {}) };
      delete serviceSchedules[dateKey];
      ownerSchedules[serviceId] = serviceSchedules;
      return {
        businessData: {
          ...state.businessData,
          schedules: {
            ...state.businessData.schedules,
            [ownerId]: ownerSchedules,
          },
        },
      };
    }),

  // ─── حذف کل زمان‌بندی یک خدمت ───
  clearServiceSchedule: (ownerId, serviceId) =>
    set((state) => {
      const ownerSchedules = { ...(state.businessData.schedules?.[ownerId] || {}) };
      delete ownerSchedules[serviceId];
      return {
        businessData: {
          ...state.businessData,
          schedules: {
            ...state.businessData.schedules,
            [ownerId]: ownerSchedules,
          },
        },
      };
    }),
});
