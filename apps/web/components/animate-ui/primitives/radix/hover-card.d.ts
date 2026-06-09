import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { type MotionValue, type HTMLMotionProps, type SpringOptions } from 'motion/react';
type HoverCardContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    x: MotionValue<number>;
    y: MotionValue<number>;
    followCursor?: boolean | 'x' | 'y';
    followCursorSpringOptions?: SpringOptions;
};
declare const useHoverCard: any;
type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive.Root> & {
    followCursor?: boolean | 'x' | 'y';
    followCursorSpringOptions?: SpringOptions;
};
declare function HoverCard({ followCursor, followCursorSpringOptions, ...props }: HoverCardProps): React.JSX.Element;
type HoverCardTriggerProps = React.ComponentProps<typeof HoverCardPrimitive.Trigger>;
declare function HoverCardTrigger({ onMouseMove, ...props }: HoverCardTriggerProps): React.JSX.Element;
type HoverCardPortalProps = Omit<React.ComponentProps<typeof HoverCardPrimitive.Portal>, 'forceMount'>;
declare function HoverCardPortal(props: HoverCardPortalProps): React.JSX.Element;
type HoverCardContentProps = React.ComponentProps<typeof HoverCardPrimitive.Content> & HTMLMotionProps<'div'>;
declare function HoverCardContent({ align, alignOffset, side, sideOffset, avoidCollisions, collisionBoundary, collisionPadding, arrowPadding, sticky, hideWhenDetached, style, transition, ...props }: HoverCardContentProps): React.JSX.Element;
type HoverCardArrowProps = React.ComponentProps<typeof HoverCardPrimitive.Arrow>;
declare function HoverCardArrow(props: HoverCardArrowProps): React.JSX.Element;
export { HoverCard, HoverCardTrigger, HoverCardPortal, HoverCardContent, HoverCardArrow, useHoverCard, type HoverCardProps, type HoverCardTriggerProps, type HoverCardPortalProps, type HoverCardContentProps, type HoverCardArrowProps, type HoverCardContextType, };
//# sourceMappingURL=hover-card.d.ts.map