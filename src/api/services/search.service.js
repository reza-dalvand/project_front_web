// src/api/services/search.service.js
/**
 * 🔍 Search Service
 *
 * جستجوی یکپارچه:
 * - جستجوی کلی
 * - پیشنهادات جستجو (Autocomplete)
 */
import apiClient from '../api-client';

export const searchService = {
  /**
   * جستجوی کلی
   * GET /search/?query=...&category=all|businesses|services
   */
  search: (query, category = 'all', limit = 10) => {
    return apiClient.get('/search/', {
      params: { query, category, limit },
    });
  },

  /**
   * پیشنهادات جستجو (Autocomplete)
   * GET /search/suggestions/?q=...
   */
  getSuggestions: (query) => {
    return apiClient.get('/search/suggestions/', { params: { q: query } });
  },
};
