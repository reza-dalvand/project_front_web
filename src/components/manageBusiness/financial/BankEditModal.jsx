// src/components/manageBusiness/financial/BankEditModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

const IRANIAN_BANKS = [
  { id: 'meli', label: 'بانک ملی ایران' },
  { id: 'mellat', label: 'بانک ملت' },
  { id: 'saman', label: 'بانک سامان' },
  { id: 'pasargad', label: 'بانک پاسارگاد' },
  { id: 'saderat', label: 'بانک صادرات ایران' },
  { id: 'tejarat', label: 'بانک تجارت' },
  { id: 'sepah', label: 'بانک سپه' },
  { id: 'keshavarzi', label: 'بانک کشاورزی' },
  { id: 'maskan', label: 'بانک مسکن' },
  { id: 'refah', label: 'بانک رفاه کارگران' },
  { id: 'parsian', label: 'بانک پارسیان' },
  { id: 'eghtesad', label: 'بانک اقتصاد نوین' },
  { id: 'karafarin', label: 'بانک کارآفرین' },
  { id: 'tosee', label: 'بانک توسعه صادرات' },
  { id: 'post_bank', label: 'پست بانک ایران' },
  { id: 'shahr', label: 'بانک شهر' },
];

export default function BankEditModal({
  visible,
  onClose,
  onSave,
  bankInfo,
  saving = false,
}) {
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    bank_name: '',
    bank_id: '',
    sheba: '',
    card_number: '',
    owner_name: '',
  });

  const [errors, setErrors] = useState({});

  // پر کردن فرم هنگام باز شدن
  useEffect(() => {
    if (visible && bankInfo) {
      setFormData({
        bank_name: bankInfo.bankName || '',
        bank_id: bankInfo.bankId || '',
        sheba: bankInfo.sheba || '',
        card_number: bankInfo.cardNumber || '',
        // ✅ نام صاحب حساب از مقادیر قبلی پر می‌شود،
        // ولی کاربر می‌تواند آن را تغییر دهد
        owner_name: bankInfo.ownerName || '',
      });
      setErrors({});
    }
  }, [visible, bankInfo]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleShebaChange = (text) => {
    let cleaned = toEnglishDigits(text).trim().toUpperCase();
    if (!cleaned.startsWith('IR') && cleaned.length > 0 && !cleaned.startsWith('I')) {
      cleaned = 'IR' + cleaned;
    }
    cleaned = cleaned.replace(/[^0-9IR]/g, '');
    if (cleaned.length <= 26) {
      updateField('sheba', cleaned);
    }
  };

  const handleCardChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 16) {
      updateField('card_number', cleaned);
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // ✅ نام صاحب حساب: فقط بررسی خالی نبودن
    // هیچ مقایسه‌ای با هیچ جای دیگری انجام نمی‌شود
    if (!formData.owner_name.trim()) {
      newErrors.owner_name = 'نام صاحب حساب الزامی است';
    }

    if (!formData.bank_name) {
      newErrors.bank_name = 'نام بانک را انتخاب کنید';
    }

    if (formData.sheba && !formData.sheba.startsWith('IR')) {
      newErrors.sheba = 'شماره شبا باید با IR شروع شود';
    }
    if (formData.sheba && formData.sheba.length !== 26) {
      newErrors.sheba = 'شماره شبا باید ۲۶ کاراکتر باشد (IR + ۲۴ رقم)';
    }

    if (formData.card_number && formData.card_number.length !== 16) {
      newErrors.card_number = 'شماره کارت باید ۱۶ رقم باشد';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave(formData);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <h3
            className="text-base"
            style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}
          >
            {bankInfo?.bankName ? 'ویرایش حساب بانکی' : 'ثبت حساب بانکی'}
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
          {/* ✅ نام صاحب حساب — دستی، بدون مقایسه */}
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: colors.textMain, fontFamily: 'Vazir-Medium' }}
            >
              نام صاحب حساب <span style={{ color: '#E53935' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.owner_name}
              onChange={(e) => updateField('owner_name', e.target.value)}
              placeholder="نام و نام خانوادگی صاحب حساب"
              className="w-full px-4 h-12 rounded-xl border-2 outline-none text-sm transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.owner_name ? '#E53935' : colors.border,
                color: colors.textMain,
                fontFamily: 'Vazir',
              }}
            />
            {errors.owner_name && (
              <p className="text-xs mt-1" style={{ color: '#E53935' }}>
                {errors.owner_name}
              </p>
            )}
          </div>

          {/* نام بانک */}
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: colors.textMain, fontFamily: 'Vazir-Medium' }}
            >
              نام بانک <span style={{ color: '#E53935' }}>*</span>
            </label>
            <select
              value={formData.bank_name}
              onChange={(e) => {
                const bank = IRANIAN_BANKS.find((b) => b.label === e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  bank_name: e.target.value,
                  bank_id: bank ? bank.id : '',
                }));
                if (errors.bank_name) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.bank_name;
                    return next;
                  });
                }
              }}
              className="w-full px-4 h-12 rounded-xl border-2 outline-none text-sm transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.bank_name ? '#E53935' : colors.border,
                color: colors.textMain,
                fontFamily: 'Vazir',
              }}
            >
              <option value="">انتخاب کنید...</option>
              {IRANIAN_BANKS.map((bank) => (
                <option key={bank.id} value={bank.label}>
                  {bank.label}
                </option>
              ))}
            </select>
            {errors.bank_name && (
              <p className="text-xs mt-1" style={{ color: '#E53935' }}>
                {errors.bank_name}
              </p>
            )}
          </div>

          {/* شماره شبا */}
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: colors.textMain, fontFamily: 'Vazir-Medium' }}
            >
              شماره شبا
            </label>
            <input
              type="text"
              value={formData.sheba}
              onChange={(e) => handleShebaChange(e.target.value)}
              placeholder="IR000000000000000000000000"
              dir="ltr"
              maxLength={26}
              className="w-full px-4 h-12 rounded-xl border-2 outline-none text-sm transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.sheba ? '#E53935' : colors.border,
                color: colors.textMain,
                fontFamily: 'Vazir',
                textAlign: 'left',
              }}
            />
            {errors.sheba && (
              <p className="text-xs mt-1" style={{ color: '#E53935' }}>
                {errors.sheba}
              </p>
            )}
          </div>

          {/* شماره کارت */}
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: colors.textMain, fontFamily: 'Vazir-Medium' }}
            >
              شماره کارت
            </label>
            <input
              type="text"
              value={formData.card_number ? toPersianDigit(formData.card_number) : ''}
              onChange={(e) => handleCardChange(e.target.value)}
              placeholder="۶۰۳۷۹۹۱۸۱۲۳۴۵۶۷۸"
              dir="ltr"
              maxLength={16}
              className="w-full px-4 h-12 rounded-xl border-2 outline-none text-sm transition-colors"
              style={{
                backgroundColor: colors.background,
                borderColor: errors.card_number ? '#E53935' : colors.border,
                color: colors.textMain,
                fontFamily: 'Vazir',
                textAlign: 'left',
              }}
            />
            {errors.card_number && (
              <p className="text-xs mt-1" style={{ color: '#E53935' }}>
                {errors.card_number}
              </p>
            )}
          </div>
        </div>

        {/* فوتر */}
        <div
          className="px-5 py-4 border-t flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3.5 rounded-2xl text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ backgroundColor: colors.primary, fontFamily: 'Vazir-Bold' }}
          >
            {saving ? 'در حال ثبت...' : 'ثبت اطلاعات'}
          </button>
        </div>
      </div>
    </div>
  );
}