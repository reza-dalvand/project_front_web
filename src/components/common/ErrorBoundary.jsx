// src/components/common/ErrorBoundary.jsx
'use client';

import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔥 ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onRetry }) {
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="max-w-md w-full p-8 rounded-3xl border text-center"
        style={{
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }}
      >
        {/* آیکون */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 
                     flex items-center justify-center"
          style={{ backgroundColor: '#E5393520' }}
        >
          <FiAlertTriangle size={40} color="#E53935" />
        </div>

        {/* عنوان */}
        <h1 className="text-xl mb-3" style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}>
          خطایی رخ داد
        </h1>

        {/* توضیحات */}
        <p
          className="text-sm mb-6 leading-6"
          style={{ color: colors.textSecondary, fontFamily: 'Vazir' }}
        >
          متاسفانه خطای غیرمنتظره‌ای رخ داده است. لطفاً صفحه را مجدداً بارگذاری کنید.
        </p>

        {/* جزئیات خطا */}
        {error && (
          <div
            className="p-4 rounded-xl mb-6 text-right overflow-auto max-h-32"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#E53935',
            }}
          >
            {error.toString()}
          </div>
        )}

        {/* دکمه تلاش مجدد */}
        <button
          onClick={onRetry}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2
                     transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: colors.primary,
            color: '#fff',
            fontFamily: 'Vazir-Bold',
            fontSize: '15px',
          }}
        >
          <FiRefreshCw size={18} />
          <span>تلاش مجدد</span>
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
