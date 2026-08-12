// src/api/services/support.service.js
/**
 * 🎧 Support Service
 *
 * مدیریت پشتیبانی:
 * - سوالات متداول (FAQ)
 * - تیکت‌های پشتیبانی
 */
import apiClient from '../api-client';

export const supportService = {
  /**
   * لیست سوالات متداول
   * GET /support/faq/?category=...
   */
  getFAQ: (category = null) => {
    const params = category ? { category } : {};
    return apiClient.get('/support/faq/', { params });
  },

  /**
   * لیست تیکت‌های من
   * GET /support/tickets/
   */
  getMyTickets: () => {
    return apiClient.get('/support/tickets/');
  },

  /**
   * ایجاد تیکت جدید
   * POST /support/tickets/create/
   */
  createTicket: (data) => {
    return apiClient.post('/support/tickets/create/', data);
  },

  /**
   * جزئیات تیکت
   * GET /support/tickets/{pk}/
   */
  getTicketDetail: (ticketId) => {
    return apiClient.get(`/support/tickets/${ticketId}/`);
  },
};
