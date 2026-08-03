import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.circleup.app',
  appName: 'CircleUp',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK', // dark icons, light background ki
      backgroundColor: '#FFFFFFFF'
    }
  }
};

export default config;