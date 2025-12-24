import { View } from 'react-native';
import React from 'react';
import GoogleLoginButton from './google-button';
import FacebookLoginButton from './facebook-button';

export const SocialSections = () => (
  <View className="mt-6 space-y-4">
    <GoogleLoginButton />
  </View>
);
