import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { type ThemeTogglerProps as ThemeTogglerPrimitiveProps, type ThemeSelection } from '@/components/animate-ui/primitives/effects/theme-toggler';
import { buttonVariants } from '@/components/animate-ui/components/buttons/icon';
type ThemeTogglerButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
    modes?: ThemeSelection[];
    onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
    direction?: ThemeTogglerPrimitiveProps['direction'];
};
declare function ThemeTogglerButton({ variant, size, modes, direction, onImmediateChange, onClick, className, ...props }: ThemeTogglerButtonProps): React.JSX.Element;
export { ThemeTogglerButton, type ThemeTogglerButtonProps };
//# sourceMappingURL=theme-toogle.d.ts.map