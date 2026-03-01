'use client';

import { IconCirclePlusFilled, IconMail } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavSecondaryItem } from './nav-secondary';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboard } from '@/components/providers/dashboard-provider';

export function NavMain({ items }: { items: NavSecondaryItem['items'] }) {
  const pathname = usePathname();
  const { me } = useDashboard();
  const role = me?.schoolContext?.role.toLowerCase();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link
                href={
                  item.label === 'Dashboard' ? `/dashboard/${role}` : item.href
                }
                className="w-full space-y-1"
              >
                <SidebarMenuButton
                  className="font-jost text-sm xl:text-base font-medium"
                  isActive={
                    (pathname.includes('dashboard') &&
                      item.href === '/dashboard') ||
                    item.href.includes(pathname)
                  }
                  tooltip={item.label}
                >
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
