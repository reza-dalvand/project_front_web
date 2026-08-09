'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLink, FiZap, FiShare2, FiAward } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import BookingLinkCard from '@/components/manageBusiness/bookingLink/BookingLinkCard';
import dynamic from 'next/dynamic';

const ShareBookingLinkModal = dynamic(
  () => import('@/components/manageBusiness/bookingLink/ShareBookingLinkModal'),
  { ssr: false, loading: () => null }
);
export default function BookingLinkPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const businessData = useBusinessStore((s) => s.businessData);
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const bookingLink = `https://zibano.app/book/${businessData?.id || 'biz_1'}`;

  const linkStats = {
    clicks: 245,
    bookings: 18,
    link: bookingLink,
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(bookingLink);
    showToast('لینک رزرو با موفقیت کپی شد', 'success');
  };

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="لینک اختصاصی رزرو" onBackPress={() => router.push('/manage')} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-5">
        {/* هدر توضیحی */}
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div
            className="w-[72px] h-[72px] rounded-3xl flex items-center justify-center"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <FiLink size={32} style={{ color: colors.primary }} />
          </div>
          <h2 className="text-lg font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            لینک اختصاصی شما
          </h2>
          <p className="text-xs leading-5 px-5" style={{ color: colors.textSecondary }}>
            این لینک را می‌توانید در شبکه‌های اجتماعی، بیو اینستاگرام و واتساپ خود قرار دهید
          </p>
        </div>

        {/* کارت اصلی لینک */}
        <BookingLinkCard bookingLink={linkStats} onShare={handleShare} onCopy={handleCopy} />

        {/* راهنمای استفاده */}
        <Card variant="elevated" padding={16} radius={16}>
          <div className="flex items-center gap-2 mb-4">
            <FiZap size={20} color="#FFC107" />
            <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              چگونه استفاده کنم؟
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: '📋', text: 'لینک را کپی کنید', color: colors.primary },
              { icon: '📱', text: 'در شبکه‌های اجتماعی به اشتراک بگذارید', color: '#25D366' },
              { icon: '📸', text: 'در بیو اینستاگرام قرار دهید', color: '#E1306C' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  {index + 1}
                </div>
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span
                  className="text-xs font-[Vazir] flex-1"
                  style={{ color: colors.textSecondary }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* مزایا */}
        <Card variant="elevated" padding={16} radius={16}>
          <div className="flex items-center gap-2 mb-4">
            <FiAward size={20} style={{ color: colors.primary }} />
            <h3 className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              مزایای لینک اختصاصی
            </h3>
          </div>
          <div className="space-y-2.5">
            {[
              'رزرو مستقیم بدون جستجو در اپلیکیشن',
              'افزایش اعتبار حرفه‌ای کسب‌وکار شما',
              'امکان اشتراک‌گذاری آسان در همه پلتفرم‌ها',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <span className="text-xs" style={{ color: '#4CAF50' }}>
                  ✓
                </span>
                <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* مدال اشتراک‌گذاری */}
      <ShareBookingLinkModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        bookingLink={bookingLink}
      />
    </ScreenWrapper>
  );
}
