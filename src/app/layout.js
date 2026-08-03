// src/app/layout.js
import './globals.css';
import Providers from '@/components/providers';
import Script from 'next/script';

// ═══════ Metadata (بدون viewport و themeColor) ═══════
export const metadata = {
  title: 'زیبانو | رزرو آنلاین خدمات زیبایی و سلامت',
  description:
    'رزرو آنلاین خدمات زیبایی، سلامت، سالن‌ها، کلینیک‌ها و متخصصان زیبایی',
  keywords: [
    'زیبانو',
    'رزرو آنلاین',
    'سالن زیبایی',
    'کلینیک پوست',
    'لیزر',
    'فیشیال',
    'ناخن',
    'میکاپ',
  ],
  authors: [{ name: 'Zibano Team' }],
  manifest: '/manifest.json',
};

// ═══════ Viewport (جدا از metadata) ═══════
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#A88B7D',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Meta Tags برای SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta property="og:title" content="زیبانو | رزرو آنلاین خدمات زیبایی" />
        <meta property="og:description" content="رزرو آنلاین خدمات زیبایی و سلامت" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preconnect برای تصاویر */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="preconnect" href="https://i.pravatar.cc" />

        {/* Script برای جلوگیری از Flash تم */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storage = localStorage.getItem('zibano-theme-storage');
                  if (storage) {
                    const parsed = JSON.parse(storage);
                    const theme = parsed.state?.theme || 'system';
                    let resolved = theme;
                    if (theme === 'system') {
                      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? 'dark' : 'light';
                    }
                    if (resolved === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}