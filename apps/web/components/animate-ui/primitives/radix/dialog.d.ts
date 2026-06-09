import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { type HTMLMotionProps } from 'motion/react';
type DialogContextType = {
    isOpen: boolean;
    setIsOpen: DialogProps['onOpenChange'];
};
declare const useDialog: any;
type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;
declare function Dialog(props: DialogProps): React.JSX.Element;
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
declare function DialogTrigger(props: DialogTriggerProps): React.JSX.Element;
type DialogPortalProps = Omit<React.ComponentProps<typeof DialogPrimitive.Portal>, 'forceMount'>;
declare function DialogPortal(props: DialogPortalProps): React.JSX.Element;
type DialogOverlayProps = Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, 'forceMount' | 'asChild'> & HTMLMotionProps<'div'>;
declare function DialogOverlay({ transition, ...props }: DialogOverlayProps): React.JSX.Element;
type DialogFlipDirection = 'top' | 'bottom' | 'left' | 'right';
type DialogContentProps = Omit<React.ComponentProps<typeof DialogPrimitive.Content>, 'forceMount' | 'asChild'> & HTMLMotionProps<'div'> & {
    from?: DialogFlipDirection;
};
declare function DialogContent({ from, onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, transition, ...props }: DialogContentProps): React.JSX.Element;
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
declare function DialogClose(props: DialogCloseProps): React.JSX.Element;
type DialogHeaderProps = React.ComponentProps<'div'>;
declare function DialogHeader(props: DialogHeaderProps): React.JSX.Element;
type DialogFooterProps = React.ComponentProps<'div'>;
declare function DialogFooter(props: DialogFooterProps): React.JSX.Element;
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
declare function DialogTitle(props: DialogTitleProps): React.JSX.Element;
type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>;
declare function DialogDescription(props: DialogDescriptionProps): React.JSX.Element;
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, useDialog, type DialogProps, type DialogTriggerProps, type DialogPortalProps, type DialogCloseProps, type DialogOverlayProps, type DialogContentProps, type DialogHeaderProps, type DialogFooterProps, type DialogTitleProps, type DialogDescriptionProps, type DialogContextType, type DialogFlipDirection, };
//# sourceMappingURL=dialog.d.ts.map