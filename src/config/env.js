// src/config/env.js
/**
 * پیکربندی محیط‌های مختلف
 *
 * ✅ فاز ۳: شفاف‌سازی اولویت‌بندی متغیرهای محیطی
 *
 * در Next.js با `output: 'export'`، مقادیر `process.env`
 * در زمان بیلد جایگزین می‌شوند.
 *
 * اولویت خواندن:
 *   ۱. متغیرهای محیطی `NEXT_PUBLIC_*` (بالاترین اولویت)
 *   ۲. مقادیر پیش‌فرض بر اساس محیط (از `ENV`)
 *
 * ⚠️ امنیت:
 *   - هرگز مقادیر حساس (کلید مخفی، رمز عبور) را در `NEXT_PUBLIC_*` قرار ندهید
 *   - متغیرهای `NEXT_PUBLIC_*` در bundle کلاینت قرار می‌گیرند
 *   - این فایل هیچ کلید مخفی ندارد
 */

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api/v1',
    SITE_DOMAIN: 'http://localhost:3000',
    ARVAN_CDN_URL: '',
    MEDIA_BASE_URL: 'http://localhost:8000',
  },
  staging: {
    API_BASE_URL: 'https://staging-api.beauclub.ir/api/v1',
    SITE_DOMAIN: 'https://staging.beauclub.ir',
    ARVAN_CDN_URL: 'https://cdn.staging.beauclub.ir',
    MEDIA_BASE_URL: 'https://staging-api.beauclub.ir',
  },
  production: {
    API_BASE_URL: 'https://api.beauclub.ir/api/v1',
    SITE_DOMAIN: 'https://beauclub.ir',
    ARVAN_CDN_URL: 'https://cdn.beauclub.ir',
    MEDIA_BASE_URL: 'https://api.beauclub.ir',
  },
};

const getNodeEnv = () => {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'development';
};

const env = getNodeEnv();
const config = ENV[env] || ENV.development;

/**
 * ✅ FIX فاز ۳: ساختار شفاف و مستند
 *
 * هر فیلد:
 *   ۱. ابتدا از `NEXT_PUBLIC_*` خوانده می‌شود
 *   ۲. اگر تعریف نشده باشد، از پیش‌فرض محیط استفاده می‌شود
 */
const finalConfig = {
  API_BASE_URL:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) ||
    config.API_BASE_URL,

  SITE_DOMAIN:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_DOMAIN) || config.SITE_DOMAIN,

  ARVAN_CDN_URL:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ARVAN_CDN_URL) ||
    config.ARVAN_CDN_URL,

  MEDIA_BASE_URL:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MEDIA_BASE_URL) ||
    config.MEDIA_BASE_URL,

  NODE_ENV: env,
};

export default finalConfig;
