import { ExpoConfig, ConfigContext } from 'expo/config';
/*import * as dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.resolve(__dirname, ".env")})
*/
const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
const FACEBOOK_CLIENT_TOKEN = process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN;

if (!FACEBOOK_APP_ID || !FACEBOOK_CLIENT_TOKEN) {
  console.log("❌ Erreur : Les variables d'environnement Facebook sont manquantes !");
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'StackSchool',
  slug: 'stackschool',
  owner: 'josephzinga',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/android-icon.png',
  userInterfaceStyle: 'automatic',

  splash: {
    image: './assets/android-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0f172a',
  },

  assetBundlePatterns: ['**/*'],

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.stackschool.app',
    // N'oublie pas de mettre ton vrai code iOS ici si tu build pour iOS plus tard
   // googleServicesFile: './GoogleService-Info.plist',
  },

  android: {
    package: 'com.stackschool.app',
    // CRITIQUE : Cette ligne est obligatoire pour Google Sign-in sur Android
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON || './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/android-icon.png',
      backgroundColor: '#ffff',
    },
    softwareKeyboardLayoutMode: 'pan',
    edgeToEdgeEnabled: true,
    runtimeVersion: {
      policy: 'appVersion',
    },
  },

  web: {
    favicon: './assets/favicon.png',
  },

  experiments: {
    tsconfigPaths: true,
  },

  plugins: [
    'expo-web-browser',
    [
      '@react-native-google-signin/google-signin',
      {
        // Remplace par ton ID client iOS (trouvé dans Google Cloud)
        iosUrlScheme: 'com.googleusercontent.apps.TON_ID_ICI',
      },
    ],
    [
      'expo-secure-store',
      {
        configureAndroidBackup: true,
        faceIDPermission: 'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
      },
    ],
    [
      'react-native-fbsdk-next',
      {
        appID: FACEBOOK_APP_ID  || "1557139691952110",
        clientToken: FACEBOOK_CLIENT_TOKEN,
        scheme: `fb${FACEBOOK_APP_ID || "1557139691952110"}`,
        displayName: 'StackSchool',
        advertiserIDCollectionEnabled: false,
        autoLogAppEventsEnabled: false,
        isAutoInitEnabled: true,
        iosUserTrackingPermission:
          'This identifier will be used to deliver personalized ads to you.',
      },
    ],
  ],

  extra: {
    // On expose les IDs ici pour pouvoir les utiliser dans le code React avec Constants.expoConfig.extra
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    eas: {
      projectId: "4c496482-24f8-4c34-bb44-3de042051dbb"
    }
  },

  updates: {
    url: 'https://u.expo.dev/4c496482-24f8-4c34-bb44-3de042051dbb',
  },
});
