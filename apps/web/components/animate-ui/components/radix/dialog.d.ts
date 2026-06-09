import * as React from 'react';
import { type DialogProps as DialogPrimitiveProps, type DialogContentProps as DialogContentPrimitiveProps, type DialogDescriptionProps as DialogDescriptionPrimitiveProps, type DialogFooterProps as DialogFooterPrimitiveProps, type DialogHeaderProps as DialogHeaderPrimitiveProps, type DialogTitleProps as DialogTitlePrimitiveProps, type DialogTriggerProps as DialogTriggerPrimitiveProps, type DialogCloseProps as DialogClosePrimitiveProps } from '@/components/animate-ui/primitives/radix/dialog';
type DialogProps = DialogPrimitiveProps;
declare function Dialog(props: DialogProps): React.JSX.Element;
type DialogTriggerProps = DialogTriggerPrimitiveProps;
declare function DialogTrigger(props: DialogTriggerProps): React.JSX.Element;
type DialogCloseProps = DialogClosePrimitiveProps;
declare function DialogClose(props: DialogCloseProps): React.JSX.Element;
type DialogContentProps = DialogContentPrimitiveProps & {
    showCloseButton?: boolean;
};
declare function DialogContent({ className, children, showCloseButton, ...props }: DialogContentProps): React.JSX.Element;
type DialogHeaderProps = DialogHeaderPrimitiveProps;
declare function DialogHeader({ className, ...props }: DialogHeaderProps): React.JSX.Element;
type DialogFooterProps = DialogFooterPrimitiveProps;
declare function DialogFooter({ className, ...props }: DialogFooterProps): React.JSX.Element;
type DialogTitleProps = DialogTitlePrimitiveProps;
declare function DialogTitle({ className, ...props }: DialogTitleProps): React.JSX.Element;
type DialogDescriptionProps = DialogDescriptionPrimitiveProps;
declare function DialogDescription({ className, ...props }: DialogDescriptionProps): React.JSX.Element;
export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, type DialogProps, type DialogTriggerProps, type DialogCloseProps, type DialogContentProps, type DialogHeaderProps, type DialogFooterProps, type DialogTitleProps, type DialogDescriptionProps, };
//# sourceMappingURL=dialog.d.ts.map