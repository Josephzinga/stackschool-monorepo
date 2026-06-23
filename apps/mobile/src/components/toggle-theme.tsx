import { useColorScheme } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { cn } from '@/lib/utils';

export function ToggleTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <View
      className={cn('flex h-8 w-8 items-center justify-center rounded-lg border-2 border-border ')}>
      <TouchableOpacity onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
        {colorScheme === 'dark' ? (
          <Moon size={20} color="white" />
        ) : (
          <Sun color="black" size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
}
