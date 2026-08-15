// src/__tests__/services/businessesService.test.js
import { businessesService } from '@/api';

jest.mock('@/api/config', () => ({
  USE_MOCK: true,
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
}));

describe('businessesService', () => {
  it('getBusinessDetail → موفقیت', async () => {
    const result = await businessesService.getBusinessDetail();
    expect(result.data).toHaveProperty('name');
    // ✅ FIX: چون response-normalizer آن را به camelCase تبدیل می‌کند
    expect(result.data).toHaveProperty('bookingSlug');
  });

  it('getBusinessStatus → موفقیت', async () => {
    const result = await businessesService.getBusinessStatus();
    // has_business تبدیل به hasBusiness می‌شود
    expect(result.data).toHaveProperty('hasBusiness');
  });

  it('createBusiness → موفقیت', async () => {
    const result = await businessesService.createBusiness({
      name: 'سالن تست',
      category: 1,
      address: 'آدرس تست',
    });
    // booking_slug تبدیل به bookingSlug می‌شود
    expect(result.data).toHaveProperty('bookingSlug');
  });

  it('getPublicBusiness → موفقیت', async () => {
    const result = await businessesService.getPublicBusiness('test-salon');
    expect(result.data).toBeDefined();
  });
});