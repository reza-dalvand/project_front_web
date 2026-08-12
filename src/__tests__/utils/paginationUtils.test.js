// src/__tests__/utils/paginationUtils.test.js
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
    it('ساخت پارامترهای پیش‌فرض', () => {
      expect(buildPaginationParams()).toEqual({ page: 1, page_size: 20 });
    });

    it('ساخت پارامترهای سفارشی', () => {
      expect(buildPaginationParams(3, 10)).toEqual({ page: 3, page_size: 10 });
    });
  });

  describe('parsePaginationMeta', () => {
    it('پارس متای بک‌اند', () => {
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

    it('متای null', () => {
      const result = parsePaginationMeta(null);
      expect(result.count).toBe(0);
      expect(result.hasNext).toBe(false);
    });
  });

  describe('getPageNumbers', () => {
    it('صفحات کم', () => {
      expect(getPageNumbers(3, 1)).toEqual([1, 2, 3]);
    });

    it('صفحات زیاد - وسط', () => {
      const pages = getPageNumbers(20, 10, 5);
      expect(pages).toHaveLength(5);
      expect(pages).toContain(10);
    });
  });

  describe('hasNextPage / hasPreviousPage', () => {
    it('تشخیص صفحه بعدی/قبلی', () => {
      expect(hasNextPage({ next: 2 })).toBe(true);
      expect(hasNextPage({ next: null })).toBe(false);
      expect(hasPreviousPage({ previous: 1 })).toBe(true);
      expect(hasPreviousPage({ previous: null })).toBe(false);
    });
  });
});
