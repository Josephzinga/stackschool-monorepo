import {View} from 'react-native';
import React from 'react';
import GoogleLoginButton from './google-button';
import FacebookLoginButton from './facebook-button';

export const SocialSections = () => (
  <View className="flex flex-row justify-center gap-6 w-full ">
    <GoogleLoginButton />
    <FacebookLoginButton />
  </View>
);
