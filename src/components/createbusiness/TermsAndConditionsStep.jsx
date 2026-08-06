'use client';

import { useState } from 'react';
import { FiShield, FiClock, FiLock, FiTrendingUp, FiCheck, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const TERMS_SECTIONS = [
  {
    icon: FiShield,
    iconColor: '#4CAF50',
    title: 'احراز هویت الزامی',
    description:
      'برای جلوگیری از سوءاستفاده، کد ملی شما با شماره ثبت‌نام‌شده تطبیق داده می‌شود. این اطلاعات محرمانه باقی می‌ماند.',
  },
  {
    icon: FiClock,
    iconColor: '#FF9800',
    title: 'تعهد به کیفیت خدمات',
    description:
      'کسب‌وکار شما متعهد به ارائه خدمات با کیفیت و مطابق با توضیحات ثبت‌شده است. شکایات مشتریان به صورت جدی پیگیری می‌شود.',
  },
  {
    icon: FiLock,
    iconColor: '#2196F3',
    title: 'حفاظت از اطلاعات',
    description:
      'اطلاعات شخصی مشتریان رمزنگاری شده و هرگز در اختیار شخص ثالث قرار نمی‌گیرد. شما نیز موظف به حفظ محرمانگی هستید.',
  },
  {
    icon: FiTrendingUp,
    iconColor: '#FFC107',
    title: 'تبلیغات و سرویس‌های ویژه',
    description:
      'امکان خرید سرویس‌های ویژه مانند تبلیغات در صفحه اصلی، نمایش برتر و پیامک‌های انبوه برای شما فراهم است.',
  },
];

export default function TermsAndConditionsStep({ onAccept, onDecline }) {
  const { colors } = useTheme();
  const [accepted, setAccepted] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = (scrollTop + clientHeight) / scrollHeight;
    setScrollProgress(Math.min(progress, 1));

    // تشخیص رسیدن به انتهای صفحه
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    if (distanceFromBottom <= 150 && !scrolledToBottom) {
      setScrolledToBottom(true);
    }
  };

  const canProceed = accepted && scrolledToBottom;

  return (
    <div className="flex flex-col h-full">
      {/* هدر لوکس */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <FiShield size={32} color="#fff" />
          </div>
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: colors.primary + '40' }}
          />
          <div
            className="absolute -inset-2 rounded-full border"
            style={{ borderColor: colors.primary + '20' }}
          />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
            قوانین و مقررات
          </h2>
          <p className="text-xs font-[Vazir] px-8" style={{ color: colors.textSecondary }}>
            لطفاً قبل از شروع، قوانین زیبانو را مطالعه بفرمایید
          </p>
        </div>
      </div>

      {/* نوار پیشرفت اسکرول */}
      <div
        className="h-1.5 mx-5 rounded-full overflow-hidden mb-4"
        style={{ backgroundColor: colors.border }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${scrollProgress * 100}%`,
            backgroundColor: scrolledToBottom ? '#4CAF50' : colors.primary,
          }}
        />
      </div>

      {/* محتوای اسکرولی */}
      <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4" onScroll={handleScroll}>
        {TERMS_SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} variant="default" padding={14} radius={14}>
              <div className="flex gap-3 items-start">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: section.iconColor + '15' }}
                >
                  <Icon size={18} color={section.iconColor} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
                    {section.title}
                  </h3>
                  <p
                    className="text-xs font-[Vazir] leading-5 text-justify"
                    style={{ color: colors.textSecondary }}
                  >
                    {section.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}

        {/* پیام پایان اسکرول */}
        {scrolledToBottom ? (
          <div
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border"
            style={{
              backgroundColor: '#4CAF5015',
              borderColor: '#4CAF5040',
            }}
          >
            <FiCheck size={18} color="#4CAF50" />
            <span className="text-sm font-[Vazir-Bold]" style={{ color: '#4CAF50' }}>
              تمام قوانین را مطالعه کردید
            </span>
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-2 py-3 rounded-xl animate-pulse"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <FiChevronDown size={16} style={{ color: colors.primary }} />
            <span className="text-xs font-[Vazir-Medium]" style={{ color: colors.primary }}>
              برای مشاهده همه قوانین، صفحه را به پایین بکشید
            </span>
          </div>
        )}
      </div>

      {/* فوتر */}
      <div className="px-5 pt-4 pb-6 space-y-3">
        {/* چک‌باکس قوانین */}
        <button
          onClick={() => setAccepted(!accepted)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-right transition-all"
          style={{
            backgroundColor: accepted ? colors.primary + '15' : colors.cardBackground,
            borderColor: accepted ? colors.primary : colors.border,
          }}
        >
          <div
            className="w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              backgroundColor: accepted ? colors.primary : 'transparent',
              borderColor: accepted ? colors.primary : colors.border,
            }}
          >
            {accepted && <FiCheck size={16} color="#fff" />}
          </div>
          <span
            className="text-sm font-[Vazir] leading-6 flex-1"
            style={{ color: colors.textMain }}
          >
            تمامی قوانین و مقررات فوق را{' '}
            <span className="font-[Vazir-Bold]" style={{ color: colors.primary }}>
              مطالعه کرده و می‌پذیرم.
            </span>
          </span>
        </button>

        {/* دکمه‌ها */}
        <div className="flex gap-3">
          <Button
            title="انصراف"
            onPress={onDecline}
            variant="outline"
            size="lg"
            className="flex-1"
          />
          <Button
            title="ثبت کسب و کار"
            onPress={onAccept}
            variant="primary"
            size="lg"
            disabled={!canProceed}
            className="flex-1"
            icon={<FiCheck size={18} color="#fff" />}
            iconPosition="right"
          />
        </div>

        {/* پیام راهنما */}
        {!canProceed && (
          <p className="text-xs font-[Vazir] text-center" style={{ color: colors.textSecondary }}>
            {!scrolledToBottom
              ? `📖 ${Math.round(scrollProgress * 100)}٪ مطالعه شده - ادامه دهید`
              : '☑️ برای ادامه، قوانین را بپذیرید'}
          </p>
        )}
      </div>
    </div>
  );
}
