'use client';
import { useState, useEffect, useRef } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
import { toEnglishDigits, toPersianDigit } from '@/utils/numberUtils';
import { validateNationalId } from '@/utils/validators';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

// ═══════ لیست بانک‌های ایرانی ═══════
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
  { id: 'ansar', label: 'بانک انصار' },
  { id: 'gardeshgari', label: 'بانک گردشگری' },
  { id: 'ayandeh', label: 'بانک آینده' },
  { id: 'shahr', label: 'بانک شهر' },
  { id: 'sina', label: 'بانک سینا' },
  { id: 'day', label: 'بانک دی' },
  { id: 'karafarin', label: 'بانک کارآفرین' },
  { id: 'tosee', label: 'بانک توسعه صادرات' },
];

export default function BankEditModal({
  visible,
  onClose,
  onSave,
  bankInfo,
  businessOwnerName,
}) {
  const { colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const instanceId = useRef('bank-edit-modal');

  const [form, setForm] = useState({
    ownerName: '',
    nationalId: '',
    bankId: null,
    sheba: '',
    cardNumber: '',
    accountNumber: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      releaseScrollLock(instanceId.current);
    };
  }, []);

  // ✅ مقداردهی اولیه فرم
  useEffect(() => {
    if (visible) {
      setForm({
        ownerName: bankInfo?.ownerName || businessOwnerName || '',
        nationalId: bankInfo?.nationalId || '',
        bankId: bankInfo?.bankId || null,
        sheba: bankInfo?.sheba || '',
        cardNumber: bankInfo?.cardNumber || '',
        accountNumber: bankInfo?.accountNumber || '',
      });
      setErrors({});
      acquireScrollLock(instanceId.current);
    } else {
      releaseScrollLock(instanceId.current);
    }
    return () => {
      releaseScrollLock(instanceId.current);
    };
  }, [visible, bankInfo, businessOwnerName]);

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  const updateField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ✅ هندلر کد ملی — فقط عدد، حداکثر 10 رقم
  const handleNationalIdChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      updateField('nationalId', cleaned);
    }
  };

  // ✅ هندلر شبا — IR + حداکثر 24 رقم
  const handleShebaChange = (text) => {
    let val = text.trim().toUpperCase();
    // اگر با IR شروع نمی‌شود، خودکار اضافه کن
    if (!val.startsWith('IR') && val.length > 0 && !val.startsWith('I')) {
      val = 'IR' + val;
    }
    // فقط IR + اعداد مجاز هستند
    const cleaned = val.replace(/[^0-9IR]/g, '');
    // حداکثر IR + 24 رقم = 26 کاراکتر
    if (cleaned.length <= 26) {
      updateField('sheba', cleaned);
    }
  };

  // ✅ هندلر شماره کارت — فقط عدد، حداکثر 16 رقم
  const handleCardChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 16) {
      updateField('cardNumber', cleaned);
    }
  };

  // ✅ اعتبارسنجی — اصلاح شده
  const validate = () => {
    const e = {};

    // نام صاحب حساب
    if (!form.ownerName.trim() || form.ownerName.trim().length < 3) {
      e.ownerName = 'نام کامل صاحب حساب الزامی است';
    }

    // کد ملی
    const enNational = toEnglishDigits(form.nationalId).replace(/[^0-9]/g, '');
    if (enNational.length !== 10) {
      e.nationalId = 'کد ملی باید دقیقاً ۱۰ رقم باشد';
    } else if (!validateNationalId(enNational)) {
      e.nationalId = 'کد ملی وارد شده معتبر نیست';
    }

    // بانک
    if (!form.bankId) {
      e.bankId = 'لطفاً بانک را انتخاب کنید';
    }

    // شبا
    const enSheba = toEnglishDigits(form.sheba).trim().toUpperCase();
    if (!enSheba) {
      e.sheba = 'شماره شبا الزامی است';
    } else if (!enSheba.startsWith('IR')) {
      e.sheba = 'شماره شبا باید با IR شروع شود';
    } else {
      const digitsAfterIR = enSheba.slice(2).replace(/[^0-9]/g, '');
      if (digitsAfterIR.length !== 24) {
        e.sheba = `شماره شبا باید IR + ۲۴ رقم باشد (${toPersianDigit(digitsAfterIR.length)} از ۲۴ رقم وارد شده)`;
      }
    }

    // شماره کارت
    const enCard = toEnglishDigits(form.cardNumber).replace(/[^0-9]/g, '');
    if (enCard.length !== 16) {
      e.cardNumber = 'شماره کارت باید دقیقاً ۱۶ رقم باشد';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const selectedBank = IRANIAN_BANKS.find((b) => b.id === form.bankId);

    if (
      confirm(
        'آیا از صحت اطلاعات وارد شده مطمئن هستید؟ پس از ثبت، حساب وارد مرحله تایید می‌شود.'
      )
    ) {
      onSave({
        ...form,
        bankName: selectedBank?.label || '',
      });
    }
  };

  if (!mounted || !visible) return null;

  // شمارنده رقم شبا
  const shebaDigits = toEnglishDigits(form.sheba)
    .toUpperCase()
    .replace('IR', '')
    .replace(/[^0-9]/g, '');

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: colors.cardBackground,
          borderTop: `1px solid ${colors.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h3
            className="text-base font-[Vazir-Bold]"
            style={{ color: colors.textMain }}
          >
            ثبت حساب بانکی تسویه
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <FiX size={20} style={{ color: colors.textMain }} />
          </button>
        </div>

        {/* فرم */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* هشدار مهم */}
          <div
            className="flex items-start gap-3 p-3.5 rounded-xl border"
            style={{
              backgroundColor: '#E5393510',
              borderColor: '#E5393530',
            }}
          >
            <span className="text-lg flex-shrink-0">⚠️</span>
            <p
              className="text-xs font-[Vazir] leading-[18px] flex-1"
              style={{ color: '#E53935' }}
            >
              صاحب حساب باید حتماً همان شخصی باشد که کد ملی‌اش در مرحله ثبت کسب‌وکار
              تایید شده است.
            </p>
          </div>

          {/* نام صاحب حساب */}
          <Input
            label="نام و نام خانوادگی کامل *"
            placeholder="مثال: مریم حسینی"
            value={form.ownerName}
            onChangeText={(v) => updateField('ownerName', v)}
            error={errors.ownerName}
            hint={
              businessOwnerName
                ? `نام تایید شده احراز هویت: ${businessOwnerName}`
                : undefined
            }
          />

          {/* کد ملی — ✅ اصلاح شده */}
          <Input
            label="کد ملی صاحب حساب *"
            placeholder="مثال: 0012345679"
            value={toPersianDigit(form.nationalId)}
            onChangeText={handleNationalIdChange}
            error={errors.nationalId}
            type="tel"
            maxLength={10}
            hint={`${toPersianDigit(form.nationalId.length)} از ۱۰ رقم`}
          />

          {/* ✅ نام بانک — Dropdown */}
          <div>
            <Dropdown
              label="نام بانک *"
              placeholder="بانک را انتخاب کنید"
              value={form.bankId}
              options={IRANIAN_BANKS}
              onSelect={(val) => {
                updateField('bankId', val);
              }}
            />
            {errors.bankId && (
              <div className="flex items-center gap-1 mt-[-8px] mb-2 px-1">
                <span className="text-xs font-[Vazir]" style={{ color: '#E53935' }}>
                  {errors.bankId}
                </span>
              </div>
            )}
          </div>

          {/* شماره شبا — ✅ اصلاح شده */}
          <Input
            label="شماره شبا *"
            placeholder="IR + ۲۴ رقم (مثال: IR062960000000100324200001)"
            value={form.sheba}
            onChangeText={handleShebaChange}
            error={errors.sheba}
            maxLength={26}
            hint={
              <span style={{ direction: 'ltr', display: 'inline-block' }}>
                {toPersianDigit(shebaDigits.length)} از ۲۴ رقم بعد از IR
              </span>
            }
          />

          {/* شماره کارت — ✅ اصلاح شده */}
          <Input
            label="شماره کارت *"
            placeholder="مثال: 6037991812345678"
            value={toPersianDigit(form.cardNumber)}
            onChangeText={handleCardChange}
            error={errors.cardNumber}
            type="tel"
            maxLength={16}
            hint={`${toPersianDigit(form.cardNumber.length)} از ۱۶ رقم`}
          />

          {/* شماره حساب (اختیاری) */}
          {/* <Input
            label="شماره حساب (اختیاری)"
            placeholder="در صورت داشتن وارد کنید"
            value={form.accountNumber}
            onChangeText={(v) => updateField('accountNumber', v)}
          /> */}

          {/* نکات */}
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.background }}
          >
            <p
              className="text-xs font-[Vazir-Bold] mb-2"
              style={{ color: colors.textMain }}
            >
              نکات مهم:
            </p>
            <ul className="space-y-1.5">
              {[
                'تایید اطلاعات توسط کارشناسان حدود ۲۴ تا ۴۸ ساعت زمان می‌برد',
                'پس از تایید، تمامی بیعانه‌ها ظرف ۴۸ ساعت بعد از انجام خدمت واریز می‌شوند',
                'تغییر حساب بعداً هم ممکن است اما مجدداً وارد چرخه تایید خواهد شد',
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="text-xs mt-0.5"
                    style={{ color: colors.primary }}
                  >
                    •
                  </span>
                  <span
                    className="text-[11px] leading-[18px]"
                    style={{ color: colors.textSecondary }}
                  >
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* فوتر */}
        <div
          className="p-5 border-t flex gap-3"
          style={{ borderColor: colors.border }}
        >
          <Button
            title="انصراف"
            onPress={onClose}
            variant="outline"
            size="lg"
            className="flex-1"
          />
          <Button
            title="ثبت اطلاعات"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            icon={<FiSave size={18} color="#fff" />}
            iconPosition="right"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}