import { Image, Text, View } from 'react-native';

import React from 'react';
import { cn } from '@/lib/utils';

export default function Logo() {
  return (
    <View className="flex w-full items-center justify-center">
      <Image source={require('./../assets/android-icon.png')} className={cn('h-12 w-12')} />
      <Text className="bg-transparent bg-gradient-to-r from-blue-900  to-violet-900 bg-clip-text text-2xl font-bold">
        Stackschool
      </Text>
    </View>
  );
}
