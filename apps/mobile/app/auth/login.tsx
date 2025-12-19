import React from 'react';
import { SignInForm } from '@/components/sign-in-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';

export default function Login() {
  const { colorScheme } = useColorScheme();

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      extraHeight={20}
      contentContainerClassName={cn('mt-4', colorScheme === 'dark' && 'bg-slate-900')}>
      <SignInForm />
    </KeyboardAwareScrollView>
  );
}
