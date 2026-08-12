// src/utils/cancellation-utils.js
/**
 * ⏰ منطق لغو نوبت
 *
 * قوانین نهایی:
 * - زیر ۱۲ ساعت: امکان لغو وجود ندارد
 * - ۱۲ ساعت به بالا: لغو با استرداد کامل بیعانه (بدون جریمه)
 */

// ✅ import در بالای فایل
import { toGregorian } from './dateUtils';
import { toPersianDigit, toEnglishDigits } from './numberUtils';

export const CANCELLATION_THRESHOLD_HOURS = 12;

export const getHoursUntilAppointment = (dateObj, timeSlot) => {
  if (!dateObj || !timeSlot) return Infinity;

  const g = toGregorian(dateObj.jy, dateObj.jm, dateObj.jd);

  const timeStr = toEnglishDigits(String(timeSlot));
  const [hours, minutes] = timeStr.split(':').map(Number);

  const appointmentDate = new Date(g.year, g.month - 1, g.day, hours || 0, minutes || 0, 0);
  const now = new Date();
  const diffMs = appointmentDate.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60);
};

export const canCancelAppointment = (dateObj, timeSlot) => {
  const hoursLeft = getHoursUntilAppointment(dateObj, timeSlot);
  return hoursLeft >= CANCELLATION_THRESHOLD_HOURS;
};

export const getCancellationPolicy = (dateObj, timeSlot) => {
  const hoursLeft = getHoursUntilAppointment(dateObj, timeSlot);

  if (hoursLeft < CANCELLATION_THRESHOLD_HOURS) {
    return {
      canCancel: false,
      hoursLeft: Math.max(0, hoursLeft),
      message: `امکان لغو نوبت وجود ندارد (کمتر از ${CANCELLATION_THRESHOLD_HOURS} ساعت مانده)`,
      penaltyPercent: 0,
      refundPercent: 0,
    };
  }

  return {
    canCancel: true,
    hoursLeft,
    message: 'لغو با استرداد کامل بیعانه',
    penaltyPercent: 0,
    refundPercent: 100,
  };
};

export const formatHoursLeft = (hoursLeft) => {
  if (hoursLeft < 1) {
    return 'کمتر از ۱ ساعت';
  }
  if (hoursLeft < 24) {
    const h = Math.floor(hoursLeft);
    const m = Math.round((hoursLeft - h) * 60);
    if (m > 0) {
      return `${toPersianDigit(h)} ساعت و ${toPersianDigit(m)} دقیقه`;
    }
    return `${toPersianDigit(h)} ساعت`;
  }
  const days = Math.floor(hoursLeft / 24);
  const remainingHours = Math.floor(hoursLeft % 24);
  if (remainingHours > 0) {
    return `${toPersianDigit(days)} روز و ${toPersianDigit(remainingHours)} ساعت`;
  }
  return `${toPersianDigit(days)} روز`;
};
