// src/config/env.js

const ENV = {
  development: {
    API_BASE_URL: 'http://127.0.0.1:8000/api/v1',
    SITE_DOMAIN: 'http://127.0.0.1:3000',
    ARVAN_CDN_URL: '',
    MEDIA_BASE_URL: 'http://127.0.0.1:8000',
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

// ─── تشخیص پلتفرم برای اندروید/امولاتور ───
const getPlatformApiUrl = (defaultUrl) => {
  if (typeof window === 'undefined') return defaultUrl;

  // اگر در محیط اندروید/امولاتور هستیم، آدرس را به‌صورت پویا تنظیم کن
  const isAndroidEmulator =
    typeof window !== 'undefined' &&
    window.location?.hostname === '10.0.2.2';

  if (isAndroidEmulator) {
    return defaultUrl.replace('127.0.0.1', '10.0.2.2');
  }

  // اگر در دستگاه واقعی هستیم و در حال توسعه هستیم، از آی‌پی شبکه استفاده کن
  // این را می‌توانید بر اساس نیاز خود تنظیم کنید
  return defaultUrl;
};

const finalConfig = {
  API_BASE_URL:
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE_URL) ||
    getPlatformApiUrl(config.API_BASE_URL),
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