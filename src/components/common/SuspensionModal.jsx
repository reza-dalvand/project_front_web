'use client';

import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiX, FiMessageCircle, FiSend, FiLogOut } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/stores/useThemeStore';

/**
 * مدال تعلیق کاربر — غیرقابل بستن
 * کاربر تعلیق‌شده فقط این مدال را می‌بیند
 */
export default function SuspensionModal() {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isSuspended = useAuthStore((s) => s.isSuspended);
  const suspensionReason = useAuthStore((s) => s.suspensionReason);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setMounted(true);
  }, []);

  // قفل اسکرول وقتی مدال باز است
  useEffect(() => {
    if (isSuspended) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isSuspended]);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `سلام، حساب کاربری من تعلیق شده است.\nدلیل: ${suspensionReason}\nلطفاً راهنمایی کنید.`
    );
    window.open(`https://wa.me/989120000000?text=${message}`, '_blank'); // شماره پشتیبانی
  };

  const handleTelegram = () => {
    window.open('https://t.me/beauclub_support', '_blank'); // آیدی تلگرام پشتیبانی
  };

  const handleSupportTicket = () => {
    // TODO: ریدایرکت به صفحه ارسال تیکت
    window.location.href = '/support/new-ticket';
  };

  const handleLogout = async () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟')) {
      await logout();
      window.location.href = '/auth/login';
    }
  };

  if (!mounted || !isSuspended) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: colors.cardBackground }}
      >
        {/* Header با رنگ قرمز */}
        <div
          className="p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <FiAlertTriangle size={40} color="white" />
          </div>
          <h2 className="text-xl font-[Vazir-Bold] text-white mb-2">
            حساب کاربری شما تعلیق شده است
          </h2>
          <p className="text-white/90 text-sm font-[Vazir]">
            به دلیل نقض قوانین، دسترسی شما موقتاً محدود شده است
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* دلیل تعلیق */}
          {suspensionReason && (
            <div
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: '#FFF3E0',
                border: '1px solid #FFB74D',
              }}
            >
              <div className="flex items-start gap-2">
                <FiAlertTriangle
                  size={18}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: '#F57C00' }}
                />
                <div>
                  <p
                    className="text-xs font-[Vazir-Bold] mb-1"
                    style={{ color: '#E65100' }}
                  >
                    دلیل تعلیق:
                  </p>
                  <p
                    className="text-sm font-[Vazir] leading-6"
                    style={{ color: '#BF360C' }}
                  >
                    {suspensionReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p
            className="text-sm text-center mb-6 font-[Vazir] leading-6"
            style={{ color: colors.textSecondary }}
          >
            برای رفع تعلیق و بازگرداندن دسترسی کامل، می‌توانید از راه‌های زیر با
            پشتیبانی در ارتباط باشید:
          </p>

          {/* دکمه‌های تماس */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-[Vazir-Bold] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#25D366' }}
            >
              <FaWhatsapp size={22} />
              <span>چت در واتساپ</span>
            </button>

            <button
              onClick={handleTelegram}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-[Vazir-Bold] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: '#0088CC' }}
            >
              <FaTelegram size={22} />
              <span>پیام در تلگرام</span>
            </button>

            <button
              onClick={handleSupportTicket}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-[Vazir-Bold] transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: colors.primary + '15',
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
              }}
            >
              <FiSend size={18} />
              <span>ارسال تیکت پشتیبانی</span>
            </button>
          </div>

          {/* دکمه خروج */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl font-[Vazir] text-sm transition-all hover:bg-red-50"
            style={{ color: '#E53935' }}
          >
            <FiLogOut size={16} />
            <span>خروج از حساب کاربری</span>
          </button>
        </div>
      </div>
    </div>
  );
}