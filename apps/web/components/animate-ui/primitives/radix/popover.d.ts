import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { type HTMLMotionProps } from 'motion/react';
type PopoverContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};
declare const usePopover: any;
type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;
declare function Popover(props: PopoverProps): React.JSX.Element;
type PopoverTriggerProps = React.ComponentProps<typeof PopoverPrimitive.Trigger>;
declare function PopoverTrigger(props: PopoverTriggerProps): React.JSX.Element;
type PopoverPortalProps = Omit<React.ComponentProps<typeof PopoverPrimitive.Portal>, 'forceMount'>;
declare function PopoverPortal(props: PopoverPortalProps): React.JSX.Element;
type PopoverContentProps = Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, 'forceMount' | 'asChild'> & HTMLMotionProps<'div'>;
declare function PopoverContent({ onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, align, alignOffset, side, sideOffset, avoidCollisions, collisionBoundary, collisionPadding, arrowPadding, sticky, hideWhenDetached, transition, ...props }: PopoverContentProps): React.JSX.Element;
type PopoverAnchorProps = React.ComponentProps<typeof PopoverPrimitive.Anchor>;
declare function PopoverAnchor({ ...props }: PopoverAnchorProps): React.JSX.Element;
type PopoverArrowProps = React.ComponentProps<typeof PopoverPrimitive.Arrow>;
declare function PopoverArrow(props: PopoverArrowProps): React.JSX.Element;
type PopoverCloseProps = React.ComponentProps<typeof PopoverPrimitive.Close>;
declare function PopoverClose(props: PopoverCloseProps): React.JSX.Element;
export { Popover, PopoverTrigger, PopoverPortal, PopoverContent, PopoverAnchor, PopoverClose, PopoverArrow, usePopover, type PopoverProps, type PopoverTriggerProps, type PopoverPortalProps, type PopoverContentProps, type PopoverAnchorProps, type PopoverCloseProps, type PopoverArrowProps, type PopoverContextType, };
//# sourceMappingURL=popover.d.ts.map