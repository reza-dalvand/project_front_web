// src/utils/pagination-utils.js
/**
 * 📄 مدیریت Pagination
 *
 * فرمت بک‌اند:
 * {
 *   count: 100,
 *   total_pages: 5,
 *   current_page: 1,
 *   page_size: 20,
 *   next: 2,
 *   previous: null,
 * }
 */

/**
 * ساخت پارامترهای pagination برای درخواست API
 * @param {number} page - شماره صفحه (از ۱)
 * @param {number} pageSize - تعداد آیتم در صفحه
 * @returns {object}
 */
export const buildPaginationParams = (page = 1, pageSize = 20) => {
  return {
    page,
    page_size: pageSize,
  };
};

/**
 * پارس کردن meta از response بک‌اند
 * @param {object} meta - متادیتای pagination از بک‌اند
 * @returns {object}
 */
export const parsePaginationMeta = (meta) => {
  if (!meta) {
    return {
      count: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 20,
      hasNext: false,
      hasPrevious: false,
    };
  }

  return {
    count: meta.count || 0,
    totalPages: meta.total_pages || 0,
    currentPage: meta.current_page || 1,
    pageSize: meta.page_size || 20,
    hasNext: meta.next !== null && meta.next !== undefined,
    hasPrevious: meta.previous !== null && meta.previous !== undefined,
  };
};

/**
 * محاسبه شماره صفحات برای نمایش
 * @param {number} totalPages
 * @param {number} currentPage
 * @param {number} maxVisible - حداکثر تعداد صفحات قابل نمایش
 * @returns {number[]}
 */
export const getPageNumbers = (totalPages, currentPage, maxVisible = 5) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * آیا صفحه بعدی وجود دارد؟
 * @param {object} meta
 * @returns {boolean}
 */
export const hasNextPage = (meta) => {
  if (!meta) return false;
  return meta.next !== null && meta.next !== undefined;
};

/**
 * آیا صفحه قبلی وجود دارد؟
 * @param {object} meta
 * @returns {boolean}
 */
export const hasPreviousPage = (meta) => {
  if (!meta) return false;
  return meta.previous !== null && meta.previous !== undefined;
};

/**
 * ساخت متن "نمایش X از Y"
 * @param {number} currentPage
 * @param {number} pageSize
 * @param {number} totalCount
 * @returns {string}
 */
export const formatPaginationInfo = (currentPage, pageSize, totalCount) => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);
  return `نمایش ${start} تا ${end} از ${totalCount}`;
};
