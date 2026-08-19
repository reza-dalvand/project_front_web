// src/config/env.js
/**
 * پیکربندی محیط‌های مختلف
 */
const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api/v1',
    SITE_DOMAIN: 'http://localhost:3000',
    ARVAN_CDN_URL: '',
    MEDIA_BASE_URL: 'http://localhost:8000', // ← جدید
  },
  staging: {
    API_BASE_URL: 'https://staging-api.beau.app/api/v1',
    SITE_DOMAIN: 'https://staging.beau.app',
    ARVAN_CDN_URL: 'https://cdn.staging.beau.app',
    MEDIA_BASE_URL: 'https://staging-api.beau.app',
  },
  production: {
    API_BASE_URL: 'https://api.beau.app/api/v1',
    SITE_DOMAIN: 'https://beau.app',
    ARVAN_CDN_URL: 'https://cdn.beau.app',
    MEDIA_BASE_URL: 'https://api.beau.app',
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
