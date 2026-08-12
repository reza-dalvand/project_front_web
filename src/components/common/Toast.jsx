'use client';
import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const TYPE_CONFIG = {
  success: { icon: FiCheckCircle, color: '#43A047', bg: '#43A04715' },
  error: { icon: FiAlertCircle, color: '#E53935', bg: '#E5393515' },
  warning: { icon: FiAlertTriangle, color: '#FF9800', bg: '#FF980015' },
  info: { icon: FiInfo, color: '#2196F3', bg: '#2196F315' },
};

export default function Toast({ visible, message, type = 'info', position = 'bottom', onHide }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show && !visible) return null;

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  const positionClass = position === 'top' ? 'top-4' : 'bottom-4';

  return (
    <div
      className={`fixed left-4 right-4 ${positionClass} z-[99999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ backgroundColor: config.bg, border: `1px solid ${config.color}40` }}
    >
      <Icon size={20} color={config.color} />
      <span className="flex-1 text-sm font-[Vazir-Medium]" style={{ color: config.color }}>
        {message}
      </span>
      {onHide && (
        <button onClick={onHide} className="p-1">
          <FiX size={16} color={config.color} />
        </button>
      )}
    </div>
  );
}
