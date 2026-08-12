// src/api/services/portfolios.service.js
/**
 * 📸 Portfolios Service
 *
 * مدیریت نمونه‌کارها:
 * - لیست نمونه‌کارها (عمومی)
 * - جزئیات نمونه‌کار
 * - نمونه‌کارهای کسب‌وکار من
 * - ایجاد و حذف نمونه‌کار
 */
import apiClient from '../api-client';

export const portfoliosService = {
  // ═══════════ Public ═══════════

  /**
   * لیست نمونه‌کارها
   * GET /portfolios/
   */
  getPortfolios: (params = {}) => {
    return apiClient.get('/portfolios/', { params });
  },

  /**
   * جزئیات نمونه‌کار
   * GET /portfolios/{pk}/
   */
  getPortfolioDetail: (portfolioId) => {
    return apiClient.get(`/portfolios/${portfolioId}/`);
  },

  // ═══════════ Business ═══════════

  /**
   * لیست نمونه‌کارهای کسب‌وکار من
   * GET /portfolios/my-portfolios/
   */
  getMyPortfolios: () => {
    return apiClient.get('/portfolios/my-portfolios/');
  },

  /**
   * ایجاد نمونه‌کار جدید
   * POST /portfolios/my-portfolios/create/
   */
  createPortfolio: (data) => {
    return apiClient.post('/portfolios/my-portfolios/create/', data);
  },

  /**
   * حذف نمونه‌کار
   * DELETE /portfolios/my-portfolios/{pk}/delete/
   */
  deletePortfolio: (portfolioId) => {
    return apiClient.delete(`/portfolios/my-portfolios/${portfolioId}/delete/`);
  },
};
