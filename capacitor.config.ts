
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9d26a0376e064ca6b7a1c402e1f68291',
  appName: 'msuper-pos-kenya-pay',
  webDir: 'dist',
  server: {
    url: 'https://www.digitalden.co.ke',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
