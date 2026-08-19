'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCopy, FiLink, FiCheck, FiShare2 } from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function ShareBookingLinkModal({ visible, onClose, bookingLink }) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const instanceId = useRef('share-booking-modal');

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setCopied(false);
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = bookingLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(`🌸 نوبت‌دهی آنلاین\n${bookingLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleShareTelegram = () => {
    const msg = encodeURIComponent(`🌸 نوبت‌دهی آنلاین\n${bookingLink}`);
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(bookingLink)}&text=${msg}`,
      '_blank'
    );
  };

  const handleShareInstagram = () => {
    navigator.clipboard?.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'نوبت‌دهی آنلاین بیو کلاب',
          text: `🌸 نوبت‌دهی آنلاین\n${bookingLink}`,
          url: bookingLink,
        });
      } catch {
        /* cancelled */
      }
    } else {
      handleCopy();
    }
  };

  if (!mounted || !visible) return null;

  const shareOptions = [
    {
      id: 'whatsapp',
      label: 'واتساپ',
      subtitle: 'ارسال در چت واتساپ',
      icon: FaWhatsapp,
      color: '#25D366',
      onClick: handleShareWhatsApp,
    },
    {
      id: 'instagram',
      label: 'اینستاگرام',
      subtitle: 'کپی برای بیو یا استوری',
      icon: FaInstagram,
      color: '#E1306C',
      onClick: handleShareInstagram,
    },
    {
      id: 'telegram',
      label: 'تلگرام',
      subtitle: 'ارسال در چت تلگرام',
      icon: FaTelegramPlane,
      color: '#0088cc',
      onClick: handleShareTelegram,
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-11 h-11 rounded-[14px] flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiShare2 size={22} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                اشتراک‌گذاری لینک رزرو
              </h3>
              <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                لینک خود را در شبکه‌های اجتماعی به اشتراک بگذارید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوای اسکرولی */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* باکس لینک */}
          <div
            className="flex items-center gap-3 p-4 rounded-2xl border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.primary + '40',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiLink size={18} style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-[Vazir]" style={{ color: colors.textSecondary }}>
                لینک اختصاصی شما
              </p>
              <p
                className="text-[13px] font-[Vazir-Bold] truncate mt-1"
                style={{ color: colors.textMain, direction: 'ltr', textAlign: 'right' }}
              >
                {bookingLink}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                backgroundColor: copied ? '#43A047' : colors.primary,
              }}
            >
              {copied ? <FiCheck size={16} color="#fff" /> : <FiCopy size={16} color="#fff" />}
            </button>
          </div>

          {/* پیام کپی شد */}
          {copied && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl border animate-in fade-in slide-in-from-top-2"
              style={{
                backgroundColor: '#43A04710',
                borderColor: '#43A04740',
              }}
            >
              <FiCheck size={16} color="#43A047" />
              <p className="text-xs font-[Vazir-Bold]" style={{ color: '#43A047' }}>
                لینک با موفقیت کپی شد
              </p>
            </div>
          )}

          {/* دکمه اشتراک‌گذاری بومی */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              title="اشتراک‌گذاری"
              onPress={handleNativeShare}
              variant="outline"
              size="lg"
              fullWidth
              icon={<FiShare2 size={18} style={{ color: colors.primary }} />}
              iconPosition="right"
            />
          )}

          {/* گزینه‌های اشتراک‌گذاری */}
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={opt.onClick}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: opt.color + '20' }}
                >
                  <opt.icon size={24} color={opt.color} />
                </div>
                <span className="text-[12px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  {opt.label}
                </span>
                <span
                  className="text-[9px] font-[Vazir] text-center leading-4"
                  style={{ color: colors.textSecondary }}
                >
                  {opt.subtitle}
                </span>
              </button>
            ))}
          </div>

          {/* راهنما */}
          <div
            className="flex items-start gap-2 p-3 rounded-xl border"
            style={{
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '25',
            }}
          >
            <span className="text-base flex-shrink-0">💡</span>
            <p
              className="text-[11px] font-[Vazir] leading-5 flex-1"
              style={{ color: colors.textSecondary }}
            >
              این لینک را در بیو اینستاگرام، واتساپ بیزینس، یا هر شبکه اجتماعی دیگری قرار دهید تا
              مشتریان بتوانند مستقیماً از شما نوبت بگیرند
            </p>
          </div>
        </div>

        {/* فوتر */}
        <div
          className="px-5 pt-4 border-t"
          style={{
            borderColor: colors.border,
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {' '}
          <Button title="بستن" onPress={onClose} variant="outline" size="lg" fullWidth />
        </div>
      </div>
    </div>,
    document.body
  );
}
