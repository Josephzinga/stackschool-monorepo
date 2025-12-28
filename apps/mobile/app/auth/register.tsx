import React from 'react';
import {SignUpForm} from '@/components/sign-up-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function Register() {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      contentContainerClassName={'h-full w-full'}
      extraHeight={20}>
      <SignUpForm />
    </KeyboardAwareScrollView>
  );
}
