// src/__tests__/services/profileService.test.js
import { profileService } from '@/api';

jest.mock('@/api/config', () => ({
  USE_MOCK: true,
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
}));

describe('profileService', () => {
  it('getProfile → موفقیت و داشتن فیلدهای ضروری', async () => {
    const result = await profileService.getProfile();
    // ✅ FIX: نرمال‌ساز فیلد success را حذف می‌کند و فیلدها را camelCase می‌کند
    expect(result.data).toBeDefined();
    expect(result.data).toHaveProperty('firstName');
    expect(result.data).toHaveProperty('phone');
  });

  it('requestChangePhone → موفقیت و داشتن expires_in', async () => {
    const result = await profileService.requestChangePhone('09129876543');
    expect(result.data).toBeDefined();
    expect(result.data).toHaveProperty('expiresIn'); // camelCase
  });
});
