// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zibano.app',
  appName: 'زیبانو',
  webDir: 'out',
  backgroundColor: '#F5F0EC',
  android: {
    // ✅ مهم: edge-to-edge را فعال می‌کند
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: false,   // دستی hide میکنیم
      backgroundColor: '#F5F0EC',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },

    StatusBar: {
      // ✅ استایل transparent برای استفاده از safe area
      style: 'DARK',
      backgroundColor: '#A88B7D',
      overlaysWebView: true,
    },
  },
};

export default config;
