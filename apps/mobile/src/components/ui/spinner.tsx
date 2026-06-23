import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  variant?: 'default' | 'minimal' | 'withBackground';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'large',
  color = '#3B82F6',
  text,
  variant = 'default',
}) => {
  const getContainerClass = () => {
    switch (variant) {
      case 'minimal':
        return 'p-2';
      case 'withBackground':
        return 'p-6 bg-gray-100 rounded-2xl shadow-md';
      default:
        return 'p-4';
    }
  };

  const getTextClass = () => {
    switch (variant) {
      case 'minimal':
        return 'text-sm text-gray-500 mt-1';
      case 'withBackground':
        return 'text-base font-semibold text-gray-800 mt-3';
      default:
        return 'text-base text-gray-700 mt-2';
    }
  };

  return (
    <View className={`items-center justify-center ${getContainerClass()}`}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text className={getTextClass()}>{text}</Text>}
    </View>
  );
};

export default Spinner;
