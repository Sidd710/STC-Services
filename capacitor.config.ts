import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techwise.stcservices',
  appName: 'STC Services',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#f7f7f7',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    StatusBar: {
      backgroundColor: '#e30613'
    }
  }
};

export default config;
