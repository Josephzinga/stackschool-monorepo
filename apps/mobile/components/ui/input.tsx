import { cn } from '@/lib/utils';
import { TextInput, type TextInputProps, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface InputProps extends TextInputProps, React.RefAttributes<TextInput> {
  Icon?: LucideIcon;
  RightIcon?: LucideIcon;
  isPassword?: boolean;
  error?: boolean;
  borderColor?: string;
  activeBorderColor?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      className,
      Icon,
      RightIcon,
      isPassword,
      error,
      onBlur,
      onFocus,
      borderColor = '#E5E7EB', // gray-200
      activeBorderColor = '#3B82F6', // blue-500 (primary)
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const PasswordIcon = showPassword ? EyeOff : Eye;
    const FinalRightIcon = isPassword ? PasswordIcon : RightIcon;

    const focusProgress = useSharedValue(0);

    const handlePress = () => {
      if (isPassword) {
        setShowPassword(!showPassword);
      }
    };

    const handleFocus = (e: any) => {
      focusProgress.value = withTiming(1, { duration: 200 });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      focusProgress.value = withTiming(0, { duration: 200 });
      onBlur?.(e);
    };

    const animatedStyle = useAnimatedStyle(() => {
      const borderColorValue = interpolateColor(
        focusProgress.value,
        [0, 1],
        [error ? '#EF4444' : borderColor, error ? '#EF4444' : activeBorderColor]
      );

      return {
        borderColor: borderColorValue,
        borderWidth: 1, // Toujours une bordure
      };
    });

    return (
      <View className="relative w-full">
        {Icon && (
          <View className="absolute left-3 top-0 z-10 h-full justify-center">
            <Icon size={20} color={'gray'} />
          </View>
        )}
        <AnimatedTextInput
          ref={ref}
          className={cn(
            'h-[50px] w-full rounded-2xl bg-white shadow-sm shadow-black/5 dark:placeholder:text-muted-foreground/50',
            Icon ? 'pl-12' : 'pl-4',
            FinalRightIcon ? 'pr-12' : 'pr-4',
            className
          )}
          style={animatedStyle}
          secureTextEntry={isPassword ? !showPassword : props.secureTextEntry}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {FinalRightIcon && (
          <View className="absolute right-3 top-0 z-10 h-full justify-center">
            {isPassword ? (
              <TouchableOpacity onPress={handlePress} className="h-full justify-center">
                <FinalRightIcon size={20} color={'gray'} />
              </TouchableOpacity>
            ) : (
              <FinalRightIcon size={20} color={'gray'} />
            )}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
