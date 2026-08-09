'use client';
import AuthModal from '@/components/common/AuthModal';

export default function AuthProvider({ children }) {
  return (
    <>
      {children}
      {/* Auth Modal سراسری - همیشه bottomsheet */}
      <AuthModal variant="bottomsheet" />
    </>
  );
}
