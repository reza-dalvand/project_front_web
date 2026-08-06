'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiPhone,
  FiCheck,
  FiX,
  FiUsers,
  FiChevronLeft,
} from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import BottomSheet from '@/components/common/BottomSheet';
import Avatar from '@/components/common/Avatar';
import { toPersianDigit } from '@/utils/numberUtils';
import { validatePhone } from '@/utils/phoneUtils';

/**
 * کامپوننت مدیریت تیم
 * @param {array} team - لیست اعضای تیم
 * @param {array} services - لیست خدمات
 * @param {function} onChange - تابع تغییر لیست تیم
 */
export default function TeamManagement({ team = [], services = [], onChange }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // فرم
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);

  // خدمات فعال
  const availableServices = useMemo(
    () => (services || []).filter((s) => s && s.id && s.isActive !== false),
    [services]
  );

  const resetForm = () => {
    setName('');
    setPhone('');
    setSelectedServices([]);
    setErrors({});
    setEditingId(null);
    setModalStep(1);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (member) => {
    setName(member.name);
    setPhone(member.phone);
    setSelectedServices(member.services || []);
    setEditingId(member.id);
    setModalStep(1);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const goToNextStep = () => {
    const newErrors = {};
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'نام باید حداقل ۳ کاراکتر باشد';
    }
    if (!validatePhone(phone)) {
      newErrors.phone = 'شماره موبایل معتبر نیست';
    }
    if (team.some((m) => m.phone === phone && m.id !== editingId)) {
      newErrors.phone = 'این شماره قبلاً ثبت شده';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setModalStep(2);
    }
  };

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const saveMember = () => {
    const memberData = {
      id: editingId || `team_${Date.now()}`,
      name: name.trim(),
      phone,
      services: selectedServices,
    };
    const updated = editingId
      ? team.map((m) => (m.id === editingId ? memberData : m))
      : [...team, memberData];
    onChange?.(updated);
    closeModal();
  };

  const handleDelete = (member) => {
    if (confirm(`آیا از حذف "${member.name}" مطمئن هستید؟`)) {
      onChange?.(team.filter((m) => m.id !== member.id));
    }
  };

  const getServiceName = (id) => services.find((s) => s.id === id)?.name || 'خدمت';

  return (
    <div className="flex flex-col gap-4">
      {/* هدر */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FiUsers size={20} style={{ color: colors.primary }} />
          <span className="text-base font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            اعضای تیم
          </span>
        </div>
        <span className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
          {toPersianDigit(team.length)} کارمند
        </span>
      </div>

      {/* لیست تیم یا Empty State */}
      {team.length > 0 ? (
        <div className="flex flex-col gap-3">
          {team.map((member) => (
            <Card key={member.id} variant="elevated" padding={14} radius={18}>
              <div className="flex items-center gap-3">
                <Avatar name={member.name} size="md" showBorder />
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-[Vazir-Bold] truncate"
                    style={{ color: colors.textMain }}
                  >
                    {member.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    <FiPhone size={12} color={colors.textSecondary} />
                    <span className="text-xs font-[Vazir]" style={{ color: colors.textSecondary }}>
                      {toPersianDigit(member.phone)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary + '15' }}
                  >
                    <FiEdit2 size={16} style={{ color: colors.primary }} />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#E5393515]"
                  >
                    <FiTrash2 size={16} color="#E53935" />
                  </button>
                </div>
              </div>

              {/* خدمات اختصاص‌یافته */}
              {member.services?.length > 0 && (
                <div
                  className="mt-3 pt-3 border-t flex flex-wrap gap-1.5"
                  style={{ borderColor: colors.border }}
                >
                  {member.services.map((sId) => (
                    <span
                      key={sId}
                      className="text-[10px] font-[Vazir-Bold] px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: colors.primary + '15',
                        color: colors.primary,
                      }}
                    >
                      {getServiceName(sId)}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="default" padding={6} radius={16}>
          <EmptyState
            icon="👥"
            title="هنوز کارمندی اضافه نکرده‌اید"
            description="با افزودن اعضای تیم، می‌توانید خدمات را به هر کارمند اختصاص دهید"
            actionLabel="افزودن اولین کارمند"
            onAction={openAddModal}
          />
        </Card>
      )}

      {/* دکمه افزودن کارمند جدید */}
      {team.length > 0 && (
        <Button
          title="افزودن کارمند جدید"
          onPress={openAddModal}
          variant="outline"
          size="lg"
          fullWidth
          icon={<FiPlus size={20} style={{ color: colors.primary }} />}
          iconPosition="right"
        />
      )}

      {/* BottomSheet افزودن/ویرایش کارمند */}
      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'ویرایش کارمند' : 'افزودن کارمند جدید'}
        snapPoint={0.85}
        footer={
          modalStep === 1 ? (
            <Button
              title="مرحله بعد"
              onPress={goToNextStep}
              variant="primary"
              size="lg"
              fullWidth
              icon={<FiChevronLeft size={18} color="#fff" />}
              iconPosition="right"
            />
          ) : (
            <div className="flex gap-3">
              <Button
                title="قبلی"
                onPress={() => setModalStep(1)}
                variant="outline"
                size="lg"
                className="flex-1"
              />
              <Button
                title={editingId ? 'ذخیره تغییرات' : 'افزودن کارمند'}
                onPress={saveMember}
                variant="primary"
                size="lg"
                className="flex-1"
                icon={<FiCheck size={18} color="#fff" />}
                iconPosition="right"
              />
            </div>
          )
        }
      >
        <div className="p-4 pb-24">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {['اطلاعات', 'خدمات'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                    style={{
                      backgroundColor:
                        modalStep > i
                          ? colors.primary
                          : modalStep === i + 1
                            ? colors.primary + '20'
                            : colors.cardBackground,
                      borderColor: modalStep >= i + 1 ? colors.primary : colors.border,
                    }}
                  >
                    {modalStep > i + 1 ? (
                      <FiCheck size={14} color="#fff" />
                    ) : (
                      <span
                        className="text-xs font-[Vazir-Bold]"
                        style={{
                          color: modalStep === i + 1 ? colors.primary : colors.textSecondary,
                        }}
                      >
                        {toPersianDigit(i + 1)}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-[Vazir]"
                    style={{
                      color: modalStep >= i + 1 ? colors.textMain : colors.textSecondary,
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < 1 && (
                  <div
                    className="w-12 h-0.5 mb-5 rounded-full"
                    style={{
                      backgroundColor: modalStep > i + 1 ? colors.primary : colors.border,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* مرحله ۱: اطلاعات کارمند */}
          {modalStep === 1 && (
            <div className="space-y-4">
              <Input
                label="نام و نام خانوادگی *"
                placeholder="مثال: سارا احمدی"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors((e) => ({ ...e, name: '' }));
                }}
                error={errors.name}
                rightIcon={<FiUser size={18} color={colors.textSecondary} />}
              />
              <Input
                label="شماره موبایل *"
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                value={toPersianDigit(phone)}
                onChangeText={(t) => {
                  setPhone(t.replace(/[^0-9]/g, '').slice(0, 11));
                  if (errors.phone) setErrors((e) => ({ ...e, phone: '' }));
                }}
                type="tel"
                maxLength={11}
                error={errors.phone}
                rightIcon={<FiPhone size={18} color={colors.textSecondary} />}
              />
            </div>
          )}

          {/* مرحله ۲: انتخاب خدمات */}
          {modalStep === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-[Vazir-Medium] mb-3" style={{ color: colors.textMain }}>
                خدماتی که این کارمند ارائه می‌دهد را انتخاب کنید:
              </p>

              {availableServices.length === 0 ? (
                <div
                  className="p-6 rounded-2xl border-2 border-dashed text-center"
                  style={{ borderColor: colors.border }}
                >
                  <p className="text-sm font-[Vazir]" style={{ color: colors.textSecondary }}>
                    هنوز خدمتی ثبت نشده است.
                    <br />
                    ابتدا در بخش «مدیریت خدمات»، خدمات را اضافه کنید.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableServices.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-right"
                        style={{
                          borderColor: isSelected ? colors.primary : colors.border,
                          backgroundColor: isSelected
                            ? colors.primary + '08'
                            : colors.cardBackground,
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: isSelected ? colors.primary : colors.border + '50',
                          }}
                        >
                          {isSelected && <FiCheck size={14} color="#fff" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className="text-sm font-[Vazir-Bold] block truncate"
                            style={{ color: colors.textMain }}
                          >
                            {service.name}
                          </span>
                          <span
                            className="text-xs font-[Vazir]"
                            style={{ color: colors.textSecondary }}
                          >
                            {service.typeName}
                          </span>
                        </div>
                        <span
                          className="text-xs font-[Vazir-Bold] flex-shrink-0"
                          style={{ color: colors.primary }}
                        >
                          {toPersianDigit(
                            (service.finalPrice || service.originalPrice || 0).toLocaleString(
                              'en-US'
                            )
                          )}{' '}
                          ت
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* شمارنده انتخاب‌ها */}
              {selectedServices.length > 0 && (
                <div
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border"
                  style={{
                    backgroundColor: colors.primary + '10',
                    borderColor: colors.primary + '30',
                  }}
                >
                  <FiCheck size={16} style={{ color: colors.primary }} />
                  <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.primary }}>
                    {toPersianDigit(selectedServices.length)} خدمت انتخاب شده
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
