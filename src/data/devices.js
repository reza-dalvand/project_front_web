// src/data/devices.js
/**
 * 📱 دستگاه‌های فعال
 * استفاده شده در: profile/devices/page.jsx
 */
export const MOCK_DEVICES = [
  {
    id: 'dev_1',
    name: 'iPhone 14 Pro',
    type: 'ios',
    os: 'iOS 17.5.1',
    ip: '192.168.1.45',
    location: 'تهران، ایران',
    lastActive: 'همین الان',
    isCurrent: true,
    trusted: true,
  },
  {
    id: 'dev_2',
    name: 'Samsung Galaxy S23',
    type: 'android',
    os: 'Android 14',
    ip: '85.185.24.112',
    location: 'اصفهان، ایران',
    lastActive: '۲ ساعت پیش',
    isCurrent: false,
    trusted: true,
  },
  {
    id: 'dev_3',
    name: 'Windows 11 - Chrome',
    type: 'desktop',
    os: 'Windows 11 Pro',
    ip: '5.22.134.89',
    location: 'مشهد، ایران',
    lastActive: 'دیروز، ۲۲:۴۵',
    isCurrent: false,
    trusted: false,
  },
];