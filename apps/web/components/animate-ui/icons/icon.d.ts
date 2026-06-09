import * as React from 'react';
import { type SVGMotionProps, type UseInViewOptions, type LegacyAnimationControls, type Variants, type HTMLMotionProps } from 'motion/react';
import { type WithAsChild } from '@/components/animate-ui/primitives/animate/slot';
declare const staticAnimations: {
    readonly path: Variants;
    readonly 'path-loop': Variants;
};
type StaticAnimations = keyof typeof staticAnimations;
type TriggerProp<T = string> = boolean | StaticAnimations | T;
type Trigger = TriggerProp<string>;
type AnimateIconContextValue = {
    controls: LegacyAnimationControls | undefined;
    animation: StaticAnimations | string;
    loop: boolean;
    loopDelay: number;
    active: boolean;
    animate?: Trigger;
    initialOnAnimateEnd?: boolean;
    completeOnStop?: boolean;
    persistOnAnimateEnd?: boolean;
    delay?: number;
};
type DefaultIconProps<T = string> = {
    animate?: TriggerProp<T>;
    animateOnHover?: TriggerProp<T>;
    animateOnTap?: TriggerProp<T>;
    animateOnView?: TriggerProp<T>;
    animateOnViewMargin?: UseInViewOptions['margin'];
    animateOnViewOnce?: boolean;
    animation?: T | StaticAnimations;
    loop?: boolean;
    loopDelay?: number;
    initialOnAnimateEnd?: boolean;
    completeOnStop?: boolean;
    persistOnAnimateEnd?: boolean;
    delay?: number;
};
type AnimateIconProps<T = string> = WithAsChild<HTMLMotionProps<'span'> & DefaultIconProps<T> & {
    children: React.ReactNode;
    asChild?: boolean;
}>;
type IconProps<T> = DefaultIconProps<T> & Omit<SVGMotionProps<SVGSVGElement>, 'animate'> & {
    size?: number;
};
type IconWrapperProps<T> = IconProps<T> & {
    icon: React.ComponentType<IconProps<T>>;
};
declare function useAnimateIconContext(): AnimateIconContextValue | {
    controls: undefined;
    animation: string;
    loop: undefined;
    loopDelay: undefined;
    active: undefined;
    animate: undefined;
    initialOnAnimateEnd: undefined;
    completeOnStop: undefined;
    persistOnAnimateEnd: undefined;
    delay: undefined;
};
declare function AnimateIcon({ asChild, animate, animateOnHover, animateOnTap, animateOnView, animateOnViewMargin, animateOnViewOnce, animation, loop, loopDelay, initialOnAnimateEnd, completeOnStop, persistOnAnimateEnd, delay, children, ...props }: AnimateIconProps): React.JSX.Element;
declare const pathClassName = "[&_[stroke-dasharray='1px_1px']]:![stroke-dasharray:1px_0px]";
declare function IconWrapper<T extends string>({ size, animation: animationProp, animate, animateOnHover, animateOnTap, animateOnView, animateOnViewMargin, animateOnViewOnce, icon: IconComponent, loop, loopDelay, persistOnAnimateEnd, initialOnAnimateEnd, delay, completeOnStop, className, ...props }: IconWrapperProps<T>): React.JSX.Element;
declare function getVariants<V extends {
    default: T;
    [key: string]: T;
}, T extends Record<string, Variants>>(animations: V): T;
export { pathClassName, staticAnimations, AnimateIcon, IconWrapper, useAnimateIconContext, getVariants, type IconProps, type IconWrapperProps, type AnimateIconProps, type AnimateIconContextValue, };
//# sourceMappingURL=icon.d.ts.map