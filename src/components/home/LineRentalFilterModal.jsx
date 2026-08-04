'use client';
import { useState, useEffect } from 'react';
import { FiHome, FiGrid, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import Chip from '@/components/common/Chip';
import Divider from '@/components/common/Divider';

const SERVICE_FILTER_OPTIONS = [
  { id: 'all',        label: 'همه خدمات' },
  { id: 'facial',     label: 'فیشیال و پوست' },
  { id: 'nail',       label: 'کاشت ناخن' },
  { id: 'hair_color', label: 'رنگ و لایت مو' },
  { id: 'keratin',    label: 'کراتین و احیا' },
  { id: 'laser',      label: 'لیزر' },
  { id: 'makeup',     label: 'میکاپ و گریم' },
  { id: 'eyelash',    label: 'کاشت مژه' },
  { id: 'massage',    label: 'ماساژ' },
  { id: 'hair_cut',   label: 'کوتاهی مو' },
  { id: 'bridal',     label: 'خدمات عروس' },
];

const COLLAB_FILTER_OPTIONS = [
  { id: 'all',     label: 'همه',     icon: '📋' },
  { id: 'percent', label: 'درصدی',   icon: '📊' },
  { id: 'fixed',   label: 'اجاره ثابت', icon: '💰' },
  { id: 'hourly',  label: 'ساعتی',   icon: '⏰' },
];

export default function LineRentalFilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}) {
  const { colors } = useTheme();
  const [collabType, setCollabType] = useState('all');
  const [serviceType, setServiceType] = useState('all');

  useEffect(() => {
    if (visible && currentFilters) {
      setCollabType(currentFilters.collabType || 'all');
      setServiceType(currentFilters.serviceType || 'all');
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ collabType, serviceType });
    onClose();
  };

  const handleClear = () => {
    setCollabType('all');
    setServiceType('all');
    onApply({ collabType: 'all', serviceType: 'all' });
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر فرصت‌های همکاری"
      snapPoint={0.7}
      footer={
        <div className="flex gap-3">
          <Button
            title="حذف همه"
            onPress={handleClear}
            variant="outline"
            size="lg"
            icon={<FiTrash2 size={16} />}
            className="flex-1"
          />
          <Button
            title="اعمال فیلتر"
            onPress={handleApply}
            variant="primary"
            size="lg"
            icon={<FiCheck size={16} color="#fff" />}
            className="flex-1"
          />
        </div>
      }
    >
      <div className="space-y-6 pb-5">
        {/* بخش ۱: نوع همکاری */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#667eea18' }}
            >
              <FiHome size={16} color="#667eea" />
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: colors.textMain }}
            >
              نوع همکاری
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {COLLAB_FILTER_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                label={`${option.icon} ${option.label}`}
                selected={collabType === option.id}
                onPress={() => setCollabType(option.id)}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* بخش ۲: نوع خدمت */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#E91E6318' }}
            >
              <FiGrid size={16} color="#E91E63" />
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: colors.textMain }}
            >
              نوع خدمت لاین
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SERVICE_FILTER_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                label={option.label}
                selected={serviceType === option.id}
                onPress={() => setServiceType(option.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}