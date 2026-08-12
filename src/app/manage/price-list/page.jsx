// src/app/manage/price-list/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTag, FiEye, FiEyeOff, FiPlus, FiTrash2, FiInfo, FiEdit2 } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { usePriceListStore } from '@/stores/usePriceListStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import Header from '@/components/common/Header';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import SectionHeader from '@/components/common/SectionHeader';
import PriceListMenu from '@/components/priceList/PriceListMenu';
import { PRICE_LIST_THEMES } from '@/data/priceList';
import { toPersianDigit, toEnglishDigits } from '@/utils/numberUtils';

export default function ManagePriceListPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth({ redirectToLogin: true });
  const { showToast } = useToast();
  const businessData = useBusinessStore((s) => s.businessData);
  const businessId = businessData?.id || 'biz_1';

  const list = usePriceListStore((s) => s.lists[businessId]);
  const ensureList = usePriceListStore((s) => s.ensureList);
  const setTheme = usePriceListStore((s) => s.setTheme);
  const togglePublish = usePriceListStore((s) => s.togglePublish);
  const addNote = usePriceListStore((s) => s.addNote);
  const deleteNote = usePriceListStore((s) => s.deleteNote);

  useEffect(() => {
    ensureList(businessId);
  }, [businessId, ensureList]);

  const [noteLabel, setNoteLabel] = useState('');
  const [noteMin, setNoteMin] = useState('');
  const [noteMax, setNoteMax] = useState('');

  const settings = list || { themeId: 'classic', isPublished: false, notes: [] };
  const services = businessData?.services || [];

  const handleTogglePublish = () => {
    const next = togglePublish(businessId);
    showToast(
      next
        ? '✓ لیست قیمت منتشر شد و در صفحه کسب‌وکار نمایش داده می‌شود'
        : 'لیست قیمت از صفحه کسب‌وکار مخفی شد',
      next ? 'success' : 'info'
    );
  };

  const handleAddNote = () => {
    const min = parseInt(toEnglishDigits(noteMin).replace(/[^0-9]/g, ''), 10) || 0;
    const max = parseInt(toEnglishDigits(noteMax).replace(/[^0-9]/g, ''), 10) || 0;
    if (!noteLabel.trim()) {
      showToast('عنوان یادداشت را وارد کنید', 'warning');
      return;
    }
    if (!max || max < min) {
      showToast('بازه قیمتی معتبر وارد کنید (از ≤ تا)', 'warning');
      return;
    }
    addNote(businessId, { label: noteLabel.trim(), min, max });
    setNoteLabel('');
    setNoteMin('');
    setNoteMax('');
    showToast('یادداشت اضافه شد', 'success');
  };

  if (!isAuthenticated) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: colors.textMain }}>در حال بارگذاری...</p>
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padding={0}>
      <Header title="لیست قیمت خدمات" onBackPress={() => router.push('/manage')} />
      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-5">
        {/* ═══ انتشار / مخفی ═══ */}
        <Card variant="elevated" padding={16} radius={18}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: settings.isPublished ? '#43A04718' : colors.border + '40',
              }}
            >
              {settings.isPublished ? (
                <FiEye size={20} color="#43A047" />
              ) : (
                <FiEyeOff size={20} style={{ color: colors.textSecondary }} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
                انتشار لیست قیمت
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>
                {settings.isPublished
                  ? 'در تب «قیمت‌ها» صفحه کسب‌وکار نمایش داده می‌شود'
                  : 'فعلاً فقط خودتان در پیش‌نمایش می‌بینید'}
              </p>
            </div>
            <button
              onClick={handleTogglePublish}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: settings.isPublished ? '#43A047' : colors.border }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all"
                style={{
                  backgroundColor: '#fff',
                  [settings.isPublished ? 'right' : 'left']: '2px',
                }}
              />
            </button>
          </div>
        </Card>

        {/* ═══ انتخاب تم ═══ */}
        <div>
          <SectionHeader
            icon={<FiTag size={18} />}
            iconColor="#E91E63"
            title="تم ظاهری منو"
            subtitle="رنگ‌بندی کارت قیمت را انتخاب کنید"
          />
          <div className="grid grid-cols-2 gap-2.5">
            {PRICE_LIST_THEMES.map((t) => {
              const selected = settings.themeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(businessId, t.id)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: selected ? t.accent : colors.border,
                    backgroundColor: selected ? t.accent + '10' : colors.cardBackground,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: t.bg, border: `1.5px solid ${t.border}` }}
                  >
                    {t.emoji}
                  </div>
                  <span
                    className="text-xs font-[Vazir-Bold] flex-1 text-right"
                    style={{ color: selected ? t.accent : colors.textMain }}
                  >
                    {t.label}
                  </span>
                  {selected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: t.accent }}
                    >
                      <span className="text-[10px] text-white">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ یادداشت‌های بازه قیمتی ═══ */}
        <div>
          <SectionHeader
            icon={<FiInfo size={18} />}
            iconColor="#FF9800"
            title="یادداشت‌های قیمتی"
            subtitle="موارد با بازه قیمت (مثل ناخن شکسته، تغییر فرم و...)"
          />
          {settings.notes.length > 0 && (
            <Card variant="elevated" padding={12} radius={14} className="mb-3">
              <div className="flex flex-col gap-2">
                {settings.notes.map((n) => (
                  <div key={n.id} className="flex items-center gap-2">
                    <span className="text-xs flex-1" style={{ color: colors.textMain }}>
                      {n.label}
                    </span>
                    <span className="text-xs font-[Vazir-Bold]" style={{ color: colors.primary }}>
                      {toPersianDigit(n.min)} تا {toPersianDigit(n.max)}
                    </span>
                    <button
                      onClick={() => deleteNote(businessId, n.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#E5393515' }}
                    >
                      <FiTrash2 size={14} color="#E53935" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card variant="elevated" padding={14} radius={16}>
            <Input
              label="عنوان یادداشت"
              placeholder="مثال: ناخن شکسته"
              value={noteLabel}
              onChangeText={setNoteLabel}
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  label="از (هزار تومان)"
                  placeholder="۲۵"
                  value={noteMin}
                  onChangeText={setNoteMin}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="تا (هزار تومان)"
                  placeholder="۳۵"
                  value={noteMax}
                  onChangeText={setNoteMax}
                />
              </div>
            </div>
            <Button
              title="افزودن یادداشت"
              onPress={handleAddNote}
              variant="outline"
              size="md"
              fullWidth
              icon={<FiPlus size={16} style={{ color: colors.primary }} />}
              iconPosition="right"
            />
          </Card>
        </div>

        {/* ═══ پیش‌نمایش زنده ═══ */}
        <div>
          <SectionHeader
            icon={<FiEye size={18} />}
            iconColor="#43A047"
            title="پیش‌نمایش زنده"
            subtitle="دقیقاً همان چیزی که مشتری می‌بیند"
          />
          <PriceListMenu
            businessName={businessData?.name}
            businessLogo={businessData?.logo}
            services={services}
            settings={settings}
          />
        </div>

        {/* ═══ راهنمای قیمت‌ها ═══ */}
        <Card
          variant="default"
          padding={14}
          radius={14}
          className="border"
          style={{ borderColor: colors.primary + '30', backgroundColor: colors.primary + '08' }}
        >
          <div className="flex items-start gap-2.5">
            <FiEdit2 size={16} style={{ color: colors.primary }} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-[Vazir-Bold] mb-1" style={{ color: colors.textMain }}>
                قیمت آیتم‌ها از بخش «خدمات» خوانده می‌شود
              </p>
              <p className="text-[11px] leading-5 mb-2" style={{ color: colors.textSecondary }}>
                برای تغییر قیمت هر خدمت، به مدیریت خدمات مراجعه کنید. قیمت‌ها در منو به صورت هزار
                تومان نمایش داده می‌شوند (۶۵۰ = ۶۵۰,۰۰۰ تومان).
              </p>
              <button
                onClick={() => router.push('/manage/services')}
                className="text-[11px] font-[Vazir-Bold] underline"
                style={{ color: colors.primary }}
              >
                مدیریت خدمات و قیمت‌ها
              </button>
            </div>
          </div>
        </Card>
      </div>
    </ScreenWrapper>
  );
}
