import { cn } from '@/lib/utils';
import { Platform, TextInput, type TextInputProps, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export interface InputProps extends TextInputProps, React.RefAttributes<TextInput> {
  Icon?: LucideIcon;
  RightIcon?: LucideIcon;
  isPassword?: boolean;
  isValid?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ className, Icon, RightIcon, isPassword, isValid, onBlur, onFocus, ...props }, ref) => {
  
    const [showPassword, setShowPassword] = useState(false);
    const PasswordIcon = showPassword ? EyeOff : Eye;
    const FinalRightIcon = isPassword ? PasswordIcon : RightIcon;

    const handlePress = () => {
      if (isPassword) {
        setShowPassword(!showPassword);
      }
    };

    return (
      <View className="relative">
        {Icon && (
          <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
            <Icon size={16} color="gray" />
          </View>
        )}
        <TextInput
          ref={ref}
          className={cn(
            Icon ? 'pl-10' : 'pl-3',
            FinalRightIcon ? 'pr-10' : 'pr-3',
            'flex h-10 w-full min-w-0 flex-row items-center rounded-md border border-input bg-background py-1 text-base leading-5 text-foreground shadow-sm shadow-black/5 dark:bg-input/30 sm:h-9',
            isValid === false && 'border-destructive',
            props.editable === false &&
              cn(
                'opacity-50',
                Platform.select({
                  web: 'disabled:pointer-events-none disabled:cursor-not-allowed',
                })
              ),
            Platform.select({
              web: cn(
                'outline-none transition-[color,box-shadow] selection:bg-primary placeholder:text-muted-foreground md:text-sm',
                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
              ),
              native: 'placeholder:text-muted-foreground/50',
            }),
            className
          )}
          secureTextEntry={isPassword ? !showPassword : props.secureTextEntry}
          onBlur={onBlur}
          onFocus={onFocus}
          {...props}
        />
        {FinalRightIcon && (
          <View className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
            {isPassword ? (
              <TouchableOpacity onPress={handlePress}>
                <FinalRightIcon size={16} color={'gray'} />
              </TouchableOpacity>
            ) : (
              <FinalRightIcon size={16} className="text-blue-600 dark:text-slate-400" />
            )}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
