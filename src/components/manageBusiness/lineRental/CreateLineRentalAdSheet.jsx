'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import BottomSheet from '@/components/common/BottomSheet';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import CharCounter from '@/components/common/CharCounter';
import { toPersianDigit, parseNumber, formatPriceInput } from '@/utils/numberUtils';
import { SERVICE_TYPES, COLLAB_TYPES, LIMITS } from '@/constants';

const MAX_DESC = LIMITS.MAX_DESCRIPTION_LENGTH;

export default function CreateLineRentalAdSheet({ visible, onClose, onSave, editingAd }) {
  const { colors } = useTheme();
  const isEditMode = !!editingAd;

  const [title, setTitle] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState(null);
  const [collabType, setCollabType] = useState(null);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [percentSalon, setPercentSalon] = useState('');
  const [percentPartner, setPercentPartner] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedDeposit, setFixedDeposit] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    if (visible) {
      if (editingAd) {
        setTitle(editingAd.title || '');
        setServiceTypeId(editingAd.serviceTypeId || null);
        setCollabType(editingAd.collabType || null);
        setDescription((editingAd.description || '').slice(0, MAX_DESC));
        setPercentSalon(editingAd.percentSalon ? String(editingAd.percentSalon) : '');
        setPercentPartner(editingAd.percentPartner ? String(editingAd.percentPartner) : '');
        setFixedAmount(editingAd.fixedAmount ? formatPriceInput(String(editingAd.fixedAmount)) : '');
        setFixedDeposit(editingAd.fixedDeposit ? formatPriceInput(String(editingAd.fixedDeposit)) : '');
        setHourlyRate(editingAd.hourlyRate ? formatPriceInput(String(editingAd.hourlyRate)) : '');
      } else {
        setTitle(''); setServiceTypeId(null); setCollabType(null); setDescription('');
        setPercentSalon(''); setPercentPartner(''); setFixedAmount(''); setFixedDeposit(''); setHourlyRate('');
      }
      setErrors({});
    }
  }, [visible, editingAd]);

  const handleCollabChange = (id) => {
    setCollabType(id);
    setPercentSalon(''); setPercentPartner(''); setFixedAmount(''); setFixedDeposit(''); setHourlyRate('');
    setErrors(p => ({ ...p, collabType: '', price: '' }));
  };

  const handlePercentSalon = (t) => {
    setPercentSalon(t);
    const n = parseNumber(t);
    if (n > 0 && n <= 100) setPercentPartner(String(100 - n));
    else setPercentPartner('');
    setErrors(p => ({ ...p, price: '' }));
  };

  const handlePercentPartner = (t) => {
    setPercentPartner(t);
    const n = parseNumber(t);
    if (n > 0 && n <= 100) setPercentSalon(String(100 - n));
    else setPercentSalon('');
    setErrors(p => ({ ...p, price: '' }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'عنوان آگهی الزامی است';
    if (title.trim().length > 0 && title.trim().length < 5) newErrors.title = 'عنوان باید حداقل ۵ کاراکتر باشد';
    if (!serviceTypeId) newErrors.serviceTypeId = 'نوع خدمت را انتخاب کنید';
    if (!collabType) newErrors.collabType = 'نوع همکاری را انتخاب کنید';
    if (!description.trim()) newErrors.description = 'توضیحات الزامی است';
    if (description.trim().length > 0 && description.trim().length < 20) newErrors.description = 'توضیحات باید حداقل ۲۰ کاراکتر باشد';

    let priceData = {};
    let priceDisplay = '';
    if (collabType === 'percent') {
      const s = parseNumber(percentSalon), p = parseNumber(percentPartner);
      if (!s || !p) newErrors.price = 'درصد سالن و همکار را وارد کنید';
      else if (s + p !== 100) newErrors.price = 'مجموع درصدها باید ۱۰۰٪ باشد';
      else { priceData = { percentSalon: s, percentPartner: p }; priceDisplay = `${toPersianDigit(s)}-${toPersianDigit(p)}`; }
    } else if (collabType === 'fixed') {
      const f = parseNumber(fixedAmount);
      if (!f) newErrors.price = 'مبلغ اجاره ماهانه را وارد کنید';
      else {
        priceData = { fixedAmount: f, fixedDeposit: parseNumber(fixedDeposit) };
        priceDisplay = parseNumber(fixedDeposit) > 0
          ? `${toPersianDigit(f.toLocaleString('en-US'))} + ${toPersianDigit(parseNumber(fixedDeposit).toLocaleString('en-US'))} رهن`
          : `${toPersianDigit(f.toLocaleString('en-US'))} تومان`;
      }
    } else if (collabType === 'hourly') {
      const h = parseNumber(hourlyRate);
      if (!h) newErrors.price = 'نرخ ساعتی را وارد کنید';
      else { priceData = { hourlyRate: h }; priceDisplay = `${toPersianDigit(h.toLocaleString('en-US'))} / ساعت`; }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const collab = COLLAB_TYPES.find(c => c.id === collabType);
    const svc = SERVICE_TYPES.find(s => s.id === serviceTypeId);
    onSave({
      id: editingAd?.id || `lr_${Date.now()}`,
      title: title.trim(),
      serviceTypeId,
      serviceTypeName: svc?.label || '',
      collabType,
      collabLabel: collab?.label,
      ...priceData,
      priceDisplay,
      description: description.trim(),
      status: 'active',
    });
    onClose();
  };

  const descLen = description.length;

  return (
    <BottomSheet visible={visible} onClose={onClose} title={isEditMode ? 'ویرایش آگهی لاین' : 'ثبت آگهی جدید لاین'} snapPoint={0.92}>
      <div className="space-y-6 pb-4">
        {/* عنوان */}
        <Input
          label="عنوان آگهی *"
          placeholder="مثال: لاین ناخن با تجهیزات کامل"
          value={title}
          onChangeText={t => { setTitle(t); setErrors(p => ({ ...p, title: '' })); }}
          error={errors.title}
        />

        {/* نوع خدمت */}
        <Dropdown
          label="نوع خدمت لاین *"
          placeholder="نوع خدمت را انتخاب کنید"
          value={serviceTypeId}
          options={SERVICE_TYPES.map(s => ({ id: s.id, label: s.label }))}
          onSelect={v => { setServiceTypeId(v); setErrors(p => ({ ...p, serviceTypeId: '' })); }}
        />
        {errors.serviceTypeId && <p className="text-xs" style={{ color: '#E53935' }}>{errors.serviceTypeId}</p>}

        {/* نوع همکاری */}
        <div>
          <p className="text-sm font-[Vazir-Medium] mb-3" style={{ color: colors.textMain }}>نوع همکاری *</p>
          <div className="flex gap-2">
            {COLLAB_TYPES.map(ct => {
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
                  <span className="text-sm font-[Vazir-Bold]" style={{ color: isSel ? ct.color : colors.textMain }}>{ct.label}</span>
                  <span className="text-[10px] leading-4" style={{ color: colors.textSecondary }}>{ct.hint}</span>
                </button>
              );
            })}
          </div>
          {errors.collabType && <p className="text-xs mt-2" style={{ color: '#E53935' }}>{errors.collabType}</p>}
        </div>

        {/* فیلدهای قیمت بر اساس نوع همکاری */}
        {collabType === 'percent' && (
          <Card variant="default" padding={14} radius={14}>
            <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>درصد سالن و همکار را وارد کنید (مجموع باید ۱۰۰٪ باشد)</p>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: colors.primary }}>سهم سالن</label>
                <Input placeholder="۴۰" value={percentSalon} onChangeText={handlePercentSalon} />
              </div>
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: '#9C27B0' }}>سهم همکار</label>
                <Input placeholder="۶۰" value={percentPartner} onChangeText={handlePercentPartner} />
              </div>
            </div>
            {parseNumber(percentSalon) > 0 && (
              <div
                className="flex items-center gap-2 mt-3 p-2.5 rounded-lg border"
                style={{
                  backgroundColor: parseNumber(percentSalon) + parseNumber(percentPartner) === 100 ? '#4CAF5010' : '#FF980010',
                  borderColor: parseNumber(percentSalon) + parseNumber(percentPartner) === 100 ? '#4CAF5040' : '#FF980040',
                }}
              >
                <span className="text-xs" style={{ color: parseNumber(percentSalon) + parseNumber(percentPartner) === 100 ? '#4CAF50' : '#FF9800' }}>
                  {parseNumber(percentSalon) + parseNumber(percentPartner) === 100
                    ? `✓ مجموع: ۱۰۰٪`
                    : `مجموع: ${toPersianDigit(parseNumber(percentSalon) + parseNumber(percentPartner))}٪`}
                </span>
              </div>
            )}
          </Card>
        )}
        {collabType === 'fixed' && (
          <Card variant="default" padding={14} radius={14}>
            <Input label="مبلغ اجاره ماهانه (تومان) *" placeholder="مثال: ۵,۰۰۰,۰۰۰" value={fixedAmount} onChangeText={t => { setFixedAmount(formatPriceInput(t)); setErrors(p => ({ ...p, price: '' })); }} />
            <Input label="مبلغ رهن (اختیاری)" placeholder="مثال: ۲۰,۰۰۰,۰۰۰ یا خالی" value={fixedDeposit} onChangeText={t => { setFixedDeposit(formatPriceInput(t)); setErrors(p => ({ ...p, price: '' })); }} />
          </Card>
        )}
        {collabType === 'hourly' && (
          <Card variant="default" padding={14} radius={14}>
            <Input label="نرخ هر ساعت (تومان) *" placeholder="مثال: ۱۵۰,۰۰۰" value={hourlyRate} onChangeText={t => { setHourlyRate(formatPriceInput(t)); setErrors(p => ({ ...p, price: '' })); }} />
          </Card>
        )}
        {errors.price && <p className="text-xs" style={{ color: '#E53935' }}>{errors.price}</p>}

        {/* توضیحات */}
        <Input
          label="توضیحات *"
          placeholder="درباره لاین، تجهیزات، شرایط همکاری و مزایا بنویسید..."
          value={description}
          onChangeText={t => { if (t.length <= MAX_DESC) { setDescription(t); setErrors(p => ({ ...p, description: '' })); } }}
          multiline
          error={errors.description}
        />
        <CharCounter current={descLen} max={MAX_DESC} />

        {/* دکمه ثبت */}
        <Button
          title={isEditMode ? 'ذخیره تغییرات' : 'ثبت آگهی رایگان'}
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          icon={<FiCheck size={18} color="#fff" />}
          iconPosition="right"
        />
      </div>
    </BottomSheet>
  );
}