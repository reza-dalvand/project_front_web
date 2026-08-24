import { profileService } from '@/api';
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

describe('profileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getProfile → موفقیت و داشتن فیلدهای ضروری', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          id: 1,
          phone: '09123456789',
          first_name: 'مریم',
          last_name: 'حسینی',
          is_verified: true,
        },
      },
    });

    const result = await profileService.getProfile();

    expect(apiClient.get).toHaveBeenCalled();
    expect(result.data.data.phone).toBeDefined();
    expect(result.data.data.first_name).toBeDefined();
  });

  it('requestChangePhone → موفقیت و داشتن expires_in', async () => {
    apiClient.post.mockResolvedValue({
      data: {
        success: true,
        data: { expires_in: 300, resend_after: 60 },
      },
    });

    const result = await profileService.requestChangePhone('09120000001');

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.data.expires_in).toBe(300);
  });
});
