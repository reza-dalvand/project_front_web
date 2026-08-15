// src/components/profile/edit/DeleteConfirmModal.jsx
'use client';
import { createPortal } from 'react-dom';
import { FiShield, FiAlertTriangle } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';

export default function DeleteConfirmModal({ visible, onConfirm, onCancel }) {
  const { colors } = useTheme();

  if (!visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 flex flex-col items-center gap-4"
        style={{ backgroundColor: colors.cardBackground }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#E5393520' }}
        >
          <FiShield size={40} color="#E53935" />
        </div>
        <h3 className="text-lg font-[Vazir-Bold] text-center" style={{ color: colors.textMain }}>
          حذف حساب کاربری
        </h3>
        <p className="text-sm text-center leading-6" style={{ color: colors.textSecondary }}>
          آیا از حذف دائمی حساب کاربری خود مطمئن هستید؟ این عمل قابل بازگشت نیست.
        </p>
        <div
          className="w-full flex items-start gap-2 p-3 rounded-xl border"
          style={{
            backgroundColor: '#E5393508',
            borderColor: '#E5393530',
          }}
        >
          <FiAlertTriangle size={14} color="#E53935" className="flex-shrink-0 mt-0.5" />
          <span className="text-xs font-[Vazir] leading-5 flex-1" style={{ color: '#E53935' }}>
            برای تایید حذف، کد OTP به شماره شما ارسال می‌شود
          </span>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button
            title="انصراف"
            onPress={onCancel}
            variant="outline"
            size="lg"
            className="flex-1"
          />
          <Button
            title="ارسال کد تایید"
            onPress={onConfirm}
            variant="primary"
            size="lg"
            className="flex-1"
            style={{ backgroundColor: '#E53935' }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
