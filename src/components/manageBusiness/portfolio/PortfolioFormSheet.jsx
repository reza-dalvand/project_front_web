// src/components/manageBusiness/portfolio/PortfolioFormSheet.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { FiX, FiImage, FiUpload } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import { useServiceCategories, useSubServices } from '@/hooks/useCategoryOptions';
import { toPersianDigit } from '@/utils/numberUtils';
import Image from 'next/image';

const MAX_IMAGES = 3;
const MAX_DESCRIPTION = 300;

export default function PortfolioFormSheet({
  visible,
  onClose,
  onSave,
  editingPortfolio,
  services = [],
}) {
  const { colors } = useTheme();
  const isEditMode = !!editingPortfolio;

  // ─── State فرم ───
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [subServiceId, setSubServiceId] = useState(null);
  const [images, setImages] = useState([]);       // ✅ فایل‌های واقعی
  const [imagePreviews, setImagePreviews] = useState([]); // برای پیش‌نمایش
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  // ─── دسته‌بندی‌ها از بک‌اند ───
  const { categories: serviceCategories } = useServiceCategories();
  const { subServices: availableSubServices } = useSubServices(categoryId);

  // ─── پر کردن فرم در حالت ویرایش ───
  useEffect(() => {
    if (visible) {
      if (editingPortfolio) {
        setTitle(editingPortfolio.title || '');
        setDescription(editingPortfolio.description || '');
        setCategoryId(editingPortfolio.categoryId || editingPortfolio.category?.id || null);
        setSubServiceId(editingPortfolio.subServiceId || editingPortfolio.sub_service?.id || null);
        setImages([]);
        setImagePreviews([]);
      } else {
        setTitle('');
        setDescription('');
        setCategoryId(null);
        setSubServiceId(null);
        setImages([]);
        setImagePreviews([]);
      }
      setErrors({});
      setSaving(false);
    }
  }, [visible, editingPortfolio]);

  // ─── انتخاب فایل ───
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    const filesToAdd = files.slice(0, remaining);

    if (filesToAdd.length === 0) return;

    // اعتبارسنجی نوع و حجم
    const validFiles = [];
    const previews = [];
    for (const file of filesToAdd) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, images: 'فقط فایل تصویری مجاز است' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: 'حجم هر تصویر حداکثر ۱۰ مگابایت' }));
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
    setErrors((prev) => ({ ...prev, images: '' }));

    // ریست اینپوت تا بشود دوباره همان فایل را انتخاب کرد
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── حذف تصویر ───
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ─── اعتبارسنجی ───
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'عنوان نمونه‌کار الزامی است';
    else if (title.trim().length < 3) newErrors.title = 'عنوان باید حداقل ۳ کاراکتر باشد';
    if (!categoryId) newErrors.categoryId = 'دسته‌بندی را انتخاب کنید';
    if (!subServiceId) newErrors.subServiceId = 'نوع خدمت را انتخاب کنید';
    if (images.length === 0) newErrors.images = 'حداقل یک تصویر آپلود کنید'; // ✅ اجباری
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── ذخیره ───
  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);

    // ✅ ساختن FormData با فایل‌های واقعی
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', String(categoryId));
    formData.append('sub_service', String(subServiceId));

    // ✅ تصاویر واقعی به جای آدرس
    images.forEach((file, i) => {
      formData.append('images', file);
    });

    // اولین تصویر = کاور
    formData.append('cover_image', images[0]);

    onSave(formData, editingPortfolio?.id);
  };

  // ─── Cleanup previews ───
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isEditMode ? 'ویرایش نمونه‌کار' : 'افزودن نمونه‌کار جدید'}
      snapPoint={0.92}
      footer={
        <Button
          title={saving ? 'در حال ذخیره...' : isEditMode ? 'ذخیره تغییرات' : 'افزودن نمونه‌کار'}
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          variant="primary"
          size="lg"
          fullWidth
          iconPosition="right"
        />
      }
    >
      <div className="space-y-5 pb-4">
        {/* ═══ آپلود تصاویر — اجباری ═══ */}
        <div>
          <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
            تصاویر نمونه‌کار <span style={{ color: '#E53935' }}>*</span>
            <span className="text-xs font-[Vazir] mr-2" style={{ color: colors.textSecondary }}>
              (حداقل ۱، حداکثر {toPersianDigit(MAX_IMAGES)} تصویر)
            </span>
          </label>

          {/* پیش‌نمایش تصاویر */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border" style={{ borderColor: colors.border }}>
                  <Image src={preview} alt={`تصویر ${index + 1}`} fill className="object-cover" sizes="96px" />
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-0.5">
                      <span className="text-[9px] text-white font-[Vazir-Bold]">کاور</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#E53935' }}
                  >
                    <FiX size={12} color="#fff" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* دکمه آپلود */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          {images.length < MAX_IMAGES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed transition-all"
              style={{
                borderColor: errors.images ? '#E53935' : colors.primary + '50',
                backgroundColor: colors.primary + '05',
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                <FiUpload size={24} style={{ color: colors.primary }} />
              </div>
              <span className="text-sm font-[Vazir-Medium]" style={{ color: colors.textMain }}>
                {images.length === 0 ? 'تصویر آپلود کنید' : 'افزودن تصویر بیشتر'}
              </span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                JPG، PNG یا WebP — حداکثر ۱۰ مگابایت
              </span>
            </button>
          )}

          {errors.images && (
            <p className="text-xs mt-1.5" style={{ color: '#E53935' }}>{errors.images}</p>
          )}
        </div>

        {/* ═══ عنوان ═══ */}
        <Input
          label="عنوان نمونه‌کار *"
          placeholder="مثال: کاشت ناخن مینیمال"
          value={title}
          onChangeText={(t) => {
            setTitle(t);
            setErrors((prev) => ({ ...prev, title: '' }));
          }}
          error={errors.title}
        />

        {/* ═══ دسته‌بندی ═══ */}
        <Dropdown
          label="دسته‌بندی خدمات *"
          placeholder="دسته‌بندی را انتخاب کنید"
          value={categoryId}
          options={serviceCategories.map((c) => ({ id: c.id, label: c.label }))}
          onSelect={(val) => {
            setCategoryId(val);
            setSubServiceId(null);
            setErrors((prev) => ({ ...prev, categoryId: '' }));
          }}
        />
        {errors.categoryId && <p className="text-xs mt-1.5" style={{ color: '#E53935' }}>{errors.categoryId}</p>}

        {/* ═══ نوع خدمت ═══ */}
        <Dropdown
          label="نوع خدمت *"
          placeholder={categoryId ? 'نوع خدمت را انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
          value={subServiceId}
          options={availableSubServices}
          onSelect={(val) => {
            setSubServiceId(val);
            setErrors((prev) => ({ ...prev, subServiceId: '' }));
          }}
          disabled={!categoryId}
        />
        {errors.subServiceId && <p className="text-xs mt-1.5" style={{ color: '#E53935' }}>{errors.subServiceId}</p>}

        {/* ═══ توضیحات ═══ */}
        <Input
          label="توضیحات (اختیاری)"
          placeholder="توضیحاتی درباره این نمونه‌کار..."
          value={description}
          onChangeText={(t) => {
            if (t.length <= MAX_DESCRIPTION) setDescription(t);
          }}
          multiline
        />
        <p className="text-xs text-left" style={{ color: colors.textSecondary }}>
          {toPersianDigit(description.length)}/{toPersianDigit(MAX_DESCRIPTION)}
        </p>
      </div>
    </BottomSheet>
  );
}