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
import { USE_MOCK } from '@/api/config';

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
    if (USE_MOCK) return [];
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
    if (USE_MOCK) {
      const dateKey = `${scheduleData.jy}/${String(scheduleData.jm).padStart(2, '0')}/${String(scheduleData.jd).padStart(2, '0')}`;
      get().saveSchedule(
        scheduleData.ownerId || 'owner',
        scheduleData.serviceId,
        dateKey,
        scheduleData
      );
      return { id: `sch_${Date.now()}`, ...scheduleData };
    }
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
    if (USE_MOCK) return scheduleData;
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
    if (USE_MOCK) return;
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
    if (USE_MOCK) {
      // Mock: تولید اسلات‌های نمونه
      const mockSlots = [];
      for (let h = 9; h < 21; h++) {
        for (let m = 0; m < 60; m += 30) {
          const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          const endTime = `${String(h).padStart(2, '0')}:${String(Math.min(m + 30, 59)).padStart(2, '0')}`;
          mockSlots.push({
            id: `${jy}${String(jm).padStart(2, '0')}${String(jd).padStart(2, '0')}_${time.replace(':', '')}`,
            jy,
            jm,
            jd,
            date_key: `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`,
            start_time: time,
            end_time: endTime,
            is_available: Math.random() > 0.3,
            display_time: time,
          });
        }
      }
      const available = mockSlots.filter((s) => s.is_available);
      set({ availableSlots: available, slotsLoading: false });
      return available;
    }
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
    if (USE_MOCK) {
      // Mock: تولید روزهای نمونه
      const mockDates = [];
      const today = new Date();
      for (let i = 0; i < daysAhead; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        if (d.getDay() === 5) continue; // جمعه‌ها رد شوند
        const jm = ((d.getMonth() + 3) % 12) + 1; // تقریبی
        const jd = d.getDate();
        mockDates.push({
          jy: 1405,
          jm,
          jd,
          date_key: `1405/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`,
          day_of_week: (d.getDay() + 1) % 7,
          weekday_name: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'][
            (d.getDay() + 1) % 7
          ],
          available_slots_count: Math.floor(Math.random() * 10) + 2,
          is_today: i === 0,
          is_friday: false,
        });
      }
      set({ availableDates: mockDates, datesLoading: false });
      return mockDates;
    }
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
