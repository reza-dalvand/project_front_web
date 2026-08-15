// src/__tests__/services/searchService.test.js
import { searchService } from '@/api';

jest.mock('@/api/config', () => ({
  USE_MOCK: true,
  API_CONFIG: { baseURL: 'http://localhost:8000/api/v1', timeout: 15000 },
}));

describe('searchService', () => {
  it('search → موفقیت و ساختار صحیح (businesses و services)', async () => {
    const result = await searchService.search('فیشیال', 'all', 10);
    // ✅ FIX: بررسی ساختار نرمال‌سازی شده
    expect(result.data).toBeDefined();
    expect(result.data).toHaveProperty('businesses');
    expect(result.data).toHaveProperty('services');
    expect(Array.isArray(result.data.businesses)).toBe(true);
  });

  it('getSuggestions → لیست پیشنهادات (آرایه)', async () => {
    const result = await searchService.getSuggestions('ف');
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
  });
});