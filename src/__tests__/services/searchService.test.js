import { searchService } from '@/api';
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

describe('searchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('search → موفقیت و ساختار صحیح (businesses و services)', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          businesses: [{ id: 1, name: 'سالن تست' }],
          services: [{ id: 1, name: 'فیشیال' }],
          total: 2,
        },
      },
    });

    const result = await searchService.search('سالن');

    expect(apiClient.get).toHaveBeenCalled();
    expect(result.data.data.businesses).toBeDefined();
    expect(result.data.data.services).toBeDefined();
  });

  it('getSuggestions → لیست پیشنهادات (آرایه)', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: ['فیشیال', 'کاشت ناخن', 'رنگ مو'],
      },
    });

    const result = await searchService.getSuggestions('فیش');

    expect(apiClient.get).toHaveBeenCalled();
    expect(Array.isArray(result.data.data)).toBe(true);
  });
});
