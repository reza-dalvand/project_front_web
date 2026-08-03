// src/middleware.js
import { NextResponse } from 'next/server';

// ═══════════════════════════════════════════
//    Middleware غیرفعال شده
//    احراز هویت در سمت کلاینت (Zustand) مدیریت می‌شود
// ═══════════════════════════════════════════
export function middleware(request) {
  // فعلاً غیرفعال - احراز هویت client-side است
  return NextResponse.next();
}

export const config = {
  matcher: [], // خالی = هیچ مسیری را match نمی‌کند
};