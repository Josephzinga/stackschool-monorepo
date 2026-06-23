import React from 'react';
import { Tabs } from 'expo-router';

export default function CompleteProfileLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="complete-profile" options={{ title: 'Complete profile' }} />
    </Tabs>
  );
}
