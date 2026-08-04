'use client';
import { useState, useEffect, useRef } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import { useTheme } from '@/stores/useThemeStore';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { toEnglishDigits } from '@/utils/numberUtils';
import { acquireScrollLock, releaseScrollLock } from '@/utils/scrollLock';

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
    sheba: '',
    cardNumber: '',
    accountNumber: '',
    bankName: '',
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
        sheba: bankInfo?.sheba || '',
        cardNumber: bankInfo?.cardNumber || '',
        accountNumber: bankInfo?.accountNumber || '',
        bankName: bankInfo?.bankName || '',
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

  // بستن با Escape
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

  const validate = () => {
    const e = {};

    const enNational = toEnglishDigits(form.nationalId).replace(/[^0-9]/g, '');
    if (enNational.length !== 10) {
      e.nationalId = 'کد ملی باید ۱۰ رقم باشد';
    }

    const enSheba = toEnglishDigits(form.sheba);
    const cleanedSheba = enSheba.replace(/IR|ir/gi, '').replace(/[^0-9]/g, '');
    if (cleanedSheba.length !== 24) {
      e.sheba = 'شماره شبا باید ۲۴ رقم بعد از IR باشد';
    }
    if (!enSheba.trim().toUpperCase().startsWith('IR')) {
      e.sheba = 'شماره شبا باید با IR شروع شود';
    }

    const enCard = toEnglishDigits(form.cardNumber).replace(/[^0-9]/g, '');
    if (enCard.length !== 16) {
      e.cardNumber = 'شماره کارت باید ۱۶ رقم باشد';
    }

    if (!form.ownerName.trim() || form.ownerName.trim().length < 3) {
      e.ownerName = 'نام کامل صاحب حساب الزامی است';
    }

    if (!form.bankName.trim()) {
      e.bankName = 'نام بانک الزامی است';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (confirm('آیا از صحت اطلاعات وارد شده مطمئن هستید؟ پس از ثبت، حساب وارد مرحله تایید می‌شود.')) {
      onSave(form);
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
        {/* هدر */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <h3 className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
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
            <p className="text-xs font-[Vazir] leading-[18px] flex-1" style={{ color: '#E53935' }}>
              صاحب حساب باید حتماً همان شخصی باشد که کد ملی‌اش در مرحله ثبت کسب‌وکار تایید شده است.
            </p>
          </div>

          <Input
            label="نام و نام خانوادگی کامل"
            placeholder="نام صاحب حساب"
            value={form.ownerName}
            onChangeText={(v) => updateField('ownerName', v)}
            error={errors.ownerName}
            hint={businessOwnerName ? `نام تایید شده احراز هویت: ${businessOwnerName}` : undefined}
          />

          <Input
            label="کد ملی صاحب حساب *"
            placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸۹"
            value={form.nationalId}
            onChangeText={(v) => updateField('nationalId', v)}
            error={errors.nationalId}
            maxLength={10}
          />

          <Input
            label="نام بانک *"
            placeholder="مثال: بانک ملی ایران"
            value={form.bankName}
            onChangeText={(v) => updateField('bankName', v)}
            error={errors.bankName}
          />

          <Input
            label="شماره شبا *"
            placeholder="IR010550000000101550500550555555555"
            value={form.sheba}
            onChangeText={(v) => updateField('sheba', v)}
            error={errors.sheba}
            hint="تسویه حساب‌های اصلی از طریق شماره شبا انجام می‌شود"
          />

          <Input
            label="شماره کارت *"
            placeholder="مثال: ۶۰۳۷ ۹۹۱۸ ۱۲۳۴ ۵۶۷۸"
            value={form.cardNumber}
            onChangeText={(v) => updateField('cardNumber', v)}
            error={errors.cardNumber}
            maxLength={16}
            hint="برای تشخیص حساب در گزارشات استفاده می‌شود"
          />

          <Input
            label="شماره حساب (اختیاری)"
            placeholder="در صورت داشتن وارد کنید"
            value={form.accountNumber}
            onChangeText={(v) => updateField('accountNumber', v)}
          />

          {/* نکات */}
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.background }}
          >
            <p className="text-xs font-[Vazir-Bold] mb-2" style={{ color: colors.textMain }}>
              نکات مهم:
            </p>
            <ul className="space-y-1.5">
              {[
                'تایید اطلاعات توسط کارشناسان حدود ۲۴ تا ۴۸ ساعت زمان می‌برد',
                'پس از تایید، تمامی بیعانه‌ها ظرف ۴۸ ساعت بعد از انجام خدمت واریز می‌شوند',
                'تغییر حساب بعداً هم ممکن است اما مجدداً وارد چرخه تایید خواهد شد',
                'تعداد دفعات تغییر اطلاعات بانکی محدود است',
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5" style={{ color: colors.primary }}>
                    •
                  </span>
                  <span className="text-[11px] leading-[18px]" style={{ color: colors.textSecondary }}>
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* فوتر */}
        <div className="p-5 border-t flex gap-3" style={{ borderColor: colors.border }}>
          <Button
            title="انصراف"
            onPress={onClose}
            variant="outline"
            size="lg"
            className="flex-1"
          />
          <Button
            title="ثبت اطلاعات حساب"
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