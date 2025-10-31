import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lui2mi.queruta',
  appName: 'Q\'ruta',
  webDir: 'www',
  backgroundColor: '#011f35',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#011f35',
      //androidSplashResourceName: 'launch_splash'
    }
  },
  android: {
    adjustMarginsForEdgeToEdge: "force"
  }
};

export default config;
