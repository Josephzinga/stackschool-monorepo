import * as React from 'react';
import { type TabsProps as TabsPrimitiveProps, type TabsListProps as TabsListPrimitiveProps, type TabsTriggerProps as TabsTriggerPrimitiveProps, type TabsContentProps as TabsContentPrimitiveProps, type TabsContentsProps as TabsContentsPrimitiveProps } from '@/components/animate-ui/primitives/radix/tabs';
type TabsProps = TabsPrimitiveProps;
declare function Tabs({ className, ...props }: TabsProps): React.JSX.Element;
type TabsListProps = TabsListPrimitiveProps;
declare function TabsList({ className, ...props }: TabsListProps): React.JSX.Element;
type TabsTriggerProps = TabsTriggerPrimitiveProps;
declare function TabsTrigger({ className, ...props }: TabsTriggerProps): React.JSX.Element;
type TabsContentsProps = TabsContentsPrimitiveProps;
declare function TabsContents(props: TabsContentsProps): React.JSX.Element;
type TabsContentProps = TabsContentPrimitiveProps;
declare function TabsContent({ className, ...props }: TabsContentProps): React.JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent, type TabsProps, type TabsListProps, type TabsTriggerProps, type TabsContentsProps, type TabsContentProps, };
//# sourceMappingURL=tabs.d.ts.map