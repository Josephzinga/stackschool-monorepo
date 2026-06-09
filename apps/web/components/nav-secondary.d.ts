import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { SidebarGroup } from '@/components/ui/sidebar';
export interface NavSecondaryItem {
    items: {
        icon: LucideIcon;
        label: string;
        href: string;
    }[];
}
export declare function NavSecondary({ items, ...props }: {
    items: NavSecondaryItem['items'];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>): React.JSX.Element;
//# sourceMappingURL=nav-secondary.d.ts.map