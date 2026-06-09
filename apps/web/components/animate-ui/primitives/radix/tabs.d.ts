import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { type HTMLMotionProps, type Transition } from 'motion/react';
import { type HighlightProps, type HighlightItemProps } from '@/components/animate-ui/primitives/effects/highlight';
import { type AutoHeightProps } from '@/components/animate-ui/primitives/effects/auto-height';
type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;
declare function Tabs(props: TabsProps): React.JSX.Element;
type TabsHighlightProps = Omit<HighlightProps, 'controlledItems' | 'value'>;
declare function TabsHighlight({ transition, ...props }: TabsHighlightProps): React.JSX.Element;
type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;
declare function TabsList(props: TabsListProps): React.JSX.Element;
type TabsHighlightItemProps = HighlightItemProps & {
    value: string;
};
declare function TabsHighlightItem(props: TabsHighlightItemProps): React.JSX.Element;
type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;
declare function TabsTrigger(props: TabsTriggerProps): React.JSX.Element;
type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content> & HTMLMotionProps<'div'>;
declare function TabsContent({ value, forceMount, transition, ...props }: TabsContentProps): React.JSX.Element;
type TabsContentsAutoProps = AutoHeightProps & {
    mode?: 'auto-height';
    children: React.ReactNode;
    transition?: Transition;
};
type TabsContentsLayoutProps = Omit<HTMLMotionProps<'div'>, 'transition'> & {
    mode: 'layout';
    children: React.ReactNode;
    transition?: Transition;
};
type TabsContentsProps = TabsContentsAutoProps | TabsContentsLayoutProps;
declare function TabsContents(props: TabsContentsProps): React.JSX.Element;
export { Tabs, TabsHighlight, TabsHighlightItem, TabsList, TabsTrigger, TabsContent, TabsContents, type TabsProps, type TabsHighlightProps, type TabsHighlightItemProps, type TabsListProps, type TabsTriggerProps, type TabsContentProps, type TabsContentsProps, };
//# sourceMappingURL=tabs.d.ts.map