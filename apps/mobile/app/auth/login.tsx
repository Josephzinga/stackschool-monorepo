import React from 'react';
import { SignInForm } from '@/components/sign-in-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'nativewind';
import { ToggleTheme } from '@/components/toggle-theme';
import { cn } from '@/lib/utils';

export default function Login() {
  const { colorScheme } = useColorScheme();
  console.log(colorScheme);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      extraHeight={20}
      contentContainerClassName={cn('bg-card')}>
      <SignInForm />
      <ToggleTheme />
    </KeyboardAwareScrollView>
  );
}
