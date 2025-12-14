import { Stack } from "expo-router";
import React from "react";
import "./global.css";


export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}
