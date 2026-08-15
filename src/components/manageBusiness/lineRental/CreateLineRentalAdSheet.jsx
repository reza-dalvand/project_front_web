// src/components/manageBusiness/lineRental/CreateLineRentalAdSheet.jsx
'use client';
import { useState, useEffect } from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import CharCounter from '@/components/common/CharCounter';
import { toPersianDigit, parseNumber, formatPriceInput } from '@/utils/numberUtils';
import { COLLAB_TYPES } from '@/constants/collabTypes';
import { SERVICE_CATEGORIES, getSubServicesByCategory } from '@/constants/serviceTypes';

// ═══════ محدودیت‌های بک‌اند ═══════
// title: max 100
// description: max 500
// contact_phone: max 11
// collab_type: percent/fixed/hourly
// percent_salon + percent_partner = 100 (برای percent)
const MAX_TITLE = 100;
const MAX_DESCRIPTION = 500;
const MAX_PHONE = 11;

export default function CreateLineRentalAdSheet({ visible, onClose, onSave, editingAd }) {
  const { colors } = useTheme();
  const isEditMode = !!editingAd;
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [subServiceId, setSubServiceId] = useState(null);
  const [collabType, setCollabType] = useState(null);
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [percentSalon, setPercentSalon] = useState('');
  const [percentPartner, setPercentPartner] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedDeposit, setFixedDeposit] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const availableSubServices = categoryId ? getSubServicesByCategory(categoryId) : [];

  useEffect(() => {
    if (visible) {
      if (editingAd) {
        setTitle(editingAd.title || '');
        setCategoryId(editingAd.categoryId || null);
        setSubServiceId(editingAd.subServiceId || null);
        setCollabType(editingAd.collabType || null);
        setDescription((editingAd.description || '').slice(0, MAX_DESCRIPTION));
        setContactPhone(editingAd.contactPhone || '');
        setPercentSalon(editingAd.percentSalon ? String(editingAd.percentSalon) : '');
        setPercentPartner(editingAd.percentPartner ? String(editingAd.percentPartner) : '');
        setFixedAmount(
          editingAd.fixedAmount ? formatPriceInput(String(editingAd.fixedAmount)) : ''
        );
        setFixedDeposit(
          editingAd.fixedDeposit ? formatPriceInput(String(editingAd.fixedDeposit)) : ''
        );
        setHourlyRate(editingAd.hourlyRate ? formatPriceInput(String(editingAd.hourlyRate)) : '');
      } else {
        setTitle('');
        setCategoryId(null);
        setSubServiceId(null);
        setCollabType(null);
        setDescription('');
        setContactPhone('');
        setPercentSalon('');
        setPercentPartner('');
        setFixedAmount('');
        setFixedDeposit('');
        setHourlyRate('');
      }
      setErrors({});
    }
  }, [visible, editingAd]);

  const handleCollabChange = (id) => {
    setCollabType(id);
    setPercentSalon('');
    setPercentPartner('');
    setFixedAmount('');
    setFixedDeposit('');
    setHourlyRate('');
    setErrors((p) => ({ ...p, collabType: '', price: '' }));
  };

  const handlePercentSalon = (t) => {
    setPercentSalon(t);
    const n = parseNumber(t);
    if (n > 0 && n <= 100) setPercentPartner(String(100 - n));
    else setPercentPartner('');
    setErrors((p) => ({ ...p, price: '' }));
  };

  const handlePercentPartner = (t) => {
    setPercentPartner(t);
    const n = parseNumber(t);
    if (n > 0 && n <= 100) setPercentSalon(String(100 - n));
    else setPercentSalon('');
    setErrors((p) => ({ ...p, price: '' }));
  };

  // ═══════ اعتبارسنجی مطابق بک‌اند ═══════
  const validate = () => {
    const newErrors = {};

    // title: الزامی، max 100
    if (!title.trim()) {
      newErrors.title = 'عنوان آگهی الزامی است';
    } else if (title.trim().length > MAX_TITLE) {
      newErrors.title = `عنوان نمی‌تواند بیشتر از ${toPersianDigit(MAX_TITLE)} کاراکتر باشد`;
    }

    // categoryId: الزامی
    if (!categoryId) newErrors.categoryId = 'دسته‌بندی خدمات را انتخاب کنید';

    // subServiceId: الزامی
    if (!subServiceId) newErrors.subServiceId = 'نوع خدمت را انتخاب کنید';

    // collabType: الزامی
    if (!collabType) newErrors.collabType = 'نوع همکاری را انتخاب کنید';

    // description: الزامی، max 500
    if (!description.trim()) {
      newErrors.description = 'توضیحات الزامی است';
    } else if (description.trim().length > MAX_DESCRIPTION) {
      newErrors.description = `توضیحات نمی‌تواند بیشتر از ${toPersianDigit(MAX_DESCRIPTION)} کاراکتر باشد`;
    }

    // contactPhone: الزامی، ۱۱ رقم
    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'شماره تماس الزامی است';
    } else if (contactPhone.trim().length !== MAX_PHONE) {
      newErrors.contactPhone = `شماره تماس باید دقیقاً ${toPersianDigit(MAX_PHONE)} رقم باشد`;
    }

    // اعتبارسنجی قیمت بر اساس نوع همکاری
    if (collabType === 'percent') {
      const s = parseNumber(percentSalon),
        p = parseNumber(percentPartner);
      if (!s || !p) newErrors.price = 'درصد سالن و همکار را وارد کنید';
      else if (s + p !== 100) newErrors.price = 'مجموع درصدها باید ۱۰۰٪ باشد';
    } else if (collabType === 'fixed') {
      const f = parseNumber(fixedAmount);
      if (!f) newErrors.price = 'مبلغ اجاره ماهانه را وارد کنید';
    } else if (collabType === 'hourly') {
      const h = parseNumber(hourlyRate);
      if (!h) newErrors.price = 'نرخ ساعتی را وارد کنید';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const collab = COLLAB_TYPES.find((c) => c.id === collabType);
    const svc = availableSubServices.find((s) => s.id === subServiceId);

    let priceData = {};
    let priceDisplay = '';

    if (collabType === 'percent') {
      priceData = {
        percentSalon: parseNumber(percentSalon),
        percentPartner: parseNumber(percentPartner),
      };
      priceDisplay = `${toPersianDigit(priceData.percentSalon)}-${toPersianDigit(priceData.percentPartner)}`;
    } else if (collabType === 'fixed') {
      priceData = {
        fixedAmount: parseNumber(fixedAmount),
        fixedDeposit: parseNumber(fixedDeposit),
      };
      priceDisplay =
        priceData.fixedDeposit > 0
          ? `${toPersianDigit(priceData.fixedAmount.toLocaleString('en-US'))} + ${toPersianDigit(priceData.fixedDeposit.toLocaleString('en-US'))} رهن`
          : `${toPersianDigit(priceData.fixedAmount.toLocaleString('en-US'))} تومان`;
    } else if (collabType === 'hourly') {
      priceData = { hourlyRate: parseNumber(hourlyRate) };
      priceDisplay = `${toPersianDigit(priceData.hourlyRate.toLocaleString('en-US'))} / ساعت`;
    }

    onSave({
      id: editingAd?.id || `lr_${Date.now()}`,
      title: title.trim(),
      categoryId,
      subServiceId,
      subServiceLabel: svc?.label || '',
      collabType,
      collabLabel: collab?.label,
      ...priceData,
      priceDisplay,
      description: description.trim(),
      contactPhone,
      status: 'active',
    });
    onClose();
  };

  const descLen = description.length;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isEditMode ? 'ویرایش آگهی لاین' : 'ثبت آگهی جدید لاین'}
      snapPoint={0.92}
    >
      <div className="space-y-6 pb-4">
        {/* عنوان */}
        <Input
          label="عنوان آگهی *"
          placeholder="مثال: لاین ناخن با تجهیزات کامل"
          value={title}
          onChangeText={(t) => {
            if (t.length <= MAX_TITLE) setTitle(t);
            setErrors((p) => ({ ...p, title: '' }));
          }}
          error={errors.title}
          hint={`${toPersianDigit(title.length)} از ${toPersianDigit(MAX_TITLE)} کاراکتر`}
        />

        {/* دسته‌بندی خدمات */}
        <Dropdown
          label="دسته‌بندی خدمات *"
          placeholder="دسته‌بندی را انتخاب کنید"
          value={categoryId}
          options={SERVICE_CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
          onSelect={(val) => {
            setCategoryId(val);
            setSubServiceId(null);
            setErrors((p) => ({ ...p, categoryId: '' }));
          }}
        />
        {errors.categoryId && (
          <p className="text-xs text-[#E53935] mt-[-8px] mb-3">{errors.categoryId}</p>
        )}

        {/* نوع خدمت */}
        <Dropdown
          label="نوع خدمت لاین *"
          placeholder={categoryId ? 'نوع خدمت را انتخاب کنید' : 'ابتدا دسته‌بندی را انتخاب کنید'}
          value={subServiceId}
          options={availableSubServices}
          onSelect={(val) => {
            setSubServiceId(val);
            setErrors((p) => ({ ...p, subServiceId: '' }));
          }}
          disabled={!categoryId}
        />
        {errors.subServiceId && (
          <p className="text-xs text-[#E53935] mt-[-8px] mb-3">{errors.subServiceId}</p>
        )}

        {/* نوع همکاری */}
        <div>
          <p className="text-sm font-[Vazir-Medium] mb-3" style={{ color: colors.textMain }}>
            نوع همکاری *
          </p>
          <div className="flex gap-2">
            {COLLAB_TYPES.map((ct) => {
              const isSel = collabType === ct.id;
              return (
                <button
                  key={ct.id}
                  onClick={() => handleCollabChange(ct.id)}
                  className="flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all text-center"
                  style={{
                    backgroundColor: isSel ? ct.color + '15' : colors.cardBackground,
                    borderColor: isSel ? ct.color : colors.border,
                  }}
                >
                  <span
                    className="text-sm font-[Vazir-Bold]"
                    style={{ color: isSel ? ct.color : colors.textMain }}
                  >
                    {ct.label}
                  </span>
                  <span className="text-[10px] leading-4" style={{ color: colors.textSecondary }}>
                    {ct.hint}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.collabType && <p className="text-xs text-[#E53935] mt-2">{errors.collabType}</p>}
        </div>

        {/* فیلدهای قیمت بر اساس نوع همکاری */}
        {collabType === 'percent' && (
          <Card variant="default" padding={14} radius={14}>
            <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
              درصد سالن و همکار را وارد کنید (مجموع باید ۱۰۰٪ باشد)
            </p>
            {/* ✅ اصلاح: grid به جای flex + حذف mb اضافی */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="text-xs mb-1.5 block font-[Vazir-Medium]"
                  style={{ color: colors.primary }}
                >
                  سهم سالن (٪)
                </label>
                <div className="mb-0 [&>div]:mb-0">
                  <Input
                    placeholder="۴۰"
                    value={percentSalon}
                    onChangeText={handlePercentSalon}
                    type="tel"
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-xs mb-1.5 block font-[Vazir-Medium]"
                  style={{ color: '#9C27B0' }}
                >
                  سهم همکار (٪)
                </label>
                <div className="mb-0 [&>div]:mb-0">
                  <Input
                    placeholder="۶۰"
                    value={percentPartner}
                    onChangeText={handlePercentPartner}
                    type="tel"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
            {/* نمایش مجموع */}
            {parseNumber(percentSalon) > 0 && (
              <div
                className="flex items-center gap-2 mt-3 p-2.5 rounded-lg border"
                style={{
                  backgroundColor:
                    parseNumber(percentSalon) + parseNumber(percentPartner) === 100
                      ? '#4CAF5010'
                      : '#FF980010',
                  borderColor:
                    parseNumber(percentSalon) + parseNumber(percentPartner) === 100
                      ? '#4CAF5040'
                      : '#FF980040',
                }}
              >
                <span
                  className="text-xs font-[Vazir-Bold]"
                  style={{
                    color:
                      parseNumber(percentSalon) + parseNumber(percentPartner) === 100
                        ? '#4CAF50'
                        : '#FF9800',
                  }}
                >
                  {parseNumber(percentSalon) + parseNumber(percentPartner) === 100
                    ? '✓ مجموع: ۱۰۰٪'
                    : `مجموع: ${toPersianDigit(
                        parseNumber(percentSalon) + parseNumber(percentPartner)
                      )}٪`}
                </span>
              </div>
            )}
          </Card>
        )}

        {collabType === 'fixed' && (
          <Card variant="default" padding={14} radius={14}>
            <div className="[&>div]:mb-3 last:[&>div]:mb-0">
              <Input
                label="مبلغ اجاره ماهانه (تومان) *"
                placeholder="مثال: ۵,۰۰۰,۰۰۰"
                value={fixedAmount}
                onChangeText={(t) => {
                  setFixedAmount(formatPriceInput(t));
                  setErrors((p) => ({ ...p, price: '' }));
                }}
                type="tel"
              />
              <Input
                label="مبلغ رهن (اختیاری)"
                placeholder="مثال: ۲۰,۰۰۰,۰۰۰ یا خالی"
                value={fixedDeposit}
                onChangeText={(t) => setFixedDeposit(formatPriceInput(t))}
                type="tel"
              />
            </div>
          </Card>
        )}

        {collabType === 'hourly' && <Card variant="default" padding={14} radius={14}></Card>}
        {collabType === 'fixed' && (
          <Card variant="default" padding={14} radius={14}>
            <Input
              label="مبلغ اجاره ماهانه (تومان) *"
              placeholder="مثال: ۵,۰۰۰,۰۰۰"
              value={fixedAmount}
              onChangeText={(t) => {
                setFixedAmount(formatPriceInput(t));
                setErrors((p) => ({ ...p, price: '' }));
              }}
            />
            <Input
              label="مبلغ رهن (اختیاری)"
              placeholder="مثال: ۲۰,۰۰۰,۰۰۰ یا خالی"
              value={fixedDeposit}
              onChangeText={(t) => setFixedDeposit(formatPriceInput(t))}
            />
          </Card>
        )}
        {collabType === 'hourly' && (
          <Card variant="default" padding={14} radius={14}>
            <Input
              label="نرخ هر ساعت (تومان) *"
              placeholder="مثال: ۱۵۰,۰۰۰"
              value={hourlyRate}
              onChangeText={(t) => {
                setHourlyRate(formatPriceInput(t));
                setErrors((p) => ({ ...p, price: '' }));
              }}
            />
          </Card>
        )}
        {errors.price && <p className="text-xs text-[#E53935]">{errors.price}</p>}

        {/* توضیحات */}
        <Input
          label="توضیحات *"
          placeholder="درباره لاین، تجهیزات، شرایط همکاری و مزایا بنویسید..."
          value={description}
          onChangeText={(t) => {
            if (t.length <= MAX_DESCRIPTION) {
              setDescription(t);
              setErrors((p) => ({ ...p, description: '' }));
            }
          }}
          multiline
          error={errors.description}
        />
        <CharCounter current={descLen} max={MAX_DESCRIPTION} />

        {/* شماره تماس */}
        <Input
          label="شماره تماس *"
          placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
          value={contactPhone}
          onChangeText={(t) => {
            const cleaned = t.replace(/[^0-9]/g, '');
            if (cleaned.length <= MAX_PHONE) {
              setContactPhone(cleaned);
              setErrors((p) => ({ ...p, contactPhone: '' }));
            }
          }}
          type="tel"
          maxLength={MAX_PHONE}
          error={errors.contactPhone}
        />

        {/* دکمه ثبت */}
        <Button
          title={isEditMode ? 'ذخیره تغییرات' : 'ثبت آگهی رایگان'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          iconPosition="right"
        />
      </div>
    </BottomSheet>
  );
}
