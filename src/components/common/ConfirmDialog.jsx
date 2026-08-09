// src/components/common/ConfirmDialog.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiAlertTriangle, FiTrash2, FiInfo } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from './Button';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

/**
 * کامپوننت ConfirmDialog - جایگزین confirm() بومی
 *
 * @param {boolean}  visible       - وضعیت نمایش
 * @param {string}   title         - عنوان
 * @param {string}   message       - پیام
 * @param {string}   confirmText   - متن دکمه تایید
 * @param {string}   cancelText    - متن دکمه انصراف
 * @param {'danger'|'warning'|'info'} variant - نوع
 * @param {function} onConfirm     - تایید
 * @param {function} onCancel      - انصراف
 */
export default function ConfirmDialog({
  visible,
  title = 'تایید عملیات',
  message = '',
  confirmText = 'تایید',
  cancelText = 'انصراف',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('confirm-dialog');

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onCancel]);

  if (!mounted || !visible) return null;

  const variantConfig = {
    danger: {
      icon: FiTrash2,
      iconColor: '#E53935',
      iconBg: '#E5393515',
      confirmBg: '#E53935',
    },
    warning: {
      icon: FiAlertTriangle,
      iconColor: '#FF9800',
      iconBg: '#FF980015',
      confirmBg: '#FF9800',
    },
    info: {
      icon: FiInfo,
      iconColor: colors.primary,
      iconBg: colors.primary + '15',
      confirmBg: colors.primary,
    },
  };

  const config = variantConfig[variant] || variantConfig.danger;
  const Icon = config.icon;

  const content = (
    <div
      className="fixed inset-0 z-[10002] flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-4
          shadow-2xl"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* آیکون */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.iconBg }}
        >
          <Icon size={40} color={config.iconColor} />
        </div>

        {/* عنوان */}
        <h3 className="text-lg font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
          {title}
        </h3>

        {/* پیام */}
        {message && (
          <p className="text-sm text-center leading-6" style={{ color: colors.textSecondary }}>
            {message}
          </p>
        )}

        {/* دکمه‌ها */}
        <div className="flex gap-3 w-full mt-2">
          <Button
            title={cancelText}
            onPress={onCancel}
            variant="outline"
            size="lg"
            className="flex-1"
          />
          <Button
            title={confirmText}
            onPress={onConfirm}
            variant="primary"
            size="lg"
            className="flex-1"
            style={{ backgroundColor: config.confirmBg }}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
