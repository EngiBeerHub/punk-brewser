import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.punkbrewser',
  appName: 'Punk Brewser',
  webDir: 'www/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
