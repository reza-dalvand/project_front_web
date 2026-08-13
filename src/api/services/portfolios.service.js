// src/api/services/portfolios.service.js
/**
 * 📸 Portfolios Service — هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET    /portfolios/                          → لیست نمونه‌کارها (عمومی)
 *   GET    /portfolios/{pk}/                     → جزئیات نمونه‌کار
 *   GET    /portfolios/my-portfolios/            → نمونه‌کارهای من
 *   POST   /portfolios/my-portfolios/create/     → ایجاد نمونه‌کار
 *   PUT    /portfolios/my-portfolios/{pk}/update/ → ویرایش نمونه‌کار
 *   DELETE /portfolios/my-portfolios/{pk}/delete/ → حذف نمونه‌کار
 *
 * مدل Portfolio:
 *   business, category, sub_service, title (max 100)
 *   description (max 300), cover_image
 *   images: PortfolioImage[] (max 3, image, sort_order)
 */
import apiClient from '../api-client';

export const portfoliosService = {
  /**
   * لیست نمونه‌کارها (عمومی)
   * GET /portfolios/
   *
   * Params: { business_id, category_id, page, page_size }
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

  /**
   * نمونه‌کارهای کسب‌وکار من
   * GET /portfolios/my-portfolios/
   */
  getMyPortfolios: () => {
    return apiClient.get('/portfolios/my-portfolios/');
  },

  /**
   * ایجاد نمونه‌کار جدید
   * POST /portfolios/my-portfolios/create/
   *
   * Payload (FormData):
   * {
   *   title: string,
   *   description: string,
   *   category: number,
   *   sub_service: number,
   *   cover_image: File,
   *   images: File[] (max 3)
   * }
   */
  createPortfolio: (data) => {
    if (data instanceof FormData) {
      return apiClient.upload('/portfolios/my-portfolios/create/', data);
    }
    return apiClient.post('/portfolios/my-portfolios/create/', data);
  },

  /**
   * ویرایش نمونه‌کار
   * PUT /portfolios/my-portfolios/{pk}/update/
   */
  updatePortfolio: (portfolioId, data) => {
    if (data instanceof FormData) {
      return apiClient.upload(`/portfolios/my-portfolios/${portfolioId}/update/`, data, {
        method: 'PUT',
      });
    }
    return apiClient.put(`/portfolios/my-portfolios/${portfolioId}/update/`, data);
  },

  /**
   * حذف نمونه‌کار
   * DELETE /portfolios/my-portfolios/{pk}/delete/
   */
  deletePortfolio: (portfolioId) => {
    return apiClient.delete(`/portfolios/my-portfolios/${portfolioId}/delete/`);
  },
};
