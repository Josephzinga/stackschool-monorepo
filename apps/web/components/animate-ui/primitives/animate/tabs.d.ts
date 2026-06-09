import * as React from 'react';
import { type Transition, type HTMLMotionProps } from 'motion/react';
import { type HighlightItemProps, type HighlightProps } from '@/components/animate-ui/primitives/effects/highlight';
import { type WithAsChild } from '@/components/animate-ui/primitives/animate/slot';
type TabsContextType = {
    activeValue: string;
    handleValueChange: (value: string) => void;
    registerTrigger: (value: string, node: HTMLElement | null) => void;
};
declare const useTabs: any;
type BaseTabsProps = React.ComponentProps<'div'> & {
    children: React.ReactNode;
};
type UnControlledTabsProps = BaseTabsProps & {
    defaultValue?: string;
    value?: never;
    onValueChange?: never;
};
type ControlledTabsProps = BaseTabsProps & {
    value: string;
    onValueChange?: (value: string) => void;
    defaultValue?: never;
};
type TabsProps = UnControlledTabsProps | ControlledTabsProps;
declare function Tabs({ defaultValue, value, onValueChange, children, ...props }: TabsProps): React.JSX.Element;
type TabsHighlightProps = Omit<HighlightProps, 'controlledItems' | 'value'>;
declare function TabsHighlight({ transition, ...props }: TabsHighlightProps): React.JSX.Element;
type TabsListProps = React.ComponentProps<'div'> & {
    children: React.ReactNode;
};
declare function TabsList(props: TabsListProps): React.JSX.Element;
type TabsHighlightItemProps = HighlightItemProps & {
    value: string;
};
declare function TabsHighlightItem(props: TabsHighlightItemProps): React.JSX.Element;
type TabsTriggerProps = WithAsChild<{
    value: string;
    children: React.ReactNode;
} & HTMLMotionProps<'button'>>;
declare function TabsTrigger({ ref, value, asChild, ...props }: TabsTriggerProps): React.JSX.Element;
type TabsContentsProps = HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    transition?: Transition;
};
declare function TabsContents({ children, transition, ...props }: TabsContentsProps): React.JSX.Element;
type TabsContentProps = WithAsChild<{
    value: string;
    children: React.ReactNode;
} & HTMLMotionProps<'div'>>;
declare function TabsContent({ value, style, asChild, ...props }: TabsContentProps): React.JSX.Element;
export { Tabs, TabsList, TabsHighlight, TabsHighlightItem, TabsTrigger, TabsContents, TabsContent, useTabs, type TabsProps, type TabsListProps, type TabsHighlightProps, type TabsHighlightItemProps, type TabsTriggerProps, type TabsContentsProps, type TabsContentProps, type TabsContextType, };
//# sourceMappingURL=tabs.d.ts.map