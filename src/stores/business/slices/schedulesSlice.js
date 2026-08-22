// src/stores/business/slices/schedulesSlice.js
/**
 * Slice زمان‌بندی — نسخه نهایی با API sync
 *
 * هماهنگ با بک‌اند:
 * - ServiceSchedule: service, jy, jm, jd, date_key,
 *   work_start, work_end, slot_duration, breaks, slot_count
 * - unique_together: [service, date_key]
 * - AvailableSlots: GET /schedules/available-slots/
 * - AvailableDates: GET /schedules/available-dates/
 */
import { schedulesService } from '@/api';
/**
 * تبدیل فرمت بک‌اند به فرمت فرانت
 */
const mapScheduleFromApi = (s) => ({
  id: s.id,
  serviceId: s.service_id || s.service,
  jy: s.jy,
  jm: s.jm,
  jd: s.jd,
  dateKey: s.date_key,
  workStart: s.work_start,
  workEnd: s.work_end,
  slotDuration: s.slot_duration,
  breaks: s.breaks || [],
  slotCount: s.slot_count || 0,
  serviceName: s.service_name || '',
});

/**
 * تبدیل فرمت فرانت به فرمت بک‌اند (برای ایجاد)
 */
const mapScheduleToApi = (scheduleData) => ({
  service: scheduleData.serviceId,
  jy: scheduleData.jy,
  jm: scheduleData.jm,
  jd: scheduleData.jd,
  work_start: scheduleData.workStart,
  work_end: scheduleData.workEnd,
  slot_duration: scheduleData.slotDuration,
  breaks: (scheduleData.breaks || []).map(({ id, ...rest }) => rest),
});

export const createSchedulesSlice = (set, get) => ({
  // ─── State ───
  schedulesLoading: false,
  schedulesError: null,
  availableSlots: [],
  availableDates: [],
  slotsLoading: false,
  datesLoading: false,

  // ─── API Sync ───
  /**
   * دریافت لیست زمان‌بندی‌ها از API
   */
  fetchSchedules: async (serviceId = null) => {
    set({ schedulesLoading: true, schedulesError: null });
    try {
      const params = serviceId ? { service_id: serviceId } : {};
      const response = await schedulesService.getSchedules(params);
      const schedules = (response.data || []).map(mapScheduleFromApi);
      set({ schedulesLoading: false });
      return schedules;
    } catch (error) {
      console.error('fetchSchedules failed:', error);
      set({ schedulesError: error.message, schedulesLoading: false });
      throw error;
    }
  },

  /**
   * ایجاد زمان‌بندی در API
   */
  createScheduleApi: async (scheduleData) => {
    try {
      const payload = mapScheduleToApi(scheduleData);
      const response = await schedulesService.createSchedule(payload);
      const dateKey = `${scheduleData.jy}/${String(scheduleData.jm).padStart(2, '0')}/${String(scheduleData.jd).padStart(2, '0')}`;
      get().saveSchedule(
        scheduleData.ownerId || 'owner',
        scheduleData.serviceId,
        dateKey,
        scheduleData
      );
      return response.data;
    } catch (error) {
      console.error('createScheduleApi failed:', error);
      throw error;
    }
  },

  /**
   * بروزرسانی زمان‌بندی در API
   */
  updateScheduleApi: async (scheduleId, scheduleData) => {
    try {
      const payload = {};
      if (scheduleData.workStart !== undefined) payload.work_start = scheduleData.workStart;
      if (scheduleData.workEnd !== undefined) payload.work_end = scheduleData.workEnd;
      if (scheduleData.slotDuration !== undefined)
        payload.slot_duration = scheduleData.slotDuration;
      if (scheduleData.breaks !== undefined) {
        payload.breaks = (scheduleData.breaks || []).map(({ id, ...rest }) => rest);
      }
      const response = await schedulesService.updateSchedule(scheduleId, payload);
      return response.data;
    } catch (error) {
      console.error('updateScheduleApi failed:', error);
      throw error;
    }
  },

  /**
   * حذف زمان‌بندی در API
   */
  deleteScheduleApi: async (scheduleId) => {
    try {
      await schedulesService.deleteSchedule(scheduleId);
    } catch (error) {
      console.error('deleteScheduleApi failed:', error);
      throw error;
    }
  },

  /**
   * 🆕 دریافت اسلات‌های آزاد
   */
  fetchAvailableSlots: async (businessId, serviceId, jy, jm, jd) => {
    set({ slotsLoading: true });
    try {
      const response = await schedulesService.getAvailableSlots(businessId, serviceId, jy, jm, jd);
      const slots = response.data || [];
      set({ availableSlots: slots, slotsLoading: false });
      return slots;
    } catch (error) {
      console.error('fetchAvailableSlots failed:', error);
      set({ slotsLoading: false });
      throw error;
    }
  },

  /**
   * 🆕 دریافت روزهای دارای اسلات آزاد
   */
  fetchAvailableDates: async (businessId, serviceId, daysAhead = 30) => {
    set({ datesLoading: true });
    try {
      const response = await schedulesService.getAvailableDates(businessId, serviceId, daysAhead);
      const dates = response.data || [];
      set({ availableDates: dates, datesLoading: false });
      return dates;
    } catch (error) {
      console.error('fetchAvailableDates failed:', error);
      set({ datesLoading: false });
      throw error;
    }
  },

  // ─── Local Actions ───
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

  deleteSchedule: (ownerId, serviceId, dateKey) =>
    set((state) => {
      const ownerSchedules = { ...(state.businessData.schedules?.[ownerId] || {}) };
      const serviceSchedules = { ...(ownerSchedules[serviceId] || {}) };
      delete serviceSchedules[dateKey];
      ownerSchedules[serviceId] = serviceSchedules;
      return {
        businessData: {
          ...state.businessData,
          schedules: { ...state.businessData.schedules, [ownerId]: ownerSchedules },
        },
      };
    }),

  clearServiceSchedule: (ownerId, serviceId) =>
    set((state) => {
      const ownerSchedules = { ...(state.businessData.schedules?.[ownerId] || {}) };
      delete ownerSchedules[serviceId];
      return {
        businessData: {
          ...state.businessData,
          schedules: { ...state.businessData.schedules, [ownerId]: ownerSchedules },
        },
      };
    }),
});
