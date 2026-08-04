'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiGift, FiShare2, FiCopy, FiCheck, FiUserPlus, FiAward } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { toPersianDigit } from '@/utils/numberUtils';
import { useToast } from '@/hooks/useToast';

export default function InviteFriendsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralCode = 'ZIBANO-' + (user?.phone?.slice(-4) || '0000');
  const referralLink = `https://zibano.app/invite/${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      showToast('کد معرف کپی شد', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('امکان کپی وجود ندارد', 'error');
    }
  };

  const handleShare = async () => {
    const message = `🌸 با اپلیکیشن زیبانو، خدمات زیبایی و سلامت رو آنلاین رزرو کن!
✨ با کد معرف من ثبت‌نام کن: ${referralCode}
📱 لینک دانلود: ${referralLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'زیبانو',
          text: message,
          url: referralLink,
        });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(message);
        showToast('لینک دعوت کپی شد', 'success');
      } catch {
        showToast('امکان اشتراک‌گذاری وجود ندارد', 'error');
      }
    }
  };

  const steps = [
    {
      icon: <FiShare2 size={16} />,
      text: 'کد معرف یا لینک دعوت را با دوستانتان به اشتراک بگذارید',
    },
    {
      icon: <FiUserPlus size={16} />,
      text: 'دوست شما با کد شما در زیبانو ثبت‌نام می‌کند',
    },
    {
      icon: <FiAward size={16} />,
      text: 'همراه با دوستانتان از خدمات زیبانو لذت ببرید',
    },
  ];

  return (
    <ScreenWrapper padding={0}>
      <Header
        title="دعوت از دوستان"
        onBackPress={() => router.back()}
      />

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-10 space-y-6">
        {/* Hero */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiGift size={48} style={{ color: colors.primary }} />
          </div>
          <div className="text-center">
            <h3
              className="text-xl font-[Vazir-Bold] mb-2"
              style={{ color: colors.textMain }}
            >
              دوستان خود را دعوت کنید
            </h3>
            <p
              className="text-sm leading-6 px-4"
              style={{ color: colors.textSecondary }}
            >
              زیبانو را به دوستانتان معرفی کنید و همراه با آن‌ها از خدمات زیبایی لذت ببرید
            </p>
          </div>
        </div>

        {/* کد معرف */}
        <Card variant="elevated" padding={20} radius={20}>
          <div className="flex flex-col items-center gap-4">
            <span
              className="text-sm font-[Vazir]"
              style={{ color: colors.textSecondary }}
            >
              کد معرف شما
            </span>

            <div
              className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl border-2 border-dashed"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.primary + '40',
              }}
            >
              <span
                className="text-xl font-[Vazir-Bold] tracking-wider flex-1"
                style={{ color: colors.primary }}
              >
                {referralCode}
              </span>
              <button
                onClick={handleCopy}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: colors.primary }}
              >
                {copied ? (
                  <FiCheck size={16} color="#fff" />
                ) : (
                  <FiCopy size={16} color="#fff" />
                )}
              </button>
            </div>

            <span
              className="text-xs font-[Vazir] text-center"
              style={{ color: colors.textSecondary }}
            >
              {copied
                ? '✓ برای کپی، یکی از گزینه‌های اشتراک‌گذاری را انتخاب کنید'
                : 'این کد را با دوستانتان به اشتراک بگذارید'}
            </span>
          </div>
        </Card>

        {/* لینک دعوت */}
        <Card variant="elevated" padding={16} radius={16}>
          <div className="flex items-center gap-3">
            <span className="text-lg flex-shrink-0">🔗</span>
            <div className="flex-1">
              <span
                className="text-xs font-[Vazir] block"
                style={{ color: colors.textSecondary }}
              >
                لینک دعوت
              </span>
              <span
                className="text-sm font-[Vazir-Medium] line-clamp-1"
                style={{ color: colors.textMain }}
              >
                {referralLink}
              </span>
            </div>
          </div>
        </Card>

        {/* مراحل دعوت */}
        <div>
          <h3
            className="text-base font-[Vazir-Bold] mb-4"
            style={{ color: colors.textMain }}
          >
            چگونه دعوت کنم؟
          </h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  <span className="text-white">{step.icon}</span>
                </div>
                <span
                  className="text-sm font-[Vazir] leading-5 flex-1"
                  style={{ color: colors.textMain }}
                >
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* دکمه اشتراک‌گذاری */}
        <Button
          title="اشتراک‌گذاری با دوستان"
          onPress={handleShare}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiShare2 size={18} color="#fff" />}
          iconPosition="right"
        />
      </div>
    </ScreenWrapper>
  );
}