'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  FiX,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiCalendar,
  FiInfo,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import CostTypeBadge from '@/components/common/CostTypeBadge';
import InfoRow from '@/components/common/InfoRow';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function ModelRequestDetailModal({ visible, request, onClose, onEdit, onDelete }) {
  const { colors } = useTheme();
  const instanceId = useRef('mr-detail-modal');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

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
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  if (!visible || !request) return null;

  const statusConfig = {
    active: { label: 'فعال', variant: 'success' },
    inactive: { label: 'غیرفعال', variant: 'error' },
  };
  const currentStatus = statusConfig[request.status] || statusConfig.inactive;

  const handleCall = () => {
    if (request.contactPhone) {
      window.location.href = `tel:${request.contactPhone}`;
    }
  };

  const handleDeleteRequest = () => {
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogVisible(false);
    onClose();
    onDelete?.(request);
  };

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═══ هدر ═══ */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            جزئیات درخواست مدل
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* ═══ محتوای اسکرولی ═══ */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* تصویر خدمت */}
          {request.serviceImage && (
            <div className="relative w-full h-[200px] rounded-2xl overflow-hidden">
              <Image
                src={request.serviceImage}
                alt={request.title}
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
              />
              {/* گرادیان پایین */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[60px]"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
              />
              {/* Badge وضعیت */}
              <div className="absolute top-3 right-3">
                <Badge label={currentStatus.label} variant={currentStatus.variant} size="md" />
              </div>
            </div>
          )}

          {/* عنوان و badges */}
          <div className="space-y-3">
            <h2 className="text-lg font-[Vazir-Bold] leading-7" style={{ color: colors.textMain }}>
              {request.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <CostTypeBadge type={request.costType} variant="default" />
              {request.serviceName && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: colors.primary + '15' }}
                >
                  <span className="text-xs">💆‍♀️</span>
                  <span className="text-[11px] font-[Vazir-Bold]" style={{ color: colors.primary }}>
                    {request.serviceName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* توضیحات */}
          <Card variant="default" padding={14} radius={14}>
            <div className="flex items-center gap-2 mb-3">
              <FiInfo size={18} style={{ color: colors.primary }} />
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                توضیحات
              </span>
            </div>
            <p
              className="text-[13px] font-[Vazir] leading-[24px] text-justify"
              style={{ color: colors.textSecondary }}
            >
              {request.description}
            </p>
          </Card>

          {/* اطلاعات تماس */}
          {request.contactPhone && (
            <Card variant="default" padding={14} radius={14}>
              <div className="flex items-center gap-2 mb-3">
                <FiPhone size={18} color="#4CAF50" />
                <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                  اطلاعات تماس
                </span>
              </div>
              <Button
                title="تماس مستقیم"
                onPress={handleCall}
                variant="primary"
                size="md"
                fullWidth
                icon={<FiPhone size={18} color="#fff" />}
                iconPosition="right"
                style={{ marginTop: 8, backgroundColor: '#4CAF50' }}
              />
            </Card>
          )}

          {/* تاریخ‌ها */}
          <Card variant="default" padding={14} radius={14}>
            <div className="flex items-center gap-2 mb-3">
              <FiCalendar size={18} color="#2196F3" />
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                زمان‌بندی
              </span>
            </div>
            <InfoRow icon="📅" label="تاریخ ایجاد" value={request.createdAt || '—'} />
            <InfoRow icon="⏰" label="تاریخ انقضا" value={request.expiresAt || '—'} />
          </Card>

          {/* دکمه‌های اکشن */}
          <div className="flex gap-3 pt-2">
            <Button
              title="ویرایش"
              onPress={() => {
                onClose();
                setTimeout(() => onEdit?.(request), 300);
              }}
              variant="outline"
              size="lg"
              className="flex-1"
              icon={<FiEdit2 size={18} style={{ color: colors.primary }} />}
              iconPosition="right"
            />
            <Button
              title="حذف"
              onPress={handleDeleteRequest}
              variant="primary"
              size="lg"
              className="flex-1"
              style={{ backgroundColor: '#E53935', borderColor: '#E53935' }}
              icon={<FiTrash2 size={18} color="#fff" />}
              iconPosition="right"
            />
          </div>
        </div>
      </div>
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="حذف درخواست مدل"
        message={`آیا از حذف "${request.title}" مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        confirmText="حذف"
        cancelText="انصراف"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </div>
  );

  return createPortal(content, document.body);
}
