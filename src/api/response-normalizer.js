// src/api/response-normalizer.js
/**
 * 🔄 تبدیل فرمت Response بک‌اند به فرمت مورد نیاز فرانت
 *
 * فرمت بک‌اند (موفق):
 * { success: true, data: {...}, message: '...', meta: {...} }
 *
 * فرمت بک‌اند (خطا):
 * { success: false, error: { code: '...', message: '...', details: {...} } }
 *
 * فرمت فرانت (موفق):
 * { data: {...}, meta: {...}, message: '...' }
 *
 * فرمت فرانت (خطا):
 * throw new ApiError({ code, message, details })
 */

// ═══════════════════════════════════════════════
//    کلاس خطای API
// ═══════════════════════════════════════════════
export class ApiError extends Error {
  constructor({ code = 'UNKNOWN_ERROR', message = 'خطای ناشناخته', details = {} }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.isApiError = true;
  }
}

// ═══════════════════════════════════════════════
//    نرمال‌سازی Response موفق
// ═══════════════════════════════════════════════
export const normalizeSuccessResponse = (axiosResponse) => {
  const { success, data, message, meta } = axiosResponse.data;

  if (!success) {
    // اگر success=false بود ولی status=200، خطا محسوب می‌شود
    throw new ApiError({
      code: 'UNEXPECTED_ERROR',
      message: message || 'خطای غیرمنتظره',
      details: data || {},
    });
  }

  return {
    data,
    meta,
    message,
  };
};

// ═══════════════════════════════════════════════
//    نرمال‌سازی خطای Axios
// ═══════════════════════════════════════════════
export const normalizeErrorResponse = (axiosError) => {
  // خطای شبکه (بدون response)
  if (!axiosError.response) {
    return new ApiError({
      code: 'NETWORK_ERROR',
      message: 'خطا در اتصال به سرور. لطفاً اینترنت خود را بررسی کنید.',
      details: { originalError: axiosError.message },
    });
  }

  const { status, data } = axiosError.response;
  const apiError = data?.error;

  // فرمت استاندارد خطای بک‌اند
  if (apiError) {
    return new ApiError({
      code: apiError.code || 'ERROR',
      message: apiError.message || 'خطا در انجام عملیات',
      details: apiError.details || {},
    });
  }

  // فرمت خطای DRF (ValidationError)
  if (status === 400 && data) {
    const messages = Object.entries(data)
      .map(([field, errors]) => {
        const errorText = Array.isArray(errors) ? errors.join('، ') : errors;
        return `${field}: ${errorText}`;
      })
      .join('\n');

    return new ApiError({
      code: 'VALIDATION_ERROR',
      message: messages || 'داده‌های ورودی معتبر نیست',
      details: data,
    });
  }

  // خطاهای HTTP عمومی
  const httpErrorMessages = {
    400: 'درخواست نامعتبر',
    401: 'لطفاً وارد حساب کاربری خود شوید',
    403: 'شما دسترسی لازم برای این عملیات را ندارید',
    404: 'منبع مورد نظر یافت نشد',
    405: 'روش درخواست پشتیبانی نمی‌شود',
    429: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.',
    500: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.',
    502: 'سرور در دسترس نیست',
    503: 'سرویس موقتاً در دسترس نیست',
  };

  return new ApiError({
    code: `HTTP_${status}`,
    message: httpErrorMessages[status] || `خطا (${status})`,
    details: { status, data },
  });
};
