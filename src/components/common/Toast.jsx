'use client';
import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const TYPE_CONFIG = {
  success: { bg: 'bg-[#4CAF50]', icon: FiCheck },
  error: { bg: 'bg-[#E57373]', icon: FiX },
  warning: { bg: 'bg-[#FF9800]', icon: FiAlertTriangle },
  info: { bg: 'bg-[var(--primary)]', icon: FiInfo },
};

export default function Toast({
  visible,
  message,
  type = 'info',
  position = 'bottom',
  duration = 3000,
  onHide,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onHide?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  if (!visible && !show) return null;

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = config.icon;
  const positionClasses =
    position === 'top' ? 'top-6 left-1/2 -translate-x-1/2' : 'bottom-6 left-1/2 -translate-x-1/2';

  return (
    <div
      className={`fixed ${positionClasses} z-[10000]
        flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg
        transition-all duration-300 max-w-[90vw]
        ${config.bg}
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <Icon size={20} color="#fff" className="flex-shrink-0" />
      <span className="text-white text-sm font-vazir text-right" dir="rtl">
        {message}
      </span>
    </div>
  );
}
