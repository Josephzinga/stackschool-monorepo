import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import './globals.css';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { PortalHost } from '@rn-primitives/portal';
import { authService } from '@stackschool/shared';
import Toast from 'react-native-toast-message';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { declareFonts } from '@/lib/Fonts';
import { NAV_THEME } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();
const IP_ADDRESS = '192.168.101.135';
const API_PORT = 4000;
const API_URL = `http://${IP_ADDRESS}:${API_PORT}`;

export default function RootLayout() {
  const [loaded, error] = useFonts(declareFonts);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    authService.setBaseUrl(API_URL);
    console.log(authService.getApiBaseUrl());
  }, [IP_ADDRESS, API_PORT]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <Toast />
      <PortalHost />
    </ThemeProvider>
  );
}
