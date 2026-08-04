'use client';
import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiClock, FiBell, FiSend, FiShield } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';

// ✅ تغییر: FiRocket → FiSend

export default function SuccessModal({
  visible,
  onClose,
  title = 'ثبت‌نام موفق',
  message = 'اطلاعات کسب‌وکار شما با موفقیت ثبت شد.',
  confirmText = 'متوجه شدم',
  emoji = '🎉',
}) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-6
        transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full max-w-md rounded-3xl p-8 flex flex-col items-center gap-4
          shadow-2xl transition-all duration-300
          ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}`}
        style={{ backgroundColor: colors.cardBackground }}
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: '#4CAF5020' }}
          />
          <div
            className="absolute -inset-2 rounded-full border"
            style={{ borderColor: '#4CAF5010' }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center relative z-10 shadow-lg"
            style={{ backgroundColor: '#4CAF50' }}
          >
            <FiCheck size={48} color="#fff" />
          </div>
          <div
            className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center
              border-[3px] shadow-md z-20"
            style={{
              backgroundColor: '#fff',
              borderColor: '#4CAF50',
            }}
          >
            <span className="text-lg">{emoji}</span>
          </div>
        </div>

        <h2
          className="text-2xl font-[Vazir-Bold] text-center"
          style={{ color: colors.textMain }}
        >
          {title}
        </h2>

        <div
          className="w-full flex items-start gap-3 p-4 rounded-2xl border"
          style={{
            backgroundColor: colors.primary + '08',
            borderColor: colors.primary + '25',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <FiBell size={18} style={{ color: colors.primary }} />
          </div>
          <p
            className="text-sm font-[Vazir] leading-6 text-right flex-1"
            style={{ color: colors.textSecondary }}
          >
            {message}
          </p>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <FiCheck size={16} style={{ color: colors.primary }} />
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              مراحل بعدی
            </span>
          </div>
          {[
            {
              icon: FiClock,
              iconColor: '#FF9800',
              title: 'بررسی توسط کارشناسان',
              description: 'فرآیند بررسی ۲۴ تا ۴۸ ساعت زمان می‌برد',
            },
            {
              icon: FiBell,
              iconColor: '#2196F3',
              title: 'اطلاع‌رسانی نتیجه',
              description: 'نتیجه از طریق پیامک و نوتیفیکیشن ارسال می‌شود',
            },
            {
              icon: FiSend,  // ✅ FiRocket به FiSend تغییر یافت
              iconColor: '#4CAF50',
              title: 'شروع فعالیت',
              description: 'پس از تایید، کسب‌وکار شما فعال می‌شود',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.iconColor + '20' }}
                >
                  <Icon size={16} color={item.iconColor} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                    {item.title}
                  </p>
                  <p className="text-xs font-[Vazir] leading-5" style={{ color: colors.textSecondary }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="w-full flex items-center gap-2 py-3 px-4 rounded-xl border"
          style={{
            backgroundColor: '#4CAF5008',
            borderColor: '#4CAF5025',
          }}
        >
          <FiShield size={16} color="#4CAF50" />
          <span
            className="text-xs font-[Vazir-Medium] flex-1 text-center"
            style={{ color: '#4CAF50' }}
          >
            اطلاعات شما محرمانه و امن نگهداری می‌شود
          </span>
        </div>

        <Button
          title={confirmText}
          onPress={onClose}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiCheck size={18} color="#fff" />}
          iconPosition="right"
        />
      </div>
    </div>
  );
}