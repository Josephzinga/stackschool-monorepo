import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useColorScheme } from 'nativewind';
import { Image, Linking, Platform, View } from 'react-native';

import React from 'react';
import { Text } from './ui/text';
const API_URL = process.env.API_URL!;

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: 'facebook',
    source: { uri: 'https://img.clerk.com/static/facebook.png?width=160' },
    useTint: false,
    url: `${API_URL}/auth/facebook`,
  },
  {
    type: 'google',
    source: { uri: 'https://img.clerk.com/static/google.png?width=160' },
    useTint: false,
    url: `${API_URL}/auth/google`,
  },
];

const handlePress = async (url: string) => {
  Linking.openURL(url);
};

export function SocialConnections() {
  const { colorScheme } = useColorScheme();

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="sm:flex-1"
            onPress={() => handlePress(strategy.url)}>
            <Image
              className={cn('size-4', strategy.useTint && Platform.select({ web: 'dark:invert' }))}
              tintColor={Platform.select({
                native: strategy.useTint ? (colorScheme === 'dark' ? 'white' : 'black') : undefined,
              })}
              source={strategy.source}
            />
            <Text>Connecter vous avec {strategy.type}</Text>
          </Button>
        );
      })}
    </View>
  );
}
