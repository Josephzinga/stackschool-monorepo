import {useColorScheme} from 'nativewind';
import {Image, Text, TouchableOpacity} from 'react-native';

import React from 'react';
import {cn} from "@/lib/utils";

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

      <TouchableOpacity style={{width: '50%'}} className="flex h-[50px] flex-row justify-center gap-3  border border-border rounded-full items-center bg-card shadow-sm " onPress={onPress}>
        <Image

          className={cn(
            'size-4',
            className
          )}
          tintColor={strategy.useTint ? (colorScheme === 'dark' ? 'white' : 'black') : undefined}
          resizeMode="contain"
          source={strategy.source}
        />

        <Text className="font-jost-semibold font-semibold text-blue-700">{strategy.provider}</Text>
      </TouchableOpacity>

  );
}
