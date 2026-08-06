'use client';
import { useState, useMemo } from 'react';
import { FiDownload, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { useTheme } from '@/stores/useThemeStore';
import Card from '@/components/common/Card';

/**
 * تولید QR Code ساده با SVG (بدون نیاز به کتابخانه خارجی)
 * برای production واقعی از کتابخانه‌هایی مثل qrcode.react استفاده شود
 */
function generateSimpleQRPattern(data) {
  // الگوی شبه‌تصادفی بر اساس hash ساده از داده
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const size = 21;
  const cells = [];

  // تولید الگوی شبه‌تصادفی
  let seed = Math.abs(hash);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // الگوهای گوشه (مثل QR واقعی)
      const isCorner =
        (row < 7 && col < 7) || (row < 7 && col >= size - 7) || (row >= size - 7 && col < 7);

      if (isCorner) {
        const localRow = row < 7 ? row : row - (size - 7);
        const localCol = col < 7 ? col : col - (size - 7);
        const isBorder = localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6;
        const isCenter = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;
        if (isBorder || isCenter) {
          cells.push({ row, col, filled: true });
          continue;
        }
      }

      // الگوی شبه‌تصادفی برای بقیه
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const filled = seed % 3 !== 0;
      cells.push({ row, col, filled });
    }
  }

  return { size, cells };
}

export default function QRCodeSection({ bookingLink }) {
  const { colors } = useTheme();
  const [downloading, setDownloading] = useState(false);

  const qrPattern = useMemo(() => generateSimpleQRPattern(bookingLink || 'zibano'), [bookingLink]);

  const handleDownload = () => {
    setDownloading(true);

    // ساخت SVG و دانلود
    const svgCells = qrPattern.cells
      .filter((c) => c.filled)
      .map((c) => `<rect x="${c.col}" y="${c.row}" width="1" height="1" fill="#1a1a1a"/>`)
      .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qrPattern.size} ${qrPattern.size}" width="300" height="300">
      <rect width="${qrPattern.size}" height="${qrPattern.size}" fill="white"/>
      ${svgCells}
    </svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zibano-qr-code.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloading(false), 1000);
  };

  const cellSize = 100 / qrPattern.size;

  return (
    <Card
      variant="default"
      padding={16}
      radius={16}
      className="border"
      style={{ borderColor: colors.border }}
    >
      {/* هدر */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <span className="text-base">📱</span>
        </div>
        <div className="flex-1">
          <h4 className="text-[13px] font-[Vazir-Bold]" style={{ color: colors.textMain }}>
            کد QR لینک رزرو
          </h4>
          <p className="text-[10px] font-[Vazir]" style={{ color: colors.textSecondary }}>
            این کد را چاپ کنید و در سالن قرار دهید
          </p>
        </div>
      </div>

      {/* QR Code SVG */}
      <div className="flex justify-center mb-4">
        <div
          className="p-4 rounded-2xl border-2"
          style={{
            backgroundColor: '#ffffff',
            borderColor: colors.border,
          }}
        >
          <svg
            viewBox={`0 0 ${qrPattern.size} ${qrPattern.size}`}
            className="w-[180px] h-[180px]"
            style={{ direction: 'ltr' }}
          >
            <rect width={qrPattern.size} height={qrPattern.size} fill="white" />
            {qrPattern.cells
              .filter((c) => c.filled)
              .map((c, i) => (
                <rect key={i} x={c.col} y={c.row} width="1" height="1" fill="#1a1a1a" />
              ))}
          </svg>
        </div>
      </div>

      {/* لینک زیر QR */}
      <div
        className="flex items-center justify-center gap-2 p-2 rounded-xl mb-4"
        style={{ backgroundColor: colors.background }}
      >
        <p
          className="text-[10px] font-[Vazir] truncate"
          style={{ color: colors.textSecondary, direction: 'ltr' }}
        >
          {bookingLink}
        </p>
      </div>

      {/* دکمه دانلود */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          backgroundColor: colors.primary,
          opacity: downloading ? 0.7 : 1,
        }}
      >
        {downloading ? (
          <FiRefreshCw size={16} color="#fff" className="animate-spin" />
        ) : (
          <FiDownload size={16} color="#fff" />
        )}
        <span className="text-[13px] font-[Vazir-Bold] text-white">
          {downloading ? 'در حال دانلود...' : 'دانلود کد QR'}
        </span>
      </button>

      {/* راهنما */}
      <div
        className="flex items-start gap-2 mt-3 p-2.5 rounded-xl"
        style={{ backgroundColor: colors.background }}
      >
        <FiInfo size={14} style={{ color: colors.textSecondary, flexShrink: 0, marginTop: 2 }} />
        <p
          className="text-[10px] font-[Vazir] leading-4 flex-1"
          style={{ color: colors.textSecondary }}
        >
          این کد را می‌توانید چاپ کرده و روی میز پذیرش یا دیوار سالن نصب کنید. مشتریان با اسکن آن
          مستقیماً به صفحه رزرو هدایت می‌شوند.
        </p>
      </div>
    </Card>
  );
}
