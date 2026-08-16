// src/__tests__/integration/bookingFlow.test.js
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { act } from '@testing-library/react';
// ✅ FIX P1: import از price-utils به جای numberUtils
import { calculateAppFee } from '@/utils/price-utils';
import { toJalaaliKey } from '@/utils/date-converter';

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    useBusinessStore.getState().resetToDefaults();
    useAuthStore.setState({
      isAuthenticated: true,
      user: { phone: '09123456789' },
      _hydrated: true,
    });
  });

  it('Flow کامل: انتخاب خدمت → رزرو → تایید با کد', () => {
    const store = useBusinessStore.getState();
    const service = store.businessData.services[0];

    // ۱. بررسی قیمت
    const appFee = calculateAppFee(service.finalPrice);
    expect(appFee).toBeGreaterThan(0);
    expect(appFee).toBeLessThanOrEqual(50000);

    // ۲. ساخت date_key
    const dateKey = toJalaaliKey(1403, 4, 15);
    expect(dateKey).toBe('1403/04/15');

    // ۳. رزرو نوبت (شبیه‌سازی)
    const aptId = 'test_apt_1';
    act(() => {
      useBusinessStore.getState().addAppointment({
        id: aptId,
        customerName: 'مریم حسینی',
        serviceName: service.name,
        date: { jy: 1403, jm: 4, jd: 15 },
        time: '10:30',
        status: 'reserved',
        price: service.finalPrice,
        depositPaid: service.depositAmount,
        verificationCode: '5892',
      });
    });

    const apt = useBusinessStore.getState().businessData.appointments.find((a) => a.id === aptId);
    expect(apt).toBeDefined();
    expect(apt.status).toBe('reserved');

    // ۴. تایید با کد
    act(() => {
      useBusinessStore.getState().verifyAppointment(aptId);
    });

    const verifiedApt = useBusinessStore
      .getState()
      .businessData.appointments.find((a) => a.id === aptId);
    expect(verifiedApt.status).toBe('done');
    expect(verifiedApt.verifiedByCode).toBe(true);
  });

  it('Flow لغو نوبت توسط سالن', () => {
    const apt = useBusinessStore
      .getState()
      .businessData.appointments.find((a) => a.status === 'reserved');
    if (!apt) return;

    act(() => {
      useBusinessStore.getState().cancelAppointment(apt.id, 'تعطیلی سالن');
    });

    const cancelled = useBusinessStore
      .getState()
      .businessData.appointments.find((a) => a.id === apt.id);
    expect(cancelled.status).toBe('cancelled_by_salon');
    expect(cancelled.refundAmount).toBe(cancelled.depositPaid);
  });

  it('Flow نوبت اعتمادی: بدون کد', () => {
    const trustApt = useBusinessStore
      .getState()
      .businessData.appointments.find((a) => a.trustBased === true);
    if (!trustApt) return;

    expect(trustApt.verificationCode).toBeNull();

    act(() => {
      useBusinessStore.getState().confirmTrustAppointment(trustApt.id);
    });

    const confirmed = useBusinessStore
      .getState()
      .businessData.appointments.find((a) => a.id === trustApt.id);
    expect(confirmed.status).toBe('done');
    expect(confirmed.trustConfirmed).toBe(true);
  });
});
