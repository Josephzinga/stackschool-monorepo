import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useColorScheme } from 'nativewind';
import { Image, Linking, Platform, View } from 'react-native';

import React from 'react';
import { Text } from './ui/text';

export type SocialStrategy = {
  provider: 'google' | 'facebook';
  source: { uri: string };
  useTint: boolean;
};

type SocialButtonProps = {
  strategy: SocialStrategy;
  onPress: () => Promise<void>;
  className?: string;
};

export function SocialButton({ strategy, onPress, className }: SocialButtonProps) {
  const { colorScheme } = useColorScheme();

  return (
  <View className="gap-2 sm:flex-row sm:gap-3">
      <Button variant="outline" size="sm" className="sm:flex-1" onPress={onPress}>
        <Image
          className={cn(
            'size-4',
            strategy.useTint && Platform.select({ web: 'dark:invert' }),
            className
          )}
          tintColor={Platform.select({
            native: strategy.useTint ? (colorScheme === 'dark' ? 'white' : 'black') : undefined,
          })}
          source={strategy.source}
        />
        <Text>Connecter vous avec {strategy.provider}</Text>
      </Button>
    </View>
  );
}
