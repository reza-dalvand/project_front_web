// src/config/env.js
/**
 * پیکربندی محیط‌های مختلف
 * در production از متغیرهای Next.js خوانده می‌شود
 * در development مقادیر پیش‌فرض استفاده می‌شود
 */

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api/v1',
    SITE_DOMAIN: 'http://localhost:3000',
    ARVAN_CDN_URL: '',
  },
  staging: {
    API_BASE_URL: 'https://staging-api.zibano.app/api/v1',
    SITE_DOMAIN: 'https://staging.zibano.app',
    ARVAN_CDN_URL: 'https://cdn.staging.zibano.app',
  },
  production: {
    API_BASE_URL: 'https://api.zibano.app/api/v1',
    SITE_DOMAIN: 'https://zibano.app',
    ARVAN_CDN_URL: 'https://cdn.zibano.app',
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

// Override با متغیرهای محیطی Next.js (اگر تنظیم شده باشند)
const finalConfig = {
  API_BASE_URL:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) ||
    config.API_BASE_URL,
  SITE_DOMAIN:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_DOMAIN) || config.SITE_DOMAIN,
  ARVAN_CDN_URL:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ARVAN_CDN_URL) ||
    config.ARVAN_CDN_URL,
  NODE_ENV: env,
};

export default finalConfig;
