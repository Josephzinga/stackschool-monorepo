import {Pressable, Text, View} from 'react-native';
import {router} from 'expo-router';
import React from 'react';
import {ToggleTheme} from '@/components/toggle-theme';

export default function Home() {
  return (
    <View className="flex h-full w-full items-center justify-center">
      <Text className="text-xl text-card font-inter-semibold">Home page joseph</Text>
      <ToggleTheme />
      <Pressable onPress={() => router.push('/auth/login')}>
        <Text className="rounded-lg dark:bg-blue-700 bg-slate-100 p-4 font-inter-semibold">Go to Login page</Text>
      </Pressable>
    </View>
  );
}
