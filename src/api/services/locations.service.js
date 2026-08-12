// src/api/services/locations.service.js
/**
 * 📍 Locations Service
 *
 * مدیریت استان‌ها و شهرها:
 * - لیست استان‌ها
 * - لیست شهرهای یک استان
 */
import apiClient from '../api-client';

export const locationsService = {
  /**
   * لیست استان‌ها
   * GET /locations/provinces/
   */
  getProvinces: () => {
    return apiClient.get('/locations/provinces/');
  },

  /**
   * لیست شهرهای یک استان
   * GET /locations/provinces/{province_id}/cities/
   */
  getCities: (provinceId) => {
    return apiClient.get(`/locations/provinces/${provinceId}/cities/`);
  },
};
