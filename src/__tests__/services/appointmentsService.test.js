import { appointmentsService } from '@/api';
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

describe('appointmentsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createAppointment → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          verification_code: '4321',
          status: 'reserved',
          total_price: 450000,
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

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.data.verification_code).toBe('4321');
  });

  it('getMyAppointments → لیست نوبت‌ها', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          results: [{ id: 1, status: 'reserved' }],
          count: 1,
        },
      },
    });

    const result = await appointmentsService.getMyAppointments();

    expect(apiClient.get).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
  });

  it('cancelAppointment → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: { success: true, data: { status: 'cancelled_by_customer' } },
    });

    const result = await appointmentsService.cancelAppointment(1, {
      reason_text: 'تغییر برنامه',
    });

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
  });

  it('verifyServiceCode → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: { success: true, data: { status: 'done' } },
    });

    const result = await appointmentsService.verifyServiceCode(1, {
      code: '4321',
    });

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
  });
});
