'use client';
import { useState, useEffect } from 'react';
import { FiX, FiImage, FiTag, FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import CharCounter from '@/components/common/CharCounter';
import { toPersianDigit } from '@/utils/numberUtils';

const MAX_DESCRIPTION_LENGTH = 300;
const MAX_IMAGES = 5;

export default function PortfolioFormSheet({
  visible,
  onClose,
  onSave,
  editingPortfolio,
  services = [],
}) {
  const { colors } = useTheme();
  const isEditMode = !!editingPortfolio;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceId, setServiceId] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      if (editingPortfolio) {
        setTitle(editingPortfolio.title || '');
        setDescription(editingPortfolio.description || '');
        setServiceId(editingPortfolio.serviceId || null);
        setImages(
          editingPortfolio.images ||
            (editingPortfolio.coverImage ? [editingPortfolio.coverImage] : [])
        );
      } else {
        setTitle('');
        setDescription('');
        setServiceId(null);
        setImages([]);
      }
      setErrors({});
      setIsSaving(false);
    }
  }, [visible, editingPortfolio]);

  const serviceOptions = services.map((s) => ({
    id: s.id,
    label: s.name,
  }));

  const handleAddImage = () => {
    if (images.length >= MAX_IMAGES) return;
    // شبیه‌سازی آپلود تصویر
    const randomId = Math.floor(Math.random() * 1000);
    const newImage = `https://picsum.photos/800/800?random=${randomId}`;
    setImages((prev) => [...prev, newImage]);
    if (errors.images) setErrors((prev) => ({ ...prev, images: '' }));
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'عنوان نمونه‌کار الزامی است';
    } else if (title.trim().length < 3) {
      newErrors.title = 'عنوان باید حداقل ۳ کاراکتر باشد';
    }

    if (images.length === 0) {
      newErrors.images = 'حداقل یک تصویر اضافه کنید';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);

    // شبیه‌سازی تاخیر ذخیره
    await new Promise((r) => setTimeout(r, 600));

    const portfolioData = {
      title: title.trim(),
      description: description.trim(),
      serviceId,
      coverImage: images[0],
      images,
    };

    onSave(portfolioData, editingPortfolio?.id);
    setIsSaving(false);
  };

  const descLength = description.length;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isEditMode ? 'ویرایش نمونه‌کار' : 'افزودن نمونه‌کار جدید'}
      snapPoint={0.92}
      footer={
        <div className="flex gap-3">
          <Button title="انصراف" onPress={onClose} variant="outline" size="lg" className="flex-1" />
          <Button
            title={isSaving ? 'در حال ذخیره...' : isEditMode ? 'ذخیره تغییرات' : 'افزودن نمونه‌کار'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={isSaving}
            className="flex-1"
            icon={!isSaving ? <FiCheck size={18} color="#fff" /> : null}
            iconPosition="right"
          />
        </div>
      }
    >
      <div className="space-y-5 pb-4">
        {/* ═══════ بخش تصاویر ═══════ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FF980018' }}
            >
              <FiImage size={16} color="#FF9800" />
            </div>
            <span className="text-sm font-[Vazir-Bold] flex-1" style={{ color: colors.textMain }}>
              تصاویر نمونه‌کار
            </span>
            <span
              className="text-xs font-[Vazir-Bold] px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: colors.primary + '15', color: colors.primary }}
            >
              {toPersianDigit(images.length)} از {toPersianDigit(MAX_IMAGES)}
            </span>
          </div>

          {errors.images && (
            <p className="text-xs mb-2" style={{ color: '#E53935' }}>
              {errors.images}
            </p>
          )}

          {/* Grid تصاویر */}
          <div className="grid grid-cols-3 gap-2.5">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={img} alt={`تصویر ${index + 1}`} className="w-full h-full object-cover" />
                {/* Badge کاور */}
                {index === 0 && (
                  <div
                    className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[9px] font-[Vazir-Bold] text-white"
                    style={{ backgroundColor: '#FFC107' }}
                  >
                    کاور
                  </div>
                )}
                {/* دکمه حذف */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: '#E53935' }}
                >
                  <FiX size={12} color="#fff" />
                </button>
              </div>
            ))}

            {/* دکمه افزودن تصویر */}
            {images.length < MAX_IMAGES && (
              <button
                onClick={handleAddImage}
                className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  borderColor: colors.primary + '50',
                  backgroundColor: colors.primary + '05',
                }}
              >
                <FiPlus size={22} style={{ color: colors.primary }} />
                <span className="text-[10px] font-[Vazir-Medium]" style={{ color: colors.primary }}>
                  افزودن
                </span>
              </button>
            )}
          </div>

          <p className="text-[11px] mt-2" style={{ color: colors.textSecondary }}>
            اولین تصویر به عنوان کاور نمایش داده می‌شود
          </p>
        </div>

        {/* ═══════ بخش اطلاعات ═══════ */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <FiTag size={16} style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
              اطلاعات نمونه‌کار
            </span>
          </div>

          <Input
            label="عنوان نمونه‌کار *"
            placeholder="مثال: فیشیال VIP عروس"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            error={errors.title}
          />

          <Dropdown
            label="خدمت مرتبط (اختیاری)"
            placeholder="خدمت مرتبط را انتخاب کنید"
            value={serviceId}
            options={serviceOptions}
            onSelect={setServiceId}
          />

          <div className="mb-1">
            <Input
              label="توضیحات (اختیاری)"
              placeholder="توضیحاتی درباره این نمونه‌کار..."
              value={description}
              onChangeText={(t) => {
                if (t.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescription(t);
                }
              }}
              multiline
            />
            <CharCounter current={descLength} max={MAX_DESCRIPTION_LENGTH} />
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
