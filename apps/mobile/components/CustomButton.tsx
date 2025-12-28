import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ArrowRight} from 'lucide-react-native';
import {Spinner} from './ui/spinner';
import {cn} from "@/lib/utils";

export function CustomButton({
  children,
  onPress,
  className,
  isSubmitting,
}: {
  children: string;
  onPress: () => void;
  className?: string;
  isSubmitting?: boolean;
}) {
  return (
    <TouchableOpacity
      className={cn("relative flex h-[50px] flex-row items-center justify-center gap-2 rounded-full bg-blue-700  pl-2 pr-1.5 text-white shadow-sm shadow-blue-700", className)}
      onPress={onPress}
      disabled={isSubmitting}>
      <Text className="font-jost-bold text-lg text-white">{children}</Text>
      <View
        className={
          'absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white'
        }>
        {isSubmitting ? <Spinner size="small" /> : <ArrowRight size={20} color="#1d4ed8" />}
      </View>
    </TouchableOpacity>
  );
}
