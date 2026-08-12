// src/api/services/categories.service.js
/**
 * 🏷️ Categories Service
 *
 * مدیریت دسته‌بندی‌ها:
 * - دسته‌بندی‌های خدمات
 * - دسته‌بندی‌های کسب‌وکار
 */
import apiClient from '../api-client';

export const categoriesService = {
  /**
   * لیست دسته‌بندی‌های خدمات
   * GET /categories/service-categories/
   */
  getServiceCategories: () => {
    return apiClient.get('/categories/service-categories/');
  },

  /**
   * لیست دسته‌بندی‌های کسب‌وکار
   * GET /categories/business-categories/
   */
  getBusinessCategories: () => {
    return apiClient.get('/categories/business-categories/');
  },
};
