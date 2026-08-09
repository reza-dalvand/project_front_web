'use client';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiEdit2, FiTrash2, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import CollabBadge from '@/components/common/CollabBadge';
import InfoRow from '@/components/common/InfoRow';
import { toPersianDigit } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';
import { useToast } from '@/hooks/useToast';

export default function LineRentalDetailModal({ visible, ad, onClose, onEdit, onDelete }) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('lr-detail-modal');
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (visible) acquireScrollLock(instanceId.current);
    else releaseScrollLock(instanceId.current);
    return () => releaseScrollLock(instanceId.current);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const h = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [visible, onClose]);

  if (!mounted || !visible || !ad) return null;

  const statusConfig = {
    active: { label: 'فعال', variant: 'success' },
    inactive: { label: 'غیرفعال', variant: 'error' },
  };
  const st = statusConfig[ad.status] || statusConfig.inactive;

  const handleCall = () => {
    if (ad.contactPhone) {
      window.location.href = `tel:${ad.contactPhone}`;
    } else {
      showToast('شماره تماسی ثبت نشده است', 'error');
    }
  };

  const handleDelete = () => {
    if (confirm(`آیا از حذف "${ad.title}" مطمئن هستید؟`)) onDelete?.(ad);
  };

  const getPriceInfo = () => {
    switch (ad.collabType) {
      case 'percent':
        return {
          label: 'تقسیم درآمد',
          value: `سالن ${toPersianDigit(ad.percentSalon || 0)}٪ - همکار ${toPersianDigit(ad.percentPartner || 0)}٪`,
          color: '#9C27B0',
          icon: '📊',
        };
      case 'fixed':
        return {
          label: ad.fixedDeposit > 0 ? 'اجاره ماهانه + رهن' : 'اجاره ماهانه',
          value:
            ad.fixedDeposit > 0
              ? `${toPersianDigit((ad.fixedAmount || 0).toLocaleString('en-US'))} + ${toPersianDigit((ad.fixedDeposit || 0).toLocaleString('en-US'))} رهن`
              : `${toPersianDigit((ad.fixedAmount || 0).toLocaleString('en-US'))} تومان`,
          color: '#2196F3',
          icon: '💰',
        };
      case 'hourly':
        return {
          label: 'نرخ ساعتی',
          value: `${toPersianDigit((ad.hourlyRate || 0).toLocaleString('en-US'))} تومان / ساعت`,
          color: '#FF9800',
          icon: '⏰',
        };
      default:
        return { label: 'قیمت', value: ad.priceDisplay || '—', color: '#607D8B', icon: '💰' };
    }
  };
  const pi = getPriceInfo();

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{ backgroundColor: colors.cardBackground, borderTop: `1px solid ${colors.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            جزئیات آگهی لاین
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* عنوان + badges */}
          <div className="space-y-3">
            <h2 className="text-lg font-[Vazir-Bold] leading-7" style={{ color: colors.textMain }}>
              {ad.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <CollabBadge type={ad.collabType} priceDisplay={ad.priceDisplay} variant="default" />
              <Badge label={st.label} variant={st.variant} size="md" />
            </div>
            {ad.businessName && (
              <div className="flex items-center gap-2">
                <span className="text-xs">🏪</span>
                <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
                  {ad.businessName}
                </span>
              </div>
            )}
            {ad.city && (
              <div className="flex items-center gap-2">
                <FiMapPin size={12} color={colors.textSecondary} />
                <span className="text-xs" style={{ color: colors.textSecondary }}>
                  {ad.city}
                </span>
              </div>
            )}
          </div>

          {/* شرایط همکاری */}
          <Card variant="default" padding={14} radius={14} style={{ borderColor: pi.color + '30' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{pi.icon}</span>
              <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                شرایط همکاری
              </span>
            </div>
            <div
              className="p-3 rounded-xl border"
              style={{ backgroundColor: pi.color + '08', borderColor: pi.color + '25' }}
            >
              <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                {pi.label}
              </p>
              <p className="text-sm font-[Vazir-Bold]" style={{ color: pi.color }}>
                {pi.value}
              </p>
            </div>
          </Card>

          {/* توضیحات */}
          {ad.description && (
            <Card variant="default" padding={14} radius={14}>
              <p className="text-sm font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
                توضیحات
              </p>
              <p className="text-xs leading-6 text-justify" style={{ color: colors.textSecondary }}>
                {ad.description}
              </p>
            </Card>
          )}

          {/* تماس */}
          {ad.contactPhone && (
            <Card variant="default" padding={14} radius={14}>
              <p className="text-sm font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
                اطلاعات تماس
              </p>
              <Button
                title="تماس مستقیم"
                onPress={handleCall}
                variant="primary"
                size="md"
                fullWidth
                style={{ marginTop: 8, backgroundColor: '#4CAF50' }}
                icon={<FiPhone size={16} color="#fff" />}
                iconPosition="right"
              />
            </Card>
          )}

          {/* تاریخ‌ها */}
          {(ad.createdAt || ad.expiresAt) && (
            <Card variant="default" padding={14} radius={14}>
              {ad.createdAt && <InfoRow icon="📅" label="تاریخ ایجاد" value={ad.createdAt} />}
              {ad.expiresAt && <InfoRow icon="⏰" label="تاریخ انقضا" value={ad.expiresAt} />}
            </Card>
          )}

          {/* غیرفعال */}
          {ad.status === 'inactive' && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl border"
              style={{ backgroundColor: '#E5393510', borderColor: '#E5393530' }}
            >
              <span className="text-sm">⚠️</span>
              <span className="text-xs" style={{ color: '#E53935' }}>
                این آگهی غیرفعال است و در جستجو نمایش داده نمی‌شود
              </span>
            </div>
          )}

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-2">
            <Button
              title="ویرایش"
              onPress={() => {
                onClose();
                setTimeout(() => onEdit?.(ad), 300);
              }}
              variant="outline"
              size="lg"
              className="flex-1"
              icon={<FiEdit2 size={16} style={{ color: colors.primary }} />}
              iconPosition="right"
            />
            <Button
              title="حذف"
              onPress={handleDelete}
              variant="primary"
              size="lg"
              className="flex-1"
              style={{ backgroundColor: '#E53935', borderColor: '#E53935' }}
              icon={<FiTrash2 size={16} color="#fff" />}
              iconPosition="right"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
