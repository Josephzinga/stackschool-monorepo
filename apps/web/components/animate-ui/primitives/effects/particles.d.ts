import * as React from 'react';
import { type HTMLMotionProps } from 'motion/react';
import { type WithAsChild } from '@/components/animate-ui/primitives/animate/slot';
import { type UseIsInViewOptions } from '@/hooks/use-is-in-view';
type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';
type ParticlesProps = WithAsChild<Omit<HTMLMotionProps<'div'>, 'children'> & {
    animate?: boolean;
    children: React.ReactNode;
} & UseIsInViewOptions>;
declare function Particles({ ref, animate, asChild, inView, inViewMargin, inViewOnce, children, style, ...props }: ParticlesProps): React.JSX.Element;
type ParticlesEffectProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
    side?: Side;
    align?: Align;
    count?: number;
    radius?: number;
    spread?: number;
    duration?: number;
    holdDelay?: number;
    sideOffset?: number;
    alignOffset?: number;
    delay?: number;
};
declare function ParticlesEffect({ side, align, count, radius, spread, duration, holdDelay, sideOffset, alignOffset, delay, transition, style, ...props }: ParticlesEffectProps): React.JSX.Element;
export { Particles, ParticlesEffect, type ParticlesProps, type ParticlesEffectProps, };
//# sourceMappingURL=particles.d.ts.map