import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beauclub.app',
  appName: 'BU Club',
  webDir: 'out',
  backgroundColor: '#F5F0EC',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
  SplashScreen: {
    launchShowDuration: 0,      // ✅ نیتیو فوراً مخفی می‌شود؛ اسپلش وب جایگزین است
    launchAutoHide: true,
    launchFadeOutDuration: 0,
    backgroundColor: '#F6E8E4',
    androidSplashResourceName: 'splash',
    splashFullScreen: true,
    splashImmersive: true,
    showSpinner: false,
    androidScaleType: 'CENTER_CROP',
  },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#A88B7D',
      overlaysWebView: true,
    },
  },
};

export default config;