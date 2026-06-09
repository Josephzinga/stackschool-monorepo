import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { type ButtonProps as ButtonPrimitiveProps } from '@/components/animate-ui/primitives/buttons/button';
declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "accent" | null | undefined;
    size?: "default" | "sm" | "lg" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type IconButtonProps = Omit<ButtonPrimitiveProps, 'asChild'> & VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
};
declare function IconButton({ className, onClick, variant, size, children, ...props }: IconButtonProps): React.JSX.Element;
export { IconButton, buttonVariants, type IconButtonProps };
//# sourceMappingURL=icon.d.ts.map