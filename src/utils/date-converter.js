// src/utils/date-converter.js
/**
 * 🔄 مبدل تاریخ جلالی ↔ date_key
 */

// ✅ import در بالای فایل
import { toJalaali, PERSIAN_MONTHS, todayJalaali } from './dateUtils';

/**
 * تبدیل تاریخ جلالی به date_key
 */
export const toJalaaliKey = (jy, jm, jd) => {
  if (!jy || !jm || !jd) return '';
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
};

/**
 * تبدیل date_key به تاریخ جلالی
 */
export const fromJalaaliKey = (dateKey) => {
  if (!dateKey) return { jy: 0, jm: 0, jd: 0 };
  const parts = dateKey.split('/').map(Number);
  if (parts.length !== 3) return { jy: 0, jm: 0, jd: 0 };
  return { jy: parts[0], jm: parts[1], jd: parts[2] };
};

/**
 * تبدیل آبجکت تاریخ جلالی به date_key
 */
export const dateObjToKey = (dateObj) => {
  if (!dateObj) return '';
  return toJalaaliKey(dateObj.jy, dateObj.jm, dateObj.jd);
};

/**
 * تبدیل date_key به آبجکت تاریخ جلالی
 */
export const keyToDateObj = (dateKey) => {
  return fromJalaaliKey(dateKey);
};

/**
 * ساخت date_key از Date میلادی
 */
export const gregorianToJalaaliKey = (date) => {
  // ✅ مستقیم از import استفاده شد
  const j = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return toJalaaliKey(j.jy, j.jm, j.jd);
};

/**
 * ساخت payload برای ارسال به API
 */
export const buildAppointmentPayload = ({ jy, jm, jd, timeSlot, serviceId }) => {
  return {
    service_id: serviceId,
    jy,
    jm,
    jd,
    time_slot: timeSlot,
  };
};

/**
 * فرمت date_key برای نمایش
 */
export const formatJalaaliKeyForDisplay = (dateKey) => {
  const { jm, jd, jy } = fromJalaaliKey(dateKey);
  // ✅ مستقیم از import استفاده شد
  if (!jm || !jd || !jy) return '';
  return `${jd} ${PERSIAN_MONTHS[jm - 1]} ${jy}`;
};

/**
 * مقایسه دو date_key
 */
export const compareJalaaliKeys = (key1, key2) => {
  if (!key1 && !key2) return 0;
  if (!key1) return -1;
  if (!key2) return 1;
  return key1.localeCompare(key2);
};

/**
 * آیا date_key امروز است؟
 */
export const isTodayKey = (dateKey) => {
  // ✅ مستقیم از import استفاده شد
  const today = todayJalaali();
  const todayKey = toJalaaliKey(today.jy, today.jm, today.jd);
  return dateKey === todayKey;
};

/**
 * آیا date_key در آینده است؟
 */
export const isFutureKey = (dateKey) => {
  // ✅ مستقیم از import استفاده شد
  const today = todayJalaali();
  const todayKey = toJalaaliKey(today.jy, today.jm, today.jd);
  return compareJalaaliKeys(dateKey, todayKey) > 0;
};

/**
 * آیا date_key در گذشته است؟
 */
export const isPastKey = (dateKey) => {
  // ✅ مستقیم از import استفاده شد
  const today = todayJalaali();
  const todayKey = toJalaaliKey(today.jy, today.jm, today.jd);
  return compareJalaaliKeys(dateKey, todayKey) < 0;
};
