// src/components/manageBusiness/lineRental/CreateLineRentalAdSheet.jsx
'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Button from '@/components/common/Button';
import LineRentalBasicFields from './LineRentalBasicFields';
import CollabTypeSelector from './CollabTypeSelector';
import PercentPriceFields from './PercentPriceFields';
import FixedPriceFields from './FixedPriceFields';
import HourlyPriceFields from './HourlyPriceFields';
import { toPersianDigit, parseNumber, formatPriceInput } from '@/utils/numberUtils';
import { COLLAB_TYPES } from '@/constants/collabTypes';
import { SERVICE_CATEGORIES, getSubServicesByCategory } from '@/constants/serviceTypes';

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

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'عنوان آگهی الزامی است';
    } else if (title.trim().length > MAX_TITLE) {
      newErrors.title = `عنوان نمی‌تواند بیشتر از ${toPersianDigit(MAX_TITLE)} کاراکتر باشد`;
    }
    if (!categoryId) newErrors.categoryId = 'دسته‌بندی خدمات را انتخاب کنید';
    if (!subServiceId) newErrors.subServiceId = 'نوع خدمت را انتخاب کنید';
    if (!collabType) newErrors.collabType = 'نوع همکاری را انتخاب کنید';
    if (!description.trim()) {
      newErrors.description = 'توضیحات الزامی است';
    } else if (description.trim().length > MAX_DESCRIPTION) {
      newErrors.description = `توضیحات نمی‌تواند بیشتر از ${toPersianDigit(MAX_DESCRIPTION)} کاراکتر باشد`;
    }
    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'شماره تماس الزامی است';
    } else if (contactPhone.trim().length !== MAX_PHONE) {
      newErrors.contactPhone = `شماره تماس باید دقیقاً ${toPersianDigit(MAX_PHONE)} رقم باشد`;
    }
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

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isEditMode ? 'ویرایش آگهی لاین' : 'ثبت آگهی جدید لاین'}
      snapPoint={0.92}
    >
      <div className="space-y-6 pb-4">
        <LineRentalBasicFields
          title={title}
          categoryId={categoryId}
          subServiceId={subServiceId}
          description={description}
          contactPhone={contactPhone}
          errors={errors}
          onTitleChange={(t) => {
            if (t.length <= MAX_TITLE) setTitle(t);
            setErrors((p) => ({ ...p, title: '' }));
          }}
          onCategoryChange={(val) => {
            setCategoryId(val);
            setSubServiceId(null);
            setErrors((p) => ({ ...p, categoryId: '' }));
          }}
          onSubServiceChange={(val) => {
            setSubServiceId(val);
            setErrors((p) => ({ ...p, subServiceId: '' }));
          }}
          onDescriptionChange={(t) => {
            if (t.length <= MAX_DESCRIPTION) {
              setDescription(t);
              setErrors((p) => ({ ...p, description: '' }));
            }
          }}
          onContactPhoneChange={(t) => {
            const cleaned = t.replace(/[^0-9]/g, '');
            if (cleaned.length <= MAX_PHONE) {
              setContactPhone(cleaned);
              setErrors((p) => ({ ...p, contactPhone: '' }));
            }
          }}
        />

        <CollabTypeSelector
          collabType={collabType}
          onSelect={handleCollabChange}
          error={errors.collabType}
        />

        {collabType === 'percent' && (
          <PercentPriceFields
            percentSalon={percentSalon}
            percentPartner={percentPartner}
            onPercentSalonChange={handlePercentSalon}
            onPercentPartnerChange={handlePercentPartner}
          />
        )}

        {collabType === 'fixed' && (
          <FixedPriceFields
            fixedAmount={fixedAmount}
            fixedDeposit={fixedDeposit}
            onFixedAmountChange={(t) => {
              setFixedAmount(formatPriceInput(t));
              setErrors((p) => ({ ...p, price: '' }));
            }}
            onFixedDepositChange={(t) => setFixedDeposit(formatPriceInput(t))}
          />
        )}

        {collabType === 'hourly' && (
          <HourlyPriceFields
            hourlyRate={hourlyRate}
            onHourlyRateChange={(t) => {
              setHourlyRate(formatPriceInput(t));
              setErrors((p) => ({ ...p, price: '' }));
            }}
          />
        )}

        {errors.price && <p className="text-xs text-[#E53935]">{errors.price}</p>}

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
