// src/components/manageBusiness/services/ServiceTypeIcon.jsx
'use client';
import { getServiceTypeConfig } from '@/constants/serviceTypes';

/**
* کامپوننت آیکون نوع خدمت
* @param {string} typeId - شناسه نوع خدمت (subService id)
* @param {number} size - اندازه آیکون (پیش‌فرض: 56)
*/
export default function ServiceTypeIcon({ typeId, size = 56 }) {
  const info = getServiceTypeConfig(typeId);
  const IconComponent = info.icon;
  const iconSize = size * 0.5;
  const innerSize = size * 0.78;
  
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        backgroundColor: info.gradient[0] + '60',
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: innerSize,
          height: innerSize,
          backgroundColor: info.gradient[1] + '40',
        }}
      >
        <IconComponent size={iconSize} style={{ color: info.color }} />
      </div>
    </div>
  );
}

export const getServiceTypeInfo = getServiceTypeConfig;