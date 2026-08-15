// src/__tests__/stores/useApiCacheStore.test.js
import { useApiCacheStore } from '@/stores/useApiCacheStore';
import { act } from '@testing-library/react';

describe('useApiCacheStore', () => {
  beforeEach(() => {
    act(() => {
      useApiCacheStore.getState().clearCache();
    });
  });

  it('ذخیره و دریافت از کش', () => {
    act(() => {
      useApiCacheStore.getState().setCache('test_key', { id: 1, name: 'Test' }, 60000);
    });
    const data = useApiCacheStore.getState().getCache('test_key');
    expect(data).toEqual({ id: 1, name: 'Test' });
  });

  it('انقضای کش (TTL) با استفاده از Fake Timers', () => {
    jest.useFakeTimers();
    act(() => {
      useApiCacheStore.getState().setCache('short_lived', 'data', 1000); // ۱ ثانیه
    });
    
    expect(useApiCacheStore.getState().getCache('short_lived')).toBe('data');
    
    jest.advanceTimersByTime(1500); // ۱.۵ ثانیه بعد
    
    expect(useApiCacheStore.getState().getCache('short_lived')).toBeNull();
    jest.useRealTimers();
  });

  it('حذف بر اساس پیشوند (invalidateCacheByPrefix)', () => {
    act(() => {
      useApiCacheStore.getState().setCache('user_1', 'A');
      useApiCacheStore.getState().setCache('user_2', 'B');
      useApiCacheStore.getState().setCache('post_1', 'C');
      useApiCacheStore.getState().invalidateCacheByPrefix('user_');
    });
    expect(useApiCacheStore.getState().hasCache('user_1')).toBe(false);
    expect(useApiCacheStore.getState().hasCache('post_1')).toBe(true);
  });
});