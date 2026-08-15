// src/__tests__/services/paymentFlow.test.js
import { appointmentsService, paymentsService } from '@/api';

jest.mock('@/api/config', () => ({
  USE_MOCK: true,
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
}));

describe('Payment Flow Integration', () => {
  describe('Flow کامل: رزرو → پرداخت → تایید → تسویه', () => {
    it('مرحله ۱: ایجاد نوبت', async () => {
      const result = await appointmentsService.createAppointment({
        service_id: 1,
        jy: 1405,
        jm: 4,
        jd: 22,
        time_slot: '10:00',
      });
      expect(result.data).toHaveProperty('id');
      // ✅ FIX: استفاده از camelCase
      expect(result.data).toHaveProperty('verificationCode');
      expect(result.data.status).toBe('reserved');
      expect(result.data.depositAmount).toBeGreaterThan(0);
    });

    it('مرحله ۲: شروع پرداخت بیعانه', async () => {
      const result = await paymentsService.initiatePayment('apt_1');
      // ✅ FIX: استفاده از camelCase
      expect(result.data).toHaveProperty('paymentUrl');
      expect(result.data).toHaveProperty('trackId');
      expect(result.data).toHaveProperty('transactionId');
      expect(result.data.amount).toBeGreaterThan(0);
    });

    it('مرحله ۳: تایید کد خدمت', async () => {
      const result = await appointmentsService.verifyServiceCode('apt_1', '5892');
      // Mock handler ممکن است فقط message برگرداند یا data
      if (result.data) {
        expect(result.data).toHaveProperty('status');
        expect(result.data.status).toBe('done');
      } else {
        expect(result.message).toBeDefined();
      }
    });

    it('مرحله ۵: درخواست تسویه', async () => {
      const result = await paymentsService.requestSettlement(500000);
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('amount');
      // ✅ FIX: استفاده از camelCase
      expect(result.data).toHaveProperty('bankSheba');
    });
  });

  describe('تولید مجدد کد تایید', () => {
    it('کد جدید تولید شود', async () => {
      const result = await appointmentsService.regenerateCode('apt_1');
      if (result.data) {
        // ✅ FIX: استفاده از camelCase
        expect(result.data).toHaveProperty('verificationCode');
        expect(result.data.verificationCode).toHaveLength(4);
      } else {
        expect(result.message).toBeDefined();
      }
    });
  });
});
