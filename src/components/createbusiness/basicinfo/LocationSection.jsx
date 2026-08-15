// src/components/createbusiness/basicinfo/LocationSection.jsx
'use client';
import { FiMapPin } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import MapPicker from '@/components/common/MapPicker';
import { PROVINCES, CITIES } from '@/constants/exploreFilters';

export default function LocationSection({
  provinceId,
  cityId,
  address,
  location,
  errors,
  onProvinceChange,
  onCityChange,
  onAddressChange,
  onLocationSelect,
  onAddressTouched,
}) {
  const { colors } = useTheme();

  return (
    <div className="space-y-3">
      {/* هدر بخش */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#E5393515' }}
        >
          <FiMapPin size={18} color="#E53935" />
        </div>
        <span className="text-sm font-[Vazir-Bold]" style={{ color: colors.textMain }}>
          موقعیت مکانی
        </span>
      </div>

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
              placeholder={provinceId ? 'انتخاب شهر' : 'ابتدا استان'}
              value={cityId}
              options={provinceId ? CITIES[provinceId] || [] : []}
              onSelect={onCityChange}
              disabled={!provinceId}
            />
          </div>
        </div>

        {/* آدرس */}
        <div>
          <label
            className="block text-sm font-[Vazir-Medium] mb-2"
            style={{ color: colors.textMain }}
          >
            آدرس دقیق سالن <span style={{ color: '#E53935' }}>*</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            onBlur={onAddressTouched}
            placeholder="خیابان، کوچه، پلاک، واحد..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm font-[Vazir] resize-none transition-colors"
            style={{
              backgroundColor: colors.background,
              borderColor: errors.address ? '#E53935' : colors.border,
              color: colors.textMain,
            }}
          />
          {errors.address && <p className="text-xs text-[#E53935] mt-1.5">{errors.address}</p>}
        </div>

        {/* نقشه */}
        <div>
          <label
            className="block text-sm font-[Vazir-Medium] mb-2"
            style={{ color: colors.textMain }}
          >
            موقعیت روی نقشه <span style={{ color: '#E53935' }}>*</span>
          </label>
          <MapPicker initialLocation={location} onLocationSelect={onLocationSelect} />
          {errors.location && <p className="text-xs text-[#E53935] mt-1.5">{errors.location}</p>}
        </div>
      </Card>
    </div>
  );
}
