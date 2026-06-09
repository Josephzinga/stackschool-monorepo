import { TextInput, type TextInputProps } from 'react-native';
import React from 'react';
import { type LucideIcon } from 'lucide-react-native';
export interface InputProps extends TextInputProps, React.RefAttributes<TextInput> {
    Icon?: LucideIcon;
    RightIcon?: LucideIcon;
    isPassword?: boolean;
    error?: boolean;
    borderColor?: string;
    activeBorderColor?: string;
}
declare const Input: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<TextInput>>;
export { Input };
//# sourceMappingURL=input.d.ts.map