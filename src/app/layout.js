// src/app/layout.js
import './globals.css';
import Providers from '@/components/providers';
import Script from 'next/script';
import SplashScreenHider from '@/components/providers/SplashScreenHider'; // ✅ اضافه شد

export const metadata = {
  title: 'بیو کلاب | رزرو آنلاین خدمات زیبایی و سلامت',
  description: 'رزرو آنلاین خدمات زیبایی، سلامت، سالن‌ها، کلینیک‌ها و متخصصان زیبایی',
  keywords: ['بیو کلاب', 'رزرو آنلاین', 'سالن زیبایی', 'کلینیک پوست'],
  authors: [{ name: 'Zibano Team' }],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'بیو کلاب',
  },
  other: {
    'apple-touch-icon': '/icons/icon-192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F0EC' },
    { media: '(prefers-color-scheme: dark)', color: '#171412' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="بیو کلاب | رزرو آنلاین خدمات زیبایی" />
        <meta property="og:description" content="رزرو آنلاین خدمات زیبایی و سلامت" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="بیو کلاب" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="preconnect" href="https://i.pravatar.cc" />
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
                      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="sw-register"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              `,
            }}
          />
        )}
      </head>
      <body suppressHydrationWarning>
        {/* ✅ اسپلش اسکرین وب (PWA) - نمایش تصویر اسپلش */}
        <div
          id="web-splash-screen"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#F5F0EC',
            transition: 'opacity 0.6s ease-out',
          }}
        >
          <img
            src="/spalsh.png"
            alt="بیو کلاب - رزرو آنلاین خدمات زیبایی و سلامت"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        <SplashScreenHider />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
