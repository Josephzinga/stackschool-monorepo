import * as React from 'react';
import { type PopoverProps as PopoverPrimitiveProps, type PopoverTriggerProps as PopoverTriggerPrimitiveProps, type PopoverContentProps as PopoverContentPrimitiveProps, type PopoverCloseProps as PopoverClosePrimitiveProps } from '@/components/animate-ui/primitives/radix/popover';
type PopoverProps = PopoverPrimitiveProps;
declare function Popover(props: PopoverProps): React.JSX.Element;
type PopoverTriggerProps = PopoverTriggerPrimitiveProps;
declare function PopoverTrigger(props: PopoverTriggerProps): React.JSX.Element;
type PopoverContentProps = PopoverContentPrimitiveProps;
declare function PopoverContent({ className, align, sideOffset, ...props }: PopoverContentProps): React.JSX.Element;
type PopoverCloseProps = PopoverClosePrimitiveProps;
declare function PopoverClose(props: PopoverCloseProps): React.JSX.Element;
export { Popover, PopoverTrigger, PopoverContent, PopoverClose, type PopoverProps, type PopoverTriggerProps, type PopoverContentProps, type PopoverCloseProps, };
//# sourceMappingURL=popover.d.ts.map