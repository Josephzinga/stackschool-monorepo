import React from 'react';
import {SignInForm} from '@/components/sign-in-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useColorScheme} from 'nativewind';

export default function Login() {
  const { colorScheme } = useColorScheme();

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      extraHeight={75}
      contentContainerClassName={'w-full h-full'}>
        <SignInForm />
    </KeyboardAwareScrollView>
  );
}
