import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/radix/tabs';

import { cn } from '@/lib/utils';

export function AppTabs({
  children,
  defaultValue,
  className,
}: {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <Tabs defaultValue={defaultValue} className={cn('w-full', className)}>
      {children}
    </Tabs>
  );
}

export function AppTabsTrigger({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-[5px] font-poppins font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-accent/40 px-4 py-2"
    >
      {children}
    </TabsTrigger>
  );
}
export function AppTabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TabsList
      className={cn(
        'w-full bg-accent justify-start border-b rounded-sm p-0 h-auto no-scrollbar overflow-x-auto no-scrollbar md:[scrollbar-width:auto] md:[&::-webkit-scrollbar]:block',
        className,
      )}
    >
      {children}
    </TabsList>
  );
}

export function AppTabsContent({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <TabsContent className={cn(className)} value={value}>
      {children}
    </TabsContent>
  );
}
