// src/app/business/map/page.jsx
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BusinessMapClient from './BusinessMapClient';

function BusinessMapPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || searchParams.get('id');

  if (!slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <span className="text-5xl">🗺️</span>
        <h1 className="text-lg font-[Vazir-Bold]">کسب‌وکاری مشخص نشده است</h1>
      </div>
    );
  }

  return <BusinessMapClient businessSlug={slug} />;
}

export default function BusinessMapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BusinessMapPageContent />
    </Suspense>
  );
}
