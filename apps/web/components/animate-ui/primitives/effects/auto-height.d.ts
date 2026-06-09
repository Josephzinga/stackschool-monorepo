import * as React from 'react';
import { type HTMLMotionProps, type LegacyAnimationControls, type TargetAndTransition, type Transition } from 'motion/react';
import { WithAsChild } from '@/components/animate-ui/primitives/animate/slot';
type AutoHeightProps = WithAsChild<{
    children: React.ReactNode;
    deps?: React.DependencyList;
    animate?: TargetAndTransition | LegacyAnimationControls;
    transition?: Transition;
} & Omit<HTMLMotionProps<'div'>, 'animate'>>;
declare function AutoHeight({ children, deps, transition, style, animate, asChild, ...props }: AutoHeightProps): React.JSX.Element;
export { AutoHeight, type AutoHeightProps };
//# sourceMappingURL=auto-height.d.ts.map