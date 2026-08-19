// src/app/not-found.jsx
'use client';

import { useRouter } from 'next/navigation';
import { FiSearch, FiHome, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';

export default function NotFound() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 gap-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* آیکون بزرگ */}
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.primary + '15' }}
      >
        <FiSearch size={56} style={{ color: colors.primary }} />
      </div>

      {/* عنوان و توضیح */}
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-[Vazir-Bold] mb-3" style={{ color: colors.textMain }}>
          صفحه‌ای یافت نشد
        </h1>
        <p className="text-sm leading-7" style={{ color: colors.textSecondary }}>
          متأسفانه صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا حذف شده است. ممکن است آدرس اشتباه وارد
          شده باشد.
        </p>
      </div>

      {/* کد خطا */}
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        <span className="text-3xl font-[Vazir-Bold]" style={{ color: colors.primary }}>
          ۴۰۴
        </span>
        <div className="w-px h-8" style={{ backgroundColor: colors.border }} />
        <span className="text-xs" style={{ color: colors.textSecondary }}>
          خطای صفحه پیدا نشد
        </span>
      </div>

      {/* دکمه‌ها */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          title="بازگشت به خانه"
          onPress={() => router.push('/')}
          variant="primary"
          size="lg"
          className="flex-1"
          icon={<FiHome size={18} color="#fff" />}
          iconPosition="right"
        />
        <Button
          title="صفحه قبل"
          onPress={() => router.back()}
          variant="outline"
          size="lg"
          className="flex-1"
          icon={<FiArrowRight size={18} style={{ color: colors.primary }} />}
          iconPosition="right"
        />
      </div>

      {/* لینک‌های سریع */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
        {[
          { label: 'ویترین', path: '/explore' },
          { label: 'جستجو', path: '/search' },
          { label: 'پروفایل', path: '/profile' },
        ].map((link) => (
          <button
            key={link.path}
            onClick={() => router.push(link.path)}
            className="px-4 py-2 rounded-xl border text-xs font-[Vazir-Medium] transition-all hover:scale-105"
            style={{
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              color: colors.textMain,
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* فوتر */}
      <span className="text-xs mt-4" style={{ color: colors.textSecondary }}>
        بیو کلاب — رزرو آنلاین خدمات زیبایی و سلامت
      </span>
    </div>
  );
}
