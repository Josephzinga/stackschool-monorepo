import * as React from 'react';
import { type HoverCardProps as HoverCardPrimitiveProps, type HoverCardTriggerProps as HoverCardTriggerPrimitiveProps, type HoverCardContentProps as HoverCardContentPrimitiveProps } from '@/components/animate-ui/primitives/radix/hover-card';
type HoverCardProps = HoverCardPrimitiveProps;
declare function HoverCard(props: HoverCardProps): React.JSX.Element;
type HoverCardTriggerProps = HoverCardTriggerPrimitiveProps;
declare function HoverCardTrigger(props: HoverCardTriggerProps): React.JSX.Element;
type HoverCardContentProps = HoverCardContentPrimitiveProps;
declare function HoverCardContent({ className, align, sideOffset, ...props }: HoverCardContentProps): React.JSX.Element;
export { HoverCard, HoverCardTrigger, HoverCardContent, type HoverCardProps, type HoverCardTriggerProps, type HoverCardContentProps, };
//# sourceMappingURL=hover-card.d.ts.map