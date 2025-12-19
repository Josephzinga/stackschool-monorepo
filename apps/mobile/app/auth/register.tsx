import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SignUpForm } from '@/components/sign-up-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Register() {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      extraHeight={20}>
      <SignUpForm />
    </KeyboardAwareScrollView>
  );
}
