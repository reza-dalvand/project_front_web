// src/api/services/price-list.service.js
/**
 * 🏷️ Price List Service — هماهنگ با بک‌اند
 *
 * Endpoints:
 *   GET /services/price-list/  → دریافت لیست قیمت
 *   PUT /services/price-list/  → بروزرسانی لیست قیمت
 *
 * مدل‌های بک‌اند:
 *   PriceList: business (OneToOne), theme, is_published
 *   PriceListNote: price_list (FK), label, min_value, max_value
 *
 * Serializer پاسخ:
 *   { id, theme, is_published, notes: [...], services: [...] }
 *
 * تم‌های مجاز: 'rose' | 'gold' | 'mint' | 'classic'
 */
import apiClient from '../api-client';

export const priceListService = {
  /**
   * دریافت لیست قیمت کسب‌وکار
   * GET /services/price-list/
   *
   * Response:
   * {
   *   id: number,
   *   theme: 'rose' | 'gold' | 'mint' | 'classic',
   *   is_published: boolean,
   *   notes: [{ id, label, min_value, max_value }],
   *   services: [{
   *     id, name, type_name, type_id,
   *     original_price, discount_percent, final_price,
   *     has_deposit, deposit_amount
   *   }]
   * }
   */
  getPriceList: () => {
    return apiClient.get('/services/price-list/');
  },

  /**
   * بروزرسانی لیست قیمت
   * PUT /services/price-list/
   *
   * Payload:
   * {
   *   theme?: 'rose' | 'gold' | 'mint' | 'classic',
   *   is_published?: boolean,
   *   notes?: [{ label: string, min_value: number, max_value: number }]
   * }
   *
   * ⚠️ notes آرایه کامل است — هر بار همه notes ارسال می‌شوند
   * (بک‌اند notes قبلی را حذف و جدیدها را ایجاد می‌کند)
   */
  updatePriceList: (data) => {
    return apiClient.put('/services/price-list/', data);
  },
};
