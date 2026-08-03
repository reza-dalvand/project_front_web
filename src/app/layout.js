// src/app/layout.js
import './globals.css';
import ThemeProvider from '@/components/providers/ThemeProvider';

export const metadata = {
  title: 'زیبانو | رزرو آنلاین خدمات زیبایی',
  description: 'رزرو آنلاین خدمات زیبایی و سلامت',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
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
                document.documentElement.setAttribute('data-theme-loaded', 'true'); // 👈 این خط رو اضافه کن
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}