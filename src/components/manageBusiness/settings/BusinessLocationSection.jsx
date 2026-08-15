// src/components/manageBusiness/settings/BusinessLocationSection.jsx
'use client';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import MapPicker from '@/components/common/MapPicker';
import SectionHeader from '@/components/common/SectionHeader';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';

export default function BusinessLocationSection({
  provinceId,
  cityId,
  address,
  location,
  errors,
  onProvinceChange,
  onCityChange,
  onAddressChange,
  onLocationSelect,
}) {
  const { colors } = useTheme();

  return (
    <div className="space-y-3">
      <SectionHeader icon={<FiMapPin size={18} />} iconColor="#E53935" title="موقعیت مکانی" />
      <Card variant="elevated" padding={16} radius={18}>
        {/* استان و شهر */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Dropdown
              label="استان *"
              placeholder="انتخاب استان"
              value={provinceId}
              options={PROVINCES}
              onSelect={onProvinceChange}
            />
          </div>
          <div>
            <Dropdown
              label="شهر *"
              placeholder={provinceId ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
              value={cityId}
              options={provinceId ? CITIES[provinceId] || [] : []}
              onSelect={onCityChange}
              disabled={!provinceId}
            />
          </div>
        </div>

        {/* آدرس */}
        <div>
          <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
            آدرس دقیق <span style={{ color: '#E53935' }}>*</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="خیابان، کوچه، پلاک، واحد..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm font-[Vazir] resize-none transition-colors"
            style={{
              backgroundColor: colors.background,
              borderColor: errors.address ? '#E53935' : colors.border,
              color: colors.textMain,
            }}
          />
          {errors.address && (
            <p className="text-xs text-[#E53935] mt-1.5">{errors.address}</p>
          )}
        </div>

        {/* نقشه */}
        <div>
          <label className="block text-sm font-[Vazir-Medium] mb-2" style={{ color: colors.textMain }}>
            موقعیت روی نقشه <span style={{ color: '#E53935' }}>*</span>
          </label>
          <MapPicker initialLocation={location} onLocationSelect={onLocationSelect} />
          {errors.location && (
            <p className="text-xs text-[#E53935] mt-1.5">{errors.location}</p>
          )}
        </div>
      </Card>
    </div>
  );
}