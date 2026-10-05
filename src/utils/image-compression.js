// src/utils/image-compression.js
/**
 * 🖼️ فشرده‌سازی تصاویر سمت کلاینت
 *
 * مزایا:
 * - کاهش حجم آپلود برای کاربر موبایل
 * - حذف EXIF و متادیتای حساس (GPS!)
 * - کاهش فشار روی سرور و Arvan Storage
 * - ✅ بررسی magic bytes برای جلوگیری از فایل‌های جعلی
 *
 * ⚠️ این جایگزین فشرده‌سازی بک‌اند نیست — فقط مکمل آن است.
 */

// ═══════ پریست‌ها بر اساس نوع تصویر ═══════
export const COMPRESSION_PRESETS = {
  avatar: { maxWidth: 512, maxHeight: 512, quality: 0.85, targetKB: 150 },
  cover: { maxWidth: 1600, maxHeight: 900, quality: 0.82, targetKB: 500 },
  gallery: { maxWidth: 1280, maxHeight: 1280, quality: 0.8, targetKB: 400 },
  post: { maxWidth: 1080, maxHeight: 1350, quality: 0.82, targetKB: 450 },
  portfolio: { maxWidth: 1080, maxHeight: 1080, quality: 0.8, targetKB: 400 },
  default: { maxWidth: 1280, maxHeight: 1280, quality: 0.8, targetKB: 400 },
};

const MIN_QUALITY = 0.4;

// ═══════════════════════════════════════════════════════════════
// ✅ FIX امنیت: بررسی magic bytes (امضای واقعی فایل)
// ═══════════════════════════════════════════════════════════════
const validateImageSignature = async (file) => {
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // JPEG: FF D8 FF
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
    }
    
    // PNG: 89 50 4E 47
    if (file.type === 'image/png') {
      return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
    }
    
    // WebP: RIFF....WEBP
    if (file.type === 'image/webp') {
      return (
        bytes[0] === 0x52 && // R
        bytes[1] === 0x49 && // I
        bytes[2] === 0x46 && // F
        bytes[3] === 0x46 && // F
        bytes[8] === 0x57 && // W
        bytes[9] === 0x45 && // E
        bytes[10] === 0x42 && // B
        bytes[11] === 0x50    // P
      );
    }
    
    return false;
  } catch (error) {
    console.error('Image signature validation failed:', error);
    return false;
  }
};

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

  // ✅ FIX امنیت: بررسی magic bytes قبل از پردازش
  const isValidSignature = await validateImageSignature(file);
  if (!isValidSignature) {
    throw new Error('فایل معتبر نیست. لطفاً تصویر واقعی انتخاب کنید.');
  }

  // اگر فایل از قبل کوچک است، دست نزن
  if (file.size <= config.targetKB * 1024) return file;

  const img = await loadImage(file);

  const scale = Math.min(config.maxWidth / img.width, config.maxHeight / img.height, 1);
  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const keepPng = file.type === 'image/png' && file.size <= 1024 * 1024;
  const outputType = keepPng ? 'image/png' : 'image/jpeg';

  let quality = config.quality;
  let blob = await canvasToBlob(canvas, outputType, quality);

  while (blob.size > config.targetKB * 1024 && quality > MIN_QUALITY) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, outputType, quality);
  }

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