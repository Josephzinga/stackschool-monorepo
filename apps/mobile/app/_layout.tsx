import { Stack } from 'expo-router';
import React from 'react';
import './globals.css';
import { ThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '@/lib/theme';
import { colorScheme } from 'nativewind';
import { PortalHost } from '@rn-primitives/portal';

export default function RootLayout() {
  return (
    <ThemeProvider value={NAV_THEME[colorScheme.get() ?? 'light']}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
