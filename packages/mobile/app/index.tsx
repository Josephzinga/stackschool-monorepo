import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import React from "react";

export default function Home() {
  return (
    <View className="w-full h-full flex justify-center items-center">
      <Text>Home page</Text>

      <Pressable onPress={() => router.push("/auth/login")}>
        <Text className="p-4 bg-blue-500 rounded-lg">Go to Login</Text>
      </Pressable>
    </View>
  );
}
