'use client';
import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

// ✅ رنگ‌های solid و پررنگ برای هر نوع
const TYPE_CONFIG = {
  success: {
    icon: FiCheckCircle,
    bg: '#43A047',
    border: '#388E3C',
    textColor: '#ffffff',
  },
  error: {
    icon: FiAlertCircle,
    bg: '#E53935',
    border: '#C62828',
    textColor: '#ffffff',
  },
  warning: {
    icon: FiAlertTriangle,
    bg: '#FF9800',
    border: '#F57C00',
    textColor: '#ffffff',
  },
  info: {
    icon: FiInfo,
    bg: '#2196F3',
    border: '#1976D2',
    textColor: '#ffffff',
  },
};

export default function Toast({ visible, message, type = 'info', position = 'bottom', onHide }) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      // ✅ کوچک‌ترین تأخیر برای انیمیشن ورود
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible]);

  if (!show && !visible) return null;

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = config.icon;
  const positionClass = position === 'top' ? 'top-6' : 'bottom-6';

  return (
    <div
      className={`fixed left-4 right-4 ${positionClass} z-[99999]
flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl
transition-all duration-300 ease-out
${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: `0 8px 24px ${config.bg}40`,
      }}
      role="alert"
      aria-live="polite"
    >
      <Icon size={20} color={config.textColor} className="flex-shrink-0" />
      <span
        className="flex-1 text-sm font-[Vazir-Bold] leading-6"
        style={{ color: config.textColor }}
      >
        {message}
      </span>
      {onHide && (
        <button
          onClick={onHide}
          className="p-1.5 rounded-full flex-shrink-0 transition-opacity hover:opacity-70"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          aria-label="بستن"
        >
          <FiX size={16} color={config.textColor} />
        </button>
      )}
    </div>
  );
}
