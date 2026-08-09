// src/stores/business/slices/appointmentsSlice.js

/**
 * Slice نوبت‌ها
 * اکشن‌های مدیریت وضعیت نوبت‌ها (تایید کد، اعتماد، لغو)
 */
export const createAppointmentsSlice = (set) => ({
  // ─── تغییر وضعیت نوبت ───
  updateAppointmentStatus: (appointmentId, newStatus) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        appointments: state.businessData.appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ),
      },
    })),

  // ─── تایید با کد (نوبت معمولی) ───
  verifyAppointment: (appointmentId) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        appointments: state.businessData.appointments.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: 'done',
                verifiedAt: new Date().toISOString(),
                verifiedByCode: true,
              }
            : apt
        ),
      },
    })),

  // ─── تایید بدون کد (نوبت اعتمادی) ───
  confirmTrustAppointment: (appointmentId) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        appointments: state.businessData.appointments.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: 'done',
                verifiedAt: new Date().toISOString(),
                trustConfirmed: true,
              }
            : apt
        ),
      },
    })),

  // ─── لغو نوبت توسط سالن ───
  cancelAppointment: (appointmentId, reason) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        appointments: state.businessData.appointments.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: 'cancelled_by_salon',
                cancellationReason: reason || 'دلیلی ذکر نشده است',
                refundAmount: apt.depositPaid || 0,
              }
            : apt
        ),
      },
    })),

  // ─── افزودن نوبت جدید (برای آینده) ───
  addAppointment: (appointment) =>
    set((state) => ({
      businessData: {
        ...state.businessData,
        appointments: [
          ...state.businessData.appointments,
          { ...appointment, id: appointment.id || `apt_${Date.now()}` },
        ],
      },
    })),
});