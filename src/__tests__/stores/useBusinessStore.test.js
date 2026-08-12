// src/__tests__/stores/useBusinessStore.test.js
import { useBusinessStore } from '@/stores/useBusinessStore';
import { act } from '@testing-library/react';

describe('useBusinessStore', () => {
  beforeEach(() => {
    useBusinessStore.getState().resetToDefaults();
  });

  it('داده‌های اولیه کسب‌وکار', () => {
    const state = useBusinessStore.getState();
    expect(state.businessData.name).toBe('سالن زیبایی نیلارام');
    expect(state.businessData.services.length).toBeGreaterThan(0);
    expect(state.businessData.appointments.length).toBeGreaterThan(0);
  });

  describe('خدمات', () => {
    it('افزودن خدمت جدید', () => {
      const initialCount = useBusinessStore.getState().businessData.services.length;
      act(() => {
        useBusinessStore.getState().addService({
          name: 'خدمت تست',
          typeId: 'facial',
          originalPrice: 500000,
        });
      });
      expect(useBusinessStore.getState().businessData.services.length).toBe(initialCount + 1);
    });

    it('ویرایش خدمت', () => {
      const serviceId = useBusinessStore.getState().businessData.services[0].id;
      act(() => {
        useBusinessStore.getState().updateService(serviceId, { name: 'نام جدید' });
      });
      const updated = useBusinessStore
        .getState()
        .businessData.services.find((s) => s.id === serviceId);
      expect(updated.name).toBe('نام جدید');
    });

    it('حذف خدمت', () => {
      const serviceId = useBusinessStore.getState().businessData.services[0].id;
      const initialCount = useBusinessStore.getState().businessData.services.length;
      act(() => {
        useBusinessStore.getState().deleteService(serviceId);
      });
      expect(useBusinessStore.getState().businessData.services.length).toBe(initialCount - 1);
    });

    it('فعال/غیرفعال کردن خدمت', () => {
      const service = useBusinessStore.getState().businessData.services[0];
      const initialActive = service.isActive;
      act(() => {
        useBusinessStore.getState().toggleServiceActive(service.id);
      });
      const updated = useBusinessStore
        .getState()
        .businessData.services.find((s) => s.id === service.id);
      expect(updated.isActive).toBe(!initialActive);
    });
  });

  describe('نوبت‌ها', () => {
    it('تایید نوبت با کد', () => {
      const apt = useBusinessStore
        .getState()
        .businessData.appointments.find((a) => a.status === 'reserved' && !a.trustBased);
      if (!apt) return;
      act(() => {
        useBusinessStore.getState().verifyAppointment(apt.id);
      });
      const updated = useBusinessStore
        .getState()
        .businessData.appointments.find((a) => a.id === apt.id);
      expect(updated.status).toBe('done');
      expect(updated.verifiedByCode).toBe(true);
    });

    it('تایید نوبت اعتمادی بدون کد', () => {
      const apt = useBusinessStore
        .getState()
        .businessData.appointments.find((a) => a.trustBased === true);
      if (!apt) return;
      act(() => {
        useBusinessStore.getState().confirmTrustAppointment(apt.id);
      });
      const updated = useBusinessStore
        .getState()
        .businessData.appointments.find((a) => a.id === apt.id);
      expect(updated.status).toBe('done');
      expect(updated.trustConfirmed).toBe(true);
    });

    it('لغو نوبت توسط سالن', () => {
      const apt = useBusinessStore
        .getState()
        .businessData.appointments.find((a) => a.status === 'reserved');
      if (!apt) return;
      act(() => {
        useBusinessStore.getState().cancelAppointment(apt.id, 'تست لغو');
      });
      const updated = useBusinessStore
        .getState()
        .businessData.appointments.find((a) => a.id === apt.id);
      expect(updated.status).toBe('cancelled_by_salon');
      expect(updated.cancellationReason).toBe('تست لغو');
    });
  });

  describe('نمونه‌کارها', () => {
    it('افزودن نمونه‌کار', () => {
      const initialCount = useBusinessStore.getState().businessData.portfolios.length;
      act(() => {
        useBusinessStore.getState().addPortfolio({
          title: 'نمونه‌کار تست',
          coverImage: 'https://example.com/img.jpg',
        });
      });
      expect(useBusinessStore.getState().businessData.portfolios.length).toBe(initialCount + 1);
    });
  });

  it('getActiveServices فقط خدمات فعال را برمی‌گرداند', () => {
    const activeServices = useBusinessStore.getState().getActiveServices();
    activeServices.forEach((s) => {
      expect(s.isActive).not.toBe(false);
    });
  });
});
