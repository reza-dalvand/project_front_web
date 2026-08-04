'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiHeadphones,
  FiChevronDown,
  FiChevronUp,
  FiPhone,
  FiClock,
  FiLightbulb,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import { toPersianDigit } from '@/utils/numberUtils';

const SUPPORT_HOURS = 'شنبه تا پنجشنبه از ساعت ۹ الی ۱۸';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'همه', icon: '📋' },
  { id: 'booking', label: 'رزرو نوبت', icon: '📅' },
  { id: 'payment', label: 'پرداخت', icon: '💳' },
  { id: 'account', label: 'حساب کاربری', icon: '👤' },
  { id: 'business', label: 'کسب‌وکار', icon: '🏪' },
];

const FAQ_ITEMS = [
  {
    id: 1,
    categoryId: 'booking',
    question: 'چگونه می‌توانم نوبت رزرو کنم؟',
    answer:
      'برای رزرو نوبت کافیست کسب‌وکار موردنظر را انتخاب کنید، خدمت و کارمند دلخواه را مشخص کرده، تاریخ و ساعت آزاد را انتخاب کنید و در صورت نیاز بیعانه را پرداخت نمایید.',
  },
  {
    id: 2,
    categoryId: 'booking',
    question: 'آیا امکان لغو نوبت وجود دارد؟',
    answer:
      'بله، شما می‌توانید تا ۲ ساعت قبل از زمان نوبت آن را لغو کنید. در صورتی که بیعانه پرداخت کرده باشید، طبق قوانین لغو هر کسب‌وکار، درصدی به عنوان جریمه کسر و مابقی ظرف ۲۴ ساعت به حساب شما واریز می‌شود.',
  },
  {
    id: 3,
    categoryId: 'payment',
    question: 'بیعانه چیست و چگونه محاسبه می‌شود؟',
    answer:
      'بیعانه مبلغی است که برای تایید رزرو به صورت آنلاین پرداخت می‌کنید. این مبلغ توسط هر کسب‌وکار تعیین می‌شود و معمولاً بین ۲۰ تا ۴۰ درصد کل خدمت است.',
  },
  {
    id: 4,
    categoryId: 'payment',
    question: 'آیا اطلاعات کارت بانکی من امن است؟',
    answer:
      'بله، تمام پرداخت‌ها از طریق درگاه‌های معتبر بانکی (شاپرک) انجام می‌شود و اطلاعات کارت شما در سرورهای زیبانو ذخیره نمی‌شود.',
  },
  {
    id: 5,
    categoryId: 'account',
    question: 'چگونه شماره موبایل خود را تغییر دهم؟',
    answer:
      'برای تغییر شماره موبایل، به بخش «ویرایش پروفایل» مراجعه کنید و روی دکمه «تغییر شماره» کلیک نمایید.',
  },
  {
    id: 6,
    categoryId: 'business',
    question: 'چگونه کسب‌وکار خود را در زیبانو ثبت کنم؟',
    answer:
      'از تب «ثبت سالن» در نوار پایین اپلیکیشن استفاده کنید. مراحل ثبت شامل اطلاعات پایه، موقعیت مکانی، احراز هویت با کد ملی و پذیرش قوانین است.',
  },
];

function FaqItem({ item, isExpanded, onToggle, colors }) {
  return (
    <Card variant="default" padding={0} radius={14} className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3.5 text-right"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <span className="text-sm">❓</span>
        </div>
        <span
          className="text-[13px] font-[Vazir-Bold] flex-1 leading-5"
          style={{ color: colors.textMain }}
        >
          {item.question}
        </span>
        {isExpanded ? (
          <FiChevronUp size={18} style={{ color: colors.textSecondary }} />
        ) : (
          <FiChevronDown size={18} style={{ color: colors.textSecondary }} />
        )}
      </button>

      {isExpanded && (
        <div
          className="px-3.5 pb-4 pt-1 border-t"
          style={{ borderColor: colors.border }}
        >
          <p
            className="text-xs font-[Vazir] leading-6 text-justify"
            style={{ color: colors.textSecondary }}
          >
            {item.answer}
          </p>
        </div>
      )}
    </Card>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredFaqs =
    activeCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.categoryId === activeCategory);

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScreenWrapper padding={0}>
      <Header
        title="پشتیبانی و راهنما"
        onBackPress={() => router.back()}
      />

      <div className="flex-1 overflow-y-auto">
        {/* هدر رنگی */}
        <div
          className="rounded-b-3xl pb-7 px-5 pt-6"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <FiHeadphones size={40} color="#fff" />
              </div>
              <div
                className="absolute -inset-2 rounded-full border"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              />
            </div>
            <h2 className="text-xl font-[Vazir-Bold] text-white">
              پشتیبانی زیبانو
            </h2>
            <p className="text-xs font-[Vazir] text-white/85 text-center leading-5 px-4">
              تیم ما آماده پاسخگویی به سوالات و حل مشکلات شماست
            </p>
          </div>
        </div>

        <div className="px-5 pt-5 pb-10 space-y-5">
          {/* راهنمای سریع */}
          <div
            className="flex items-center gap-3 p-3.5 rounded-xl border"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '25',
            }}
          >
            <FiLightbulb size={18} style={{ color: colors.primary, flexShrink: 0 }} />
            <span
              className="text-xs font-[Vazir] leading-5 flex-1"
              style={{ color: colors.textSecondary }}
            >
              برای دریافت سریع‌تر پاسخ، ابتدا سوالات متداول را بررسی کنید
            </span>
          </div>

          {/* ساعت پاسخگویی */}
          <Card variant="default" padding={14} radius={14}>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF980020' }}
              >
                <FiClock size={18} color="#FF9800" />
              </div>
              <div className="flex-1">
                <span
                  className="text-xs font-[Vazir] block"
                  style={{ color: colors.textSecondary }}
                >
                  ساعات پاسخگویی
                </span>
                <span
                  className="text-sm font-[Vazir-Bold]"
                  style={{ color: colors.textMain }}
                >
                  {SUPPORT_HOURS}
                </span>
              </div>
            </div>
          </Card>

          {/* سوالات متداول */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-base">❓</span>
              <span
                className="text-sm font-[Vazir-Bold]"
                style={{ color: colors.textMain }}
              >
                سوالات متداول
              </span>
            </div>

            {/* فیلتر دسته‌بندی */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {FAQ_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setExpandedId(null);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: isActive ? colors.primary : colors.cardBackground,
                      borderColor: isActive ? colors.primary : colors.border,
                    }}
                  >
                    <span className="text-xs">{cat.icon}</span>
                    <span
                      className="text-xs font-[Vazir-Bold]"
                      style={{ color: isActive ? '#fff' : colors.textMain }}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* لیست سوالات */}
            <div className="space-y-2.5">
              {filteredFaqs.map((item) => (
                <FaqItem
                  key={item.id}
                  item={item}
                  isExpanded={expandedId === item.id}
                  onToggle={() => toggleFaq(item.id)}
                  colors={colors}
                />
              ))}
            </div>
          </div>

          {/* فوتر */}
          <div className="flex flex-col items-center gap-1 pt-4">
            <span
              className="text-xs font-[Vazir-Medium]"
              style={{ color: colors.textSecondary }}
            >
              زیبانو - همراه شما در مسیر زیبایی و سلامت
            </span>
            <span
              className="text-[10px] font-[Vazir]"
              style={{ color: colors.textSecondary }}
            >
              نسخه {toPersianDigit('1.0.0')}
            </span>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}