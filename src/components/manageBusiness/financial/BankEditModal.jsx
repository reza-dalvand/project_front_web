// src/components/manageBusiness/financial/BankEditModal.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/stores/useThemeStore';
import BankEditHeader from './BankEditHeader';
import BankEditFormFields from './BankEditFormFields';
import BankEditFooter from './BankEditFooter';
import { toEnglishDigits } from '@/utils/numberUtils';
import { validateNationalId } from '@/utils/validators';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

export default function BankEditModal({ visible, onClose, onSave, bankInfo, businessOwnerName }) {
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

  const handleNationalIdChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      updateField('nationalId', cleaned);
    }
  };

  const handleShebaChange = (text) => {
    let val = text.trim().toUpperCase();
    if (!val.startsWith('IR') && val.length > 0 && !val.startsWith('I')) {
      val = 'IR' + val;
    }
    const cleaned = val.replace(/[^0-9IR]/g, '');
    if (cleaned.length <= 26) {
      updateField('sheba', cleaned);
    }
  };

  const handleCardChange = (text) => {
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length <= 16) {
      updateField('cardNumber', cleaned);
    }
  };

  const handleFieldChange = (key, val) => {
    if (key === 'nationalId') handleNationalIdChange(val);
    else if (key === 'sheba') handleShebaChange(val);
    else if (key === 'cardNumber') handleCardChange(val);
    else updateField(key, val);
  };

  const validate = () => {
    const e = {};
    if (!form.ownerName.trim() || form.ownerName.trim().length < 3) {
      e.ownerName = 'نام کامل صاحب حساب الزامی است';
    }
    const enNational = toEnglishDigits(form.nationalId).replace(/[^0-9]/g, '');
    if (enNational.length !== 10) {
      e.nationalId = 'کد ملی باید دقیقاً ۱۰ رقم باشد';
    } else if (!validateNationalId(enNational)) {
      e.nationalId = 'کد ملی وارد شده معتبر نیست';
    }
    if (!form.bankId) {
      e.bankId = 'لطفاً بانک را انتخاب کنید';
    }
    const enSheba = toEnglishDigits(form.sheba).trim().toUpperCase();
    if (!enSheba) {
      e.sheba = 'شماره شبا الزامی است';
    } else if (!enSheba.startsWith('IR')) {
      e.sheba = 'شماره شبا باید با IR شروع شود';
    } else {
      const digitsAfterIR = enSheba.slice(2).replace(/[^0-9]/g, '');
      if (digitsAfterIR.length !== 24) {
        e.sheba = 'شماره شبا باید IR + ۲۴ رقم باشد';
      }
    }
    const enCard = toEnglishDigits(form.cardNumber).replace(/[^0-9]/g, '');
    if (enCard.length !== 16) {
      e.cardNumber = 'شماره کارت باید دقیقاً ۱۶ رقم باشد';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
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
    ];
    const selectedBank = IRANIAN_BANKS.find((b) => b.id === form.bankId);
    if (
      confirm('آیا از صحت اطلاعات وارد شده مطمئن هستید؟ پس از ثبت، حساب وارد مرحله تایید می‌شود.')
    ) {
      onSave({
        ...form,
        bankName: selectedBank?.label || '',
      });
    }
  };

  if (!mounted || !visible) return null;

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
        <BankEditHeader onClose={onClose} />
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <BankEditFormFields
            form={form}
            errors={errors}
            businessOwnerName={businessOwnerName}
            onFieldChange={handleFieldChange}
          />
        </div>
        <BankEditFooter onClose={onClose} onSubmit={handleSubmit} />
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
