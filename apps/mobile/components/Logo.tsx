import { Image, Text, View } from 'react-native';
import React from 'react';
import { cn } from '@/lib/utils';

export default function Logo() {
  return (
    <View className="mt-10 flex w-full items-center justify-center">
      <Image
        source={require('./../assets/android-icon.png')}
        className={cn('h-24 w-24')}
        resizeMode="contain"
        accessibilityLabel="Logo"
      />

      <Text className="font-jost-bold text-2xl text-blue-900">Stackschool</Text>
    </View>
  );
}
