// src/__tests__/services/paymentsService.test.js
import { paymentsService } from '@/api';

jest.mock('@/api/config', () => ({
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
}));

describe('paymentsService', () => {
  it('initiatePayment → لینک پرداخت و trackId برگرداند', async () => {
    const result = await paymentsService.initiatePayment(1);
    expect(result.data).toBeDefined();
    // ✅ FIX: فیلدها توسط نرمال‌ساز به camelCase تبدیل می‌شوند
    expect(result.data).toHaveProperty('paymentUrl');
    expect(result.data).toHaveProperty('trackId');
    expect(result.data).toHaveProperty('trackingCode');
    expect(result.data).toHaveProperty('transactionId');
  });
});
