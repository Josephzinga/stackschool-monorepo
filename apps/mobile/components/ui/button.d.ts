import { type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';
import React from 'react';
declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "icon" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare const buttonTextVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "icon" | "sm" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type ButtonProps = React.ComponentProps<typeof Pressable> & React.RefAttributes<typeof Pressable> & VariantProps<typeof buttonVariants>;
declare function Button({ className, variant, size, ...props }: ButtonProps): React.JSX.Element;
export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
//# sourceMappingURL=button.d.ts.map