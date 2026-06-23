import { Stack } from 'expo-router';
import React from 'react';
import { NAV_THEME } from '../../lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="forgot-password" options={{ title: 'Forgot password' }} />
        <Stack.Screen name="finish" options={{ title: 'Finish' }} />
        <Stack.Screen name="verify-code" options={{ title: 'Verify code' }} />
        <Stack.Screen name="reset-password" options={{ title: 'Reset password' }} />
      </Stack>
    </ThemeProvider>
  );
}
