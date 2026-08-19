// src/utils/image-compression.js
/**
 * 🖼️ فشرده‌سازی تصاویر سمت کلاینت
 *
 * مزایا:
 * - کاهش حجم آپلود برای کاربر موبایل
 * - حذف EXIF و متادیتای حساس (GPS!)
 * - کاهش فشار روی سرور و Arvan Storage
 *
 * ⚠️ این جایگزین فشرده‌سازی بک‌اند نیست — فقط مکمل آن است.
 */

// ═══════ پریست‌ها بر اساس نوع تصویر ═══════
export const COMPRESSION_PRESETS = {
  // آواتار کاربر / صاحب کسب‌وکار
  avatar: { maxWidth: 512, maxHeight: 512, quality: 0.85, targetKB: 150 },

  // کاور کسب‌وکار (عریض)
  cover: { maxWidth: 1600, maxHeight: 900, quality: 0.82, targetKB: 500 },

  // گالری کسب‌وکار
  gallery: { maxWidth: 1280, maxHeight: 1280, quality: 0.8, targetKB: 400 },

  // پست‌های ویترین / لاین / مدلینگ (اینستاگرام‌پسند)
  post: { maxWidth: 1080, maxHeight: 1350, quality: 0.82, targetKB: 450 },

  // نمونه‌کار
  portfolio: { maxWidth: 1080, maxHeight: 1080, quality: 0.8, targetKB: 400 },

  // پیش‌فرض
  default: { maxWidth: 1280, maxHeight: 1280, quality: 0.8, targetKB: 400 },
};

const MIN_QUALITY = 0.4;

/** بارگذاری تصویر از File */
const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('خطا در خواندن تصویر'));
    };
    img.src = url;
  });

/** تبدیل Canvas به Blob */
const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('خطا در تبدیل تصویر'))),
      type,
      quality
    );
  });

/**
 * 🎯 تابع اصلی: فشرده‌سازی یک تصویر
 *
 * @param {File} file - فایل ورودی کاربر
 * @param {string} preset - 'avatar' | 'cover' | 'gallery' | 'post' | 'portfolio' | 'default'
 * @returns {Promise<File>} - فایل فشرده‌شده
 */
export const compressImage = async (file, preset = 'default') => {
  const config = COMPRESSION_PRESETS[preset] || COMPRESSION_PRESETS.default;

  // اگر فایل از قبل کوچک است، دست نزن
  if (file.size <= config.targetKB * 1024) return file;

  const img = await loadImage(file);

  // ─── محاسبه ابعاد هدف (حفظ نسبت، بدون بزرگ‌نمایی) ───
  const scale = Math.min(config.maxWidth / img.width, config.maxHeight / img.height, 1);
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  // ─── رسم روی Canvas (این کار EXIF orientation را هم نرمال می‌کند) ───
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  // پس‌زمینه سفید برای PNGهایی که به JPEG تبدیل می‌شوند
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // ─── انتخاب فرمت خروجی ───
  // PNG کوچک را نگه می‌داریم؛ PNG بزرگ را به JPEG تبدیل می‌کنیم
  const keepPng = file.type === 'image/png' && file.size <= 1024 * 1024;
  const outputType = keepPng ? 'image/png' : 'image/jpeg';

  // ─── حلقه کاهش کیفیت تا رسیدن به هدف حجمی ───
  let quality = config.quality;
  let blob = await canvasToBlob(canvas, outputType, quality);

  while (blob.size > config.targetKB * 1024 && quality > MIN_QUALITY) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, outputType, quality);
  }

  // ─── ساخت File خروجی با پسوند صحیح ───
  const ext = outputType === 'image/jpeg' ? '.jpg' : '.png';
  const baseName = (file.name || 'image').replace(/\.[^.]+$/, '');

  return new File([blob], `${baseName}${ext}`, {
    type: outputType,
    lastModified: Date.now(),
  });
};

/** فشرده‌سازی چند فایل به صورت موازی */
export const compressImages = (files, preset = 'default') =>
  Promise.all(files.map((file) => compressImage(file, preset)));

/** گزارش فشرده‌سازی (برای لاگ و UX) */
export const getCompressionInfo = (original, compressed) => ({
  originalKB: Math.round(original.size / 1024),
  compressedKB: Math.round(compressed.size / 1024),
  savedPercent: Math.max(0, Math.round((1 - compressed.size / original.size) * 100)),
});
