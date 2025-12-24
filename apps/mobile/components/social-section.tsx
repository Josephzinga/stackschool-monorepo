import { View } from 'react-native';
import React from 'react';
import GoogleLoginButton from './google-button';
import FacebookLoginButton from './facebook-button';

export const SocialSections = () => (
  <View className="flex flex-col gap-5">
    <GoogleLoginButton />
     <FacebookLoginButton />
  </View>
);
