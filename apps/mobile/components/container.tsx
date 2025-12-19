import { cn } from '@/lib/utils';
import React from 'react';
import { View } from 'react-native';

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={cn(
      'flex min-h-screen w-full max-w-sm items-center justify-center gap-4 bg-slate-900',
      className
    )}>
    {children}
  </View>
);
