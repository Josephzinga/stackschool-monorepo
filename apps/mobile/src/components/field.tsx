import { cn } from '@/lib/utils';
import React from 'react';
import { Text } from 'react-native';
export const FieldError = ({
  children,
  className,
}: {
  children?: string | React.ReactElement;
  className?: string;
}) => {
  return <Text className={cn('text-xs text-red-500', className)}>{children}</Text>;
};
