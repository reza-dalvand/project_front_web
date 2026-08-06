// src/components/providers/AuthProvider.jsx
'use client';

import AuthBottomSheet from '@/components/common/AuthBottomSheet';

export default function AuthProvider({ children }) {
  return (
    <>
      {children}
      {/* Auth Bottom Sheet سراسری - همیشه در دسترس */}
      <AuthBottomSheet />
    </>
  );
}
