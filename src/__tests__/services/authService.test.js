import { authService } from '@/api';
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

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sendOTP → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        success: true,
        data: { expires_in: 300, resend_after: 60 },
      },
    });

    const result = await authService.sendOTP('09123456789');

    expect(apiClient.post).toHaveBeenCalledWith(
      expect.stringContaining('otp'),
      expect.objectContaining({ phone: '09123456789' })
    );
    expect(result.data.success).toBe(true);
  });

  it('verifyOTP → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          access_token: 'mock_access',
          refresh_token: 'mock_refresh',
          user: { id: 1, phone: '09123456789' },
          is_new_user: false,
        },
      },
    });

    const result = await authService.verifyOTP('09123456789', '12345');

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.data.access_token).toBeDefined();
  });

  it('refreshToken → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: { access: 'new_access', refresh: 'new_refresh' },
    });

    const result = await authService.refreshToken('old_refresh');

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.access).toBe('new_access');
  });

  it('logout → موفقیت', async () => {
    apiClient.post.mockResolvedValue({ data: { success: true } });

    const result = await authService.logout();

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
  });

  it('verifyNationalId → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        success: true,
        data: { verified_name: 'مریم حسینی' },
      },
    });

    const result = await authService.verifyNationalId('0012345679');

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
  });

  it('getDevices → لیست دستگاه‌ها', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ id: 1, device_name: 'Chrome' }],
      },
    });

    const result = await authService.getDevices();

    expect(apiClient.get).toHaveBeenCalled();
    expect(result.data.success).toBe(true);
  });
});
