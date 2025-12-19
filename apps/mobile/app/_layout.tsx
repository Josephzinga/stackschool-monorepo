import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import './globals.css';
import { ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '@/lib/theme';
import { colorScheme } from 'nativewind';
import { PortalHost } from '@rn-primitives/portal';
import { authService, IP_ADDRESS } from '@stackschool/shared';
import Toast from 'react-native-toast-message';

const API_PORT = 4000;

export default function RootLayout() {
  useEffect(() => {
    authService.setBaseUrl(process.env.API_URL! ?? 'http://localhost:4000');
    console.log(authService.getApiBaseUrl());
  }, [IP_ADDRESS, API_PORT]);
  return (
    <ThemeProvider value={NAV_THEME[colorScheme.get() ?? 'light']}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <Toast />
      <PortalHost />
    </ThemeProvider>
  );
}
