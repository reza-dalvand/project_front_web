import {
  buildPaginationParams,
  parsePaginationMeta,
  getPageNumbers,
  hasNextPage,
  hasPreviousPage,
  formatPaginationInfo,
} from '@/utils/pagination-utils';

describe('pagination-utils', () => {
  describe('buildPaginationParams', () => {
    it('پارامترهای صفحه‌بندی را می‌سازد', () => {
      expect(buildPaginationParams(1, 20)).toEqual({ page: 1, page_size: 20 });
    });

    it('مقادیر پیش‌فرض را برمی‌گرداند', () => {
      expect(buildPaginationParams()).toEqual({ page: 1, page_size: 20 });
    });
  });

  describe('parsePaginationMeta', () => {
    it('متادیتای صفحه‌بندی را نگاشت می‌کند', () => {
      const meta = {
        count: 100,
        total_pages: 5,
        current_page: 2,
        page_size: 20,
        next: 3,
        previous: 1,
      };
      const result = parsePaginationMeta(meta);
      expect(result.count).toBe(100);
      expect(result.totalPages).toBe(5);
      expect(result.currentPage).toBe(2);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrevious).toBe(true);
    });

    it('برای متادیتای نامعتبر، مقدار پیش‌فرض برمی‌گرداند', () => {
      const result = parsePaginationMeta(null);
      expect(result.count).toBe(0);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(false);
    });
  });

  describe('getPageNumbers', () => {
    it('برای صفحات کم، همه را برمی‌گرداند', () => {
      expect(getPageNumbers(3, 1)).toEqual([1, 2, 3]);
      expect(getPageNumbers(5, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('برای صفحات زیاد، پنجره حول صفحه فعلی برمی‌گرداند', () => {
      expect(getPageNumbers(20, 10, 5)).toEqual([8, 9, 10, 11, 12]);
      expect(getPageNumbers(20, 20, 5)).toEqual([16, 17, 18, 19, 20]);
      expect(getPageNumbers(20, 1, 5)).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('hasNextPage', () => {
    it('وجود صفحه بعد را تشخیص می‌دهد', () => {
      expect(hasNextPage({ next: 2 })).toBe(true);
      expect(hasNextPage({ next: null })).toBe(false);
      expect(hasNextPage(null)).toBe(false);
    });
  });

  describe('hasPreviousPage', () => {
    it('وجود صفحه قبل را تشخیص می‌دهد', () => {
      expect(hasPreviousPage({ previous: 1 })).toBe(true);
      expect(hasPreviousPage({ previous: null })).toBe(false);
      expect(hasPreviousPage(null)).toBe(false);
    });
  });

  describe('formatPaginationInfo', () => {
    it('متن نمایش صفحه‌بندی را می‌سازد', () => {
      expect(formatPaginationInfo(1, 20, 100)).toBe('نمایش 1 تا 20 از 100');
      expect(formatPaginationInfo(5, 20, 100)).toBe('نمایش 81 تا 100 از 100');
    });
  });
});
