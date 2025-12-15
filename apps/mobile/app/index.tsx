import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import React from 'react';

export default function Home() {
  return (
    <View className="flex h-full w-full items-center justify-center">
      <Text>Home page joseph</Text>

      <Pressable onPress={() => router.push('/auth/login')}>
        <Text className="rounded-lg bg-blue-500 p-4">Go to Login page</Text>
      </Pressable>
    </View>
  );
}
