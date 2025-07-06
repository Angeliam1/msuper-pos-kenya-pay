
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9d26a0376e064ca6b7a1c402e1f68291',
  appName: 'msuper-pos',
  webDir: 'dist',
  server: {
    url: 'https://9d26a037-6e06-4ca6-b7a1-c402e1f68291.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#10B981',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#10B981'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
