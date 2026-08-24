import { useApiCacheStore } from '@/stores/useApiCacheStore';

describe('useApiCacheStore', () => {
  beforeEach(() => {
    useApiCacheStore.getState().clearCache();
  });

  describe('setCache / getCache', () => {
    it('داده را ذخیره و بازیابی می‌کند', () => {
      useApiCacheStore.getState().setCache('key1', { data: 1 }, 60000);
      expect(useApiCacheStore.getState().getCache('key1')).toEqual({ data: 1 });
    });

    it('برای کلید ناموجود، خالی برمی‌گرداند', () => {
      expect(useApiCacheStore.getState().getCache('nonexistent')).toBeNull();
    });

    it('برای کش منقضی‌شده، خالی برمی‌گرداند', () => {
      useApiCacheStore.getState().setCache('key1', { data: 1 }, -1000);
      expect(useApiCacheStore.getState().getCache('key1')).toBeNull();
    });
  });

  describe('hasCache', () => {
    it('وجود کلید را بررسی می‌کند', () => {
      useApiCacheStore.getState().setCache('key1', 'data', 60000);
      expect(useApiCacheStore.getState().hasCache('key1')).toBe(true);
      expect(useApiCacheStore.getState().hasCache('missing')).toBe(false);
    });
  });

  describe('invalidateCache', () => {
    it('یک کلید را حذف می‌کند', () => {
      useApiCacheStore.getState().setCache('key1', 'data', 60000);
      useApiCacheStore.getState().invalidateCache('key1');
      expect(useApiCacheStore.getState().getCache('key1')).toBeNull();
    });
  });

  describe('invalidateCacheByPrefix', () => {
    it('کلیدهای با پیشوند مشخص را حذف می‌کند', () => {
      useApiCacheStore.getState().setCache('appointments_1', 'a', 60000);
      useApiCacheStore.getState().setCache('services_1', 's', 60000);
      useApiCacheStore.getState().invalidateCacheByPrefix('appointments_');
      expect(useApiCacheStore.getState().getCache('appointments_1')).toBeNull();
      expect(useApiCacheStore.getState().getCache('services_1')).toBe('s');
    });
  });

  describe('clearCache', () => {
    it('کل کش را پاک می‌کند', () => {
      useApiCacheStore.getState().setCache('a', 1, 60000);
      useApiCacheStore.getState().setCache('b', 2, 60000);
      useApiCacheStore.getState().clearCache();
      expect(useApiCacheStore.getState().getCache('a')).toBeNull();
      expect(useApiCacheStore.getState().getCache('b')).toBeNull();
    });
  });
});
