// src/components/profile/support/constants.js
/**
* ✅ فاز ۴: FAQ_ITEMS و FAQ_CATEGORIES حذف شدند
*
* به جای این ثابت‌ها، از بک‌اند استفاده کنید:
* - supportService.getFAQ() برای لیست سوالات
*
* فیلتر دسته‌بندی FAQ هم از بک‌اند می‌آید.
*/
export const SUPPORT_PHONE = '09121234567';
export const SUPPORT_PHONE_DISPLAY = '۰۲۱-۹۱۰۰۱۲۳۴';
export const SUPPORT_EMAIL = 'support@beauclub.ir';
export const SUPPORT_HOURS_SIMPLE = 'شنبه تا پنجشنبه از ساعت ۹ الی ۱۸';

export const SUPPORT_CHANNELS = [
  {
    id: 'telegram',
    title: 'تلگرام',
    subtitle: 'کانال رسمی پشتیبانی',
    description: 'ارسال پیام و تصویر',
    icon: 'send',
    color: '#0088cc',
    actionLabel: 'پیام در تلگرام',
    link: 'https://t.me/bu_support',
    badge: null,
  },
  {
    id: 'whatsapp',
    title: 'واتساپ',
    subtitle: 'پشتیبانی بین‌المللی',
    description: 'پاسخگویی ۲۴ ساعته',
    icon: 'message-square',
    color: '#25D366',
    actionLabel: 'پیام در واتساپ',
    link: 'https://wa.me/989123456789?text=سلام، نیاز به پشتیبانی دارم',
    badge: null,
  },
];