import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { ToggleTheme } from '@/components/toggle-theme';
import { getSafeMe } from '@stackschool/ui';

export default function Home() {
  return (
    <View className="flex h-full w-full items-center justify-center">
      <Text className="font-inter-semibold text-xl text-card">Home page joseph</Text>
      <ToggleTheme />
      <View className="p flex w-1/2 flex-col gap-4">
        <Pressable onPress={() => router.push('/auth/login')}>
          <Text className="font-inter-semibold rounded-lg bg-slate-100 p-4 dark:bg-blue-700">
            Go to Login page
          </Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            const me = await getSafeMe();
            console.log('Me', me);
          }}>
          <Text className="font-inter-semibold rounded-lg bg-slate-100 p-4 dark:bg-blue-700">
            Get me
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
