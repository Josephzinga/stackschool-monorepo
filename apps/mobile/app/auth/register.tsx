import React from 'react';
import { SignUpForm } from '@/components/sign-up-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Register() {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="bg-card"
      keyboardDismissMode="interactive"
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      extraHeight={20}>
      <SignUpForm />
    </KeyboardAwareScrollView>
  );
}
