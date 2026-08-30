// src/app/business/page.jsx
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BusinessDetailsClient from './BusinessDetailsClient';

function BusinessPageContent() {
  const searchParams = useSearchParams();
  // ✅ پشتیبانی از slug (جدید) و id (برای سازگاری با عقب)
  const slug = searchParams.get('slug') || searchParams.get('id');
  
  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <span className="text-5xl">🔍</span>
        <h1 className="text-lg font-[Vazir-Bold] text-center">کسب‌وکاری مشخص نشده است</h1>
        <p className="text-sm text-center text-[var(--text-secondary)]">
          لطفاً از طریق جستجو یا دسته‌بندی، یک کسب‌وکار انتخاب کنید
        </p>
      </div>
    );
  }
  
  return <BusinessDetailsClient businessSlug={slug} />;
}

export default function BusinessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BusinessPageContent />
    </Suspense>
  );
}