import * as React from 'react';
import { type HTMLMotionProps } from 'motion/react';
import { type WithAsChild } from '@/components/animate-ui/primitives/animate/slot';
type ButtonProps = WithAsChild<HTMLMotionProps<'button'> & {
    hoverScale?: number;
    tapScale?: number;
}>;
declare function Button({ hoverScale, tapScale, asChild, ...props }: ButtonProps): React.JSX.Element;
export { Button, type ButtonProps };
//# sourceMappingURL=button.d.ts.map