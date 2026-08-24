import { businessesService } from '@/api';
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

// ماک axios-instance برای updateBusiness (که از آن استفاده می‌کند)
jest.mock('@/api/axios-instance', () => ({
  __esModule: true,
  default: {
    put: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

const mockBusiness = {
  id: 1,
  name: 'سالن زیبایی تست',
  status: 'approved',
  booking_slug: 'salon-test',
  category_name: 'سالن زیبایی',
  rating: 4.5,
  reviews_count: 10,
};

describe('businessesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getBusinessDetail → موفقیت', async () => {
    apiClient.get.mockResolvedValue({
      data: { success: true, data: mockBusiness },
    });

    const result = await businessesService.getBusinessDetail();

    expect(apiClient.get).toHaveBeenCalled();
    expect(result.data.data.name).toBe('سالن زیبایی تست');
  });

  it('getBusinessStatus → موفقیت', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        data: { has_business: true, business_id: 1, status: 'approved' },
      },
    });

    const result = await businessesService.getBusinessStatus();

    expect(apiClient.get).toHaveBeenCalled();
    expect(result.data.data.has_business).toBe(true);
  });

  it('createBusiness → موفقیت', async () => {
    apiClient.post.mockResolvedValue({
      data: { success: true, data: { ...mockBusiness, status: 'pending' } },
    });

    const result = await businessesService.createBusiness({
      name: 'سالن جدید',
      category: 1,
      province: 1,
      city: 1,
      address: 'آدرس تست',
    });

    expect(apiClient.post).toHaveBeenCalled();
    expect(result.data.data.status).toBe('pending');
  });

  it('getPublicBusiness → موفقیت', async () => {
    apiClient.get.mockResolvedValue({
      data: { success: true, data: mockBusiness },
    });

    const result = await businessesService.getPublicBusiness('salon-test');

    expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('salon-test'));
    expect(result.data.data.booking_slug).toBe('salon-test');
  });
});
