// src/app/model-request/detail/page.jsx
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ModelRequestDetailClient from './ModelRequestDetailClient';

function ModelRequestDetailPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <span className="text-5xl">👤</span>
        <h1 className="text-lg font-[Vazir-Bold]">درخواست مشخص نشده است</h1>
      </div>
    );
  }

  return <ModelRequestDetailClient requestId={id} />;
}

export default function ModelRequestDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ModelRequestDetailPageContent />
    </Suspense>
  );
}