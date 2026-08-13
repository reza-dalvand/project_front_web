// src/__tests__/utils/responseNormalizer.test.js
import {
  mapFields,
  normalizeSuccessResponse,
  normalizeErrorResponse,
  ApiError,
} from '@/api/response-normalizer';

describe('response-normalizer', () => {
  // ═══════ mapFields: snake_case → camelCase ═══════
  describe('mapFields', () => {
    it('تبدیل کلید‌های ساده', () => {
      const input = { first_name: 'مریم', last_name: 'حسینی' };
      const result = mapFields(input);
      expect(result.firstName).toBe('مریم');
      expect(result.lastName).toBe('حسینی');
    });

    it('تبدیل کلید‌های تودرتو', () => {
      const input = {
        user: {
          phone_display: '۰۹۱۲***۴۵۶۷',
          is_national_id_verified: true,
        },
      };
      const result = mapFields(input);
      expect(result.user.phoneDisplay).toBe('۰۹۱۲***۴۵۶۷');
      expect(result.user.isNationalIdVerified).toBe(true);
    });

    it('تبدیل آرایه‌ها', () => {
      const input = [
        { service_name: 'فیشیال', total_price: 500000 },
        { service_name: 'لیزر', total_price: 2000000 },
      ];
      const result = mapFields(input);
      expect(result[0].serviceName).toBe('فیشیال');
      expect(result[1].totalPrice).toBe(2000000);
    });

    it('فیلدهای حفظ‌شده مقدارشان تغییر نمی‌کند', () => {
      const input = { date_key: '1405/04/22', time_slot: '10:30' };
      const result = mapFields(input);
      expect(result.dateKey).toBe('1405/04/22');
      expect(result.timeSlot).toBe('10:30');
    });

    it('مقادیر null و undefined بدون تغییر', () => {
      expect(mapFields(null)).toBeNull();
      expect(mapFields(undefined)).toBeUndefined();
      expect(mapFields(42)).toBe(42);
      expect(mapFields('text')).toBe('text');
    });
  });

  // ═══════ normalizeSuccessResponse ═══════
  describe('normalizeSuccessResponse', () => {
    it('نرمال‌سازی response ساده', () => {
      const axiosResponse = {
        data: {
          success: true,
          data: { first_name: 'مریم', is_verified: true },
          message: 'موفق',
        },
      };
      const result = normalizeSuccessResponse(axiosResponse);
      expect(result.data.firstName).toBe('مریم');
      expect(result.data.isVerified).toBe(true);
      expect(result.message).toBe('موفق');
    });

    it('نرمال‌سازی response paginated', () => {
      const axiosResponse = {
        data: {
          success: true,
          pagination: {
            count: 50,
            total_pages: 3,
            current_page: 1,
            page_size: 20,
            next: 2,
            previous: null,
          },
          results: [
            { service_name: 'فیشیال', original_price: 500000 },
            { service_name: 'لیزر', original_price: 2000000 },
          ],
        },
      };
      const result = normalizeSuccessResponse(axiosResponse);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].serviceName).toBe('فیشیال');
      expect(result.meta.count).toBe(50);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNext).toBe(true);
      expect(result.meta.hasPrevious).toBe(false);
    });

    it('خطا وقتی success=false', () => {
      const axiosResponse = {
        data: {
          success: false,
          error: { code: 'NOT_FOUND', message: 'یافت نشد' },
        },
      };
      expect(() => normalizeSuccessResponse(axiosResponse)).toThrow(ApiError);
    });
  });

  // ═══════ normalizeErrorResponse ═══════
  describe('normalizeErrorResponse', () => {
    it('خطای شبکه', () => {
      const error = { message: 'Network Error' };
      const result = normalizeErrorResponse(error);
      expect(result.code).toBe('NETWORK_ERROR');
    });

    it('خطای استاندارد بک‌اند', () => {
      const error = {
        response: {
          status: 400,
          data: {
            success: false,
            error: { code: 'OTP_INVALID', message: 'کد اشتباه است' },
          },
        },
      };
      const result = normalizeErrorResponse(error);
      expect(result.code).toBe('OTP_INVALID');
      expect(result.message).toBe('کد اشتباه است');
    });

    it('خطای 401', () => {
      const error = {
        response: {
          status: 401,
          data: { detail: 'Given token not valid' },
        },
      };
      const result = normalizeErrorResponse(error);
      expect(result.code).toBe('HTTP_401');
      expect(result.message).toContain('وارد حساب');
    });
  });
});
