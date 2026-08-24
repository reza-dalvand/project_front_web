import apiClient from '@/api/api-client';

jest.mock('@/api/api-client', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    upload: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

import { appointmentsService } from '@/api';
import { paymentsService } from '@/api';

describe('Payment Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Flow کامل: رزرو → پرداخت → تایید → تسویه', () => {
    it('مرحله ۱: ایجاد نوبت', async () => {
      apiClient.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            id: 101,
            verification_code: '5678',
            status: 'reserved',
            total_price: 450000,
            deposit_amount: 100000,
          },
        },
      });

      const result = await appointmentsService.createAppointment({
        service_id: 1,
        jy: 1405,
        jm: 6,
        jd: 15,
        time_slot: '10:00',
      });

      expect(result.data.data.id).toBe(101);
      expect(result.data.data.deposit_amount).toBe(100000);
    });

    it('مرحله ۲: شروع پرداخت بیعانه', async () => {
      apiClient.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            payment_url: 'https://zarinp.al/pay/456',
            tracking_code: 'TRK-789',
          },
        },
      });

      const result = await paymentsService.initiatePayment({
        appointment_id: 101,
        amount: 100000,
      });

      expect(result.data.data.payment_url).toBeDefined();
    });

    it('مرحله ۳: تایید کد خدمت', async () => {
      apiClient.post.mockResolvedValue({
        data: {
          success: true,
          data: { status: 'done', is_verified: true },
        },
      });

      const result = await appointmentsService.verifyServiceCode(101, {
        code: '5678',
      });

      expect(result.data.data.status).toBe('done');
    });
  });

  describe('تولید مجدد کد تایید', () => {
    it('کد جدید تولید شود', async () => {
      apiClient.post.mockResolvedValue({
        data: {
          success: true,
          data: { verification_code: '9012', message: 'کد جدید ارسال شد' },
        },
      });

      const result = await appointmentsService.regenerateCode(101);

      expect(apiClient.post).toHaveBeenCalled();
      expect(result.data.data.verification_code).toBe('9012');
    });
  });
});
