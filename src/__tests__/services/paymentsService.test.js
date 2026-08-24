import { paymentsService } from '@/api';
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

describe('paymentsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initiatePayment → لینک پرداخت و trackId برگرداند', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          payment_url: 'https://zarinp.al/pay/123',
          tracking_code: 'TRK-123456',
          amount: 100000,
        },
      },
    });

    const result = await paymentsService.initiatePayment({
      appointment_id: 1,
      amount: 100000,
    });

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.data.payment_url).toContain('zarinp.al');
    expect(result.data.data.tracking_code).toBeDefined();
  });
});
