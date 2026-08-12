// src/__tests__/services/businessesService.test.js
import { businessesService } from '@/api';

jest.mock('@/api/config', () => ({
  USE_MOCK: true,
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
}));

describe('businessesService', () => {
  it('getBusinessDetail → موفقیت', async () => {
    const result = await businessesService.getBusinessDetail();
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('name');
    expect(result.data).toHaveProperty('booking_slug');
  });

  it('getBusinessStatus → موفقیت', async () => {
    const result = await businessesService.getBusinessStatus();
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('has_business');
  });

  it('createBusiness → موفقیت', async () => {
    const result = await businessesService.createBusiness({
      name: 'سالن تست',
      category: 1,
      address: 'آدرس تست',
    });
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('booking_slug');
  });

  it('getPublicBusiness → موفقیت', async () => {
    const result = await businessesService.getPublicBusiness('test-salon');
    expect(result.success).toBe(true);
  });
});
