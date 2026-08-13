// src/api/services/support.service.js
/**
 * 🎧 Support Service — هماهنگ کامل با بک‌اند
 *
 * Endpoints:
 *   GET  /support/faq/              → سوالات متداول
 *   GET  /support/tickets/          → لیست تیکت‌های من
 *   POST /support/tickets/create/   → ایجاد تیکت جدید
 *   GET  /support/tickets/{pk}/     → جزئیات تیکت
 *
 * مدل SupportTicket بک‌اند:
 *   status: open | in_progress | resolved | closed
 *   priority: low | medium | high | urgent
 *   response: پاسخ پشتیبانی
 *   responded_at: زمان پاسخ
 */
import apiClient from '../api-client';

export const supportService = {
  /**
   * لیست سوالات متداول
   * GET /support/faq/?category=
   *
   * @param {string} category - دسته‌بندی (اختیاری)
   *
   * Response: FAQSerializer[]
   *   { id, question, answer, category, sort_order }
   */
  getFAQ: (category = null) => {
    const params = category ? { category } : {};
    return apiClient.get('/support/faq/', { params });
  },

  /**
   * لیست تیکت‌های پشتیبانی من
   * GET /support/tickets/
   *
   * Response: SupportTicketListSerializer[]
   *   { id, subject, message, status, status_display,
   *     priority, priority_display, response, responded_at, created_at }
   */
  getMyTickets: () => {
    return apiClient.get('/support/tickets/');
  },

  /**
   * ایجاد تیکت جدید
   * POST /support/tickets/create/
   *
   * Payload:
   * {
   *   subject: string,     // max 200
   *   message: string,
   *   priority: 'low' | 'medium' | 'high' | 'urgent'
   * }
   *
   * Response: SupportTicketDetailSerializer
   */
  createTicket: (data) => {
    return apiClient.post('/support/tickets/create/', data);
  },

  /**
   * جزئیات تیکت
   * GET /support/tickets/{pk}/
   *
   * Response: SupportTicketDetailSerializer
   *   { id, subject, message, status, status_display,
   *     priority, priority_display, response, responded_at, created_at }
   */
  getTicketDetail: (ticketId) => {
    return apiClient.get(`/support/tickets/${ticketId}/`);
  },
};
